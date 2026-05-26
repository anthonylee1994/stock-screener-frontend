import {create} from "zustand";
import {screenerApi} from "@/services/screenerApi";
import type {ScreenerFilters, StockRow} from "@/types/screener";
import {WatchlistUtil} from "@/utils/WatchlistUtil";

interface WatchlistStore {
    error: string | null;
    isLoading: boolean;
    reloadKey: number;
    rows: StockRow[];
    tickers: string[];
    clearRows(): void;
    loadRows(filters: ScreenerFilters, apiToken: string, signal: AbortSignal): Promise<void>;
    retryRows(): void;
    toggleTicker(ticker: string): void;
}

export const useWatchlistStore = create<WatchlistStore>()((set, get) => {
    return {
        error: null,
        isLoading: false,
        reloadKey: 0,
        rows: [],
        tickers: WatchlistUtil.getInitialWatchlistTickers(),
        clearRows() {
            set({
                error: null,
                isLoading: false,
                rows: [],
            });
        },
        async loadRows(filters: ScreenerFilters, apiToken: string, signal: AbortSignal) {
            const tickers = get().tickers;

            if (apiToken.length === 0 || tickers.length === 0) {
                set({
                    error: null,
                    isLoading: false,
                    rows: [],
                });
                return;
            }

            set({
                error: null,
                isLoading: true,
            });

            try {
                const response = await screenerApi.fetchScreenerRows({
                    apiToken,
                    filters,
                    signal,
                    tickers,
                });

                set({rows: response.data});
            } catch (fetchError) {
                if (signal.aborted) {
                    return;
                }

                set({error: fetchError instanceof Error ? fetchError.message : "載入 Watchlist 失敗"});
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
        toggleTicker(ticker: string) {
            const normalizedTicker = WatchlistUtil.normalizeWatchlistTicker(ticker);

            if (!normalizedTicker) {
                return;
            }

            set(state => {
                const isWatched = state.tickers.includes(normalizedTicker);
                const tickers = isWatched ? state.tickers.filter(value => value !== normalizedTicker) : [...state.tickers, normalizedTicker];
                const rows = isWatched ? state.rows.filter(row => row.ticker.toUpperCase() !== normalizedTicker) : state.rows;

                WatchlistUtil.saveWatchlistTickers(tickers);

                return {rows, tickers};
            });
        },
    };
});
