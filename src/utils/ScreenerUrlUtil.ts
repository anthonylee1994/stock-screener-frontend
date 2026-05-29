import {filterOptions} from "@/constants/filterOptions";
import type {MarketCapFilter, OrderFilter, ScreenerFilters, SectorFilter} from "@/types/screener";

const sectorFilterValues = new Set<string>(filterOptions.sectorOptions.map(option => option.value));
const marketCapFilterValues = new Set<string>(filterOptions.marketCapOptions.map(option => option.value));
const orderFilterValues = new Set<string>(filterOptions.orderOptions.map(option => option.value));

function getUrlScreenerState(search: string, fallbackFilters: ScreenerFilters, fallbackQuery: string): {filters: ScreenerFilters; query: string} {
    const searchParams = new URLSearchParams(search);

    return {
        filters: {
            ascend: getUrlAscend(searchParams, fallbackFilters.ascend),
            marketCap: getUrlMarketCap(searchParams, fallbackFilters.marketCap),
            order: getUrlOrder(searchParams, fallbackFilters.order),
            potentialStock: getUrlPotentialStock(searchParams, fallbackFilters.potentialStock),
            sector: getUrlSector(searchParams, fallbackFilters.sector),
        },
        query: searchParams.get("search") ?? fallbackQuery,
    };
}

function getScreenerSearch(filters: ScreenerFilters, query: string): string {
    const searchParams = new URLSearchParams();
    const normalizedQuery = query.trim();

    if (normalizedQuery.length > 0) {
        searchParams.set("search", normalizedQuery);
    }

    searchParams.set("sector", filters.sector);
    searchParams.set("market_cap", filters.marketCap);
    searchParams.set("order", filters.order);
    searchParams.set("ascend", String(filters.ascend));
    searchParams.set("potential_stock", String(filters.potentialStock));

    return `?${searchParams.toString()}`;
}

function areFiltersEqual(left: ScreenerFilters, right: ScreenerFilters): boolean {
    return (
        left.ascend === right.ascend &&
        left.marketCap === right.marketCap &&
        left.order === right.order &&
        left.potentialStock === right.potentialStock &&
        left.sector === right.sector
    );
}

function getUrlAscend(searchParams: URLSearchParams, fallbackAscend: boolean): boolean {
    const value = searchParams.get("ascend");

    if (value === "true") {
        return true;
    }

    if (value === "false") {
        return false;
    }

    return fallbackAscend;
}

function getUrlMarketCap(searchParams: URLSearchParams, fallbackMarketCap: MarketCapFilter): MarketCapFilter {
    const value = searchParams.get("market_cap");

    return value && marketCapFilterValues.has(value) ? (value as MarketCapFilter) : fallbackMarketCap;
}

function getUrlOrder(searchParams: URLSearchParams, fallbackOrder: OrderFilter): OrderFilter {
    const value = searchParams.get("order");

    return value && orderFilterValues.has(value) ? (value as OrderFilter) : fallbackOrder;
}

function getUrlPotentialStock(searchParams: URLSearchParams, fallbackPotentialStock: boolean): boolean {
    const value = searchParams.get("potential_stock");

    if (value === "true") {
        return true;
    }

    if (value === "false") {
        return false;
    }

    return fallbackPotentialStock;
}

function getUrlSector(searchParams: URLSearchParams, fallbackSector: SectorFilter): SectorFilter {
    const value = searchParams.get("sector");

    return value && sectorFilterValues.has(value) ? (value as SectorFilter) : fallbackSector;
}

export const ScreenerUrlUtil = Object.freeze({
    getUrlScreenerState,
    getScreenerSearch,
    areFiltersEqual,
});
