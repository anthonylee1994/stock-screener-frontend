import type {ScreenerFilters} from "@/types/screener";

const colorModeStorageKey = "stock-screener-color-mode";
const filterPreferencesStorageKey = "stock-screener-filter-preferences";

const defaultFilters: ScreenerFilters = {
    sector: "All",
    marketCap: "+mid",
    order: "total_score",
    ascend: false,
    potentialStock: false,
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

function saveFilters(filters: ScreenerFilters): void {
    window.localStorage.setItem(filterPreferencesStorageKey, JSON.stringify(filters));
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

function saveDarkMode(isDarkMode: boolean): void {
    window.localStorage.setItem(colorModeStorageKey, isDarkMode ? "dark" : "light");
}

function normalizeStoredFilters(value: unknown): ScreenerFilters {
    if (!isRecord(value)) {
        return defaultFilters;
    }

    return {
        ascend: typeof value.ascend === "boolean" ? value.ascend : defaultFilters.ascend,
        marketCap: marketCapFilterValues.has(String(value.marketCap)) ? (String(value.marketCap) as ScreenerFilters["marketCap"]) : defaultFilters.marketCap,
        order: orderFilterValues.has(String(value.order)) ? (String(value.order) as ScreenerFilters["order"]) : defaultFilters.order,
        potentialStock: typeof value.potentialStock === "boolean" ? value.potentialStock : defaultFilters.potentialStock,
        sector: sectorFilterValues.has(String(value.sector)) ? (String(value.sector) as ScreenerFilters["sector"]) : defaultFilters.sector,
    };
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

export const ScreenerUtil = Object.freeze({
    getInitialFilters,
    saveFilters,
    getInitialDarkMode,
    saveDarkMode,
});
