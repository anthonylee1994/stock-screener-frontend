import type {SortDescriptor} from "@heroui/react";
import {create} from "zustand";
import {screenerApi} from "@/services/screenerApi";
import type {ScreenerFilters, StockRow} from "@/types/screener";
import {ScreenerUtil} from "@/utils/ScreenerUtil";

const screenerPageLimit = 15;

interface ScreenerStore {
    error: string | null;
    filters: ScreenerFilters;
    hasMore: boolean;
    isLoadingMore: boolean;
    isLoading: boolean;
    loadMoreError: string | null;
    nextOffset: number | null;
    query: string;
    reloadKey: number;
    rows: StockRow[];
    totalCount: number;
    clearRows(): void;
    loadMoreRows(apiToken: string): Promise<void>;
    loadRows(apiToken: string, signal: AbortSignal): Promise<void>;
    retryRows(): void;
    setFilters(filters: ScreenerFilters): void;
    setQuery(query: string): void;
    sortRows(sortDescriptor: SortDescriptor): void;
}

export const useScreenerStore = create<ScreenerStore>()((set, get) => {
    let loadMoreRequestId = 0;

    return {
        error: null,
        filters: ScreenerUtil.getInitialFilters(),
        hasMore: false,
        isLoadingMore: false,
        isLoading: false,
        loadMoreError: null,
        nextOffset: null,
        query: "",
        reloadKey: 0,
        rows: [],
        totalCount: 0,
        clearRows() {
            loadMoreRequestId += 1;

            set({
                error: null,
                hasMore: false,
                isLoadingMore: false,
                isLoading: false,
                loadMoreError: null,
                nextOffset: null,
                rows: [],
                totalCount: 0,
            });
        },
        async loadMoreRows(apiToken: string) {
            const {filters, hasMore, isLoading, isLoadingMore, nextOffset, query} = get();

            if (apiToken.length === 0 || isLoading || isLoadingMore || !hasMore || nextOffset === null) {
                return;
            }

            const requestId = (loadMoreRequestId += 1);
            const requestKey = getRowsRequestKey(filters, query);

            set({
                isLoadingMore: true,
                loadMoreError: null,
            });

            try {
                const response = await screenerApi.fetchScreenerRows({
                    apiToken,
                    filters,
                    limit: screenerPageLimit,
                    offset: nextOffset,
                    search: query,
                    signal: new AbortController().signal,
                });

                if (requestId !== loadMoreRequestId || getRowsRequestKey(get().filters, get().query) !== requestKey || get().nextOffset !== nextOffset) {
                    return;
                }

                set(state => {
                    return {
                        hasMore: response.hasMore,
                        loadMoreError: null,
                        nextOffset: response.nextOffset,
                        rows: mergeRows(state.rows, response.data),
                        totalCount: response.count,
                    };
                });
            } catch (fetchError) {
                if (requestId !== loadMoreRequestId || getRowsRequestKey(get().filters, get().query) !== requestKey) {
                    return;
                }

                set({loadMoreError: fetchError instanceof Error ? fetchError.message : "載入更多股票失敗"});
            } finally {
                if (requestId === loadMoreRequestId) {
                    set({isLoadingMore: false});
                }
            }
        },
        async loadRows(apiToken: string, signal: AbortSignal) {
            loadMoreRequestId += 1;

            if (apiToken.length === 0) {
                set({
                    error: null,
                    hasMore: false,
                    isLoadingMore: false,
                    isLoading: false,
                    loadMoreError: null,
                    nextOffset: null,
                    rows: [],
                    totalCount: 0,
                });
                return;
            }

            set({
                error: null,
                hasMore: false,
                isLoadingMore: false,
                isLoading: true,
                loadMoreError: null,
                nextOffset: null,
            });

            try {
                const {filters, query} = get();
                const response = await screenerApi.fetchScreenerRows({
                    apiToken,
                    filters,
                    limit: screenerPageLimit,
                    offset: 0,
                    search: query,
                    signal,
                });

                set({
                    hasMore: response.hasMore,
                    nextOffset: response.nextOffset,
                    rows: response.data,
                    totalCount: response.count,
                });
            } catch (fetchError) {
                if (signal.aborted) {
                    return;
                }

                set({
                    error: fetchError instanceof Error ? fetchError.message : "載入選股資料失敗",
                    hasMore: false,
                    nextOffset: null,
                    rows: [],
                    totalCount: 0,
                });
            } finally {
                if (!signal.aborted) {
                    set({isLoading: false});
                }
            }
        },
        retryRows() {
            set(state => {
                return {reloadKey: state.reloadKey + 1};
            });
        },
        setFilters(filters: ScreenerFilters) {
            loadMoreRequestId += 1;
            ScreenerUtil.saveFilters(filters);
            set({filters});
        },
        setQuery(query: string) {
            loadMoreRequestId += 1;
            set({query});
        },
        sortRows(sortDescriptor: SortDescriptor) {
            const {filters} = get();
            const isChangingColumn = String(sortDescriptor.column) !== filters.order;
            const direction = isChangingColumn ? "descending" : sortDescriptor.direction;
            const nextFilters: ScreenerFilters = {
                ...filters,
                ascend: direction === "ascending",
                order: String(sortDescriptor.column) as ScreenerFilters["order"],
            };

            loadMoreRequestId += 1;
            ScreenerUtil.saveFilters(nextFilters);
            set({filters: nextFilters});
        },
    };
});

function getRowsRequestKey(filters: ScreenerFilters, query: string): string {
    return JSON.stringify({filters, query: query.trim()});
}

function mergeRows(currentRows: StockRow[], nextRows: StockRow[]): StockRow[] {
    const rowsByTicker = new Map<string, StockRow>();

    currentRows.forEach(row => {
        rowsByTicker.set(row.ticker.toUpperCase(), row);
    });

    nextRows.forEach(row => {
        rowsByTicker.set(row.ticker.toUpperCase(), row);
    });

    return Array.from(rowsByTicker.values());
}
