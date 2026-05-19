import type {SortDescriptor} from "@heroui/react";
import {create} from "zustand";
import {fetchScreenerRows} from "../services/ScreenerApi";
import type {ScreenerFilters, StockRow} from "../types/Screener";

export const colorModeStorageKey = "stock-screener-color-mode";
export const filterPreferencesStorageKey = "stock-screener-filter-preferences";

const defaultFilters: ScreenerFilters = {
    sector: "All",
    marketCap: "+mid",
    order: "total_score",
    ascend: false,
};

const sectorFilterValues = new Set<string>([
    "All",
    "Basic Materials",
    "Communication Services",
    "Consumer Cyclical",
    "Consumer Defensive",
    "Energy",
    "Financial",
    "Healthcare",
    "Industrials",
    "Real Estate",
    "Technology",
    "Utilities",
]);

const marketCapFilterValues = new Set<string>(["+mid", "+large", "mid", "large", "mega"]);
const orderFilterValues = new Set<string>(["change_percent", "market_cap", "fundamental_score", "technical_score", "total_score", "volume"]);

interface ScreenerStore {
    error: string | null;
    filters: ScreenerFilters;
    isDarkMode: boolean;
    isLoading: boolean;
    query: string;
    reloadKey: number;
    rows: StockRow[];
    clearRows(): void;
    loadRows(apiToken: string, signal: AbortSignal): Promise<void>;
    retryRows(): void;
    setFilters(filters: ScreenerFilters): void;
    setQuery(query: string): void;
    sortRows(sortDescriptor: SortDescriptor): void;
    toggleDarkMode(): void;
}

export const useScreenerStore = create<ScreenerStore>()((set, get) => {
    return {
        error: null,
        filters: getInitialFilters(),
        isDarkMode: getInitialDarkMode(),
        isLoading: false,
        query: "",
        reloadKey: 0,
        rows: [],
        clearRows() {
            set({
                error: null,
                isLoading: false,
                rows: [],
            });
        },
        async loadRows(apiToken: string, signal: AbortSignal) {
            if (apiToken.length === 0) {
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
                const {filters, query} = get();
                const response = await fetchScreenerRows(filters, query, apiToken, signal);

                set({rows: response.data});
            } catch (fetchError) {
                if (signal.aborted) {
                    return;
                }

                set({error: fetchError instanceof Error ? fetchError.message : "載入選股資料失敗"});
            } finally {
                if (!signal.aborted) {
                    set({isLoading: false});
                }
            }
        },
        retryRows() {
            set(function (state) {
                return {reloadKey: state.reloadKey + 1};
            });
        },
        setFilters(filters: ScreenerFilters) {
            saveFilters(filters);
            set({filters});
        },
        setQuery(query: string) {
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

            saveFilters(nextFilters);
            set({filters: nextFilters});
        },
        toggleDarkMode() {
            set(function (state) {
                const isDarkMode = !state.isDarkMode;

                window.localStorage.setItem(colorModeStorageKey, isDarkMode ? "dark" : "light");

                return {isDarkMode};
            });
        },
    };
});

function getInitialFilters(): ScreenerFilters {
    const storedFilters = window.localStorage.getItem(filterPreferencesStorageKey);

    if (!storedFilters) {
        return defaultFilters;
    }

    try {
        return normalizeStoredFilters(JSON.parse(storedFilters));
    } catch {
        return defaultFilters;
    }
}

function normalizeStoredFilters(value: unknown): ScreenerFilters {
    if (!isRecord(value)) {
        return defaultFilters;
    }

    return {
        ascend: typeof value.ascend === "boolean" ? value.ascend : defaultFilters.ascend,
        marketCap: marketCapFilterValues.has(String(value.marketCap)) ? (String(value.marketCap) as ScreenerFilters["marketCap"]) : defaultFilters.marketCap,
        order: orderFilterValues.has(String(value.order)) ? (String(value.order) as ScreenerFilters["order"]) : defaultFilters.order,
        sector: sectorFilterValues.has(String(value.sector)) ? (String(value.sector) as ScreenerFilters["sector"]) : defaultFilters.sector,
    };
}

function saveFilters(filters: ScreenerFilters): void {
    window.localStorage.setItem(filterPreferencesStorageKey, JSON.stringify(filters));
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function getInitialDarkMode(): boolean {
    const storedColorMode = window.localStorage.getItem(colorModeStorageKey);

    if (storedColorMode === "dark") {
        return true;
    }

    if (storedColorMode === "light") {
        return false;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
