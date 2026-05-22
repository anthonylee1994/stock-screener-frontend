import React from "react";
import {useLocation, useNavigate} from "react-router";
import {ScreenHeader} from "../components/layout/ScreenHeader";
import {StockResultsTable} from "../components/stocks/StockResultsTable";
import {marketCapOptions, orderOptions, sectorOptions} from "../constants/FilterOptions";
import {useAuthStore} from "../stores/useAuthStore";
import {useScreenerStore} from "../stores/useScreenerStore";
import type {MarketCapFilter, OrderFilter, ScreenerFilters, SectorFilter} from "../types/Screener";

const sectorFilterValues = new Set<string>(sectorOptions.map(option => option.value));
const marketCapFilterValues = new Set<string>(marketCapOptions.map(option => option.value));
const orderFilterValues = new Set<string>(orderOptions.map(option => option.value));

export const ScreenerPage = React.memo(() => {
    const apiToken = useAuthStore(state => state.apiToken);
    const clearRows = useScreenerStore(state => state.clearRows);
    const filters = useScreenerStore(state => state.filters);
    const loadRows = useScreenerStore(state => state.loadRows);
    const query = useScreenerStore(state => state.query);
    const reloadKey = useScreenerStore(state => state.reloadKey);
    const setFilters = useScreenerStore(state => state.setFilters);
    const setQuery = useScreenerStore(state => state.setQuery);
    const location = useLocation();
    const navigate = useNavigate();
    const syncedSearchRef = React.useRef<string | null>(null);

    React.useEffect(() => {
        const currentFilters = useScreenerStore.getState().filters;
        const currentQuery = useScreenerStore.getState().query;

        if (location.search !== syncedSearchRef.current) {
            const urlState = getUrlScreenerState(location.search, currentFilters, currentQuery);
            const nextSearch = getScreenerSearch(urlState.filters, urlState.query);

            syncedSearchRef.current = nextSearch;

            if (!areFiltersEqual(urlState.filters, currentFilters)) {
                setFilters(urlState.filters);
            }

            if (urlState.query !== currentQuery) {
                setQuery(urlState.query);
            }

            if (nextSearch !== location.search) {
                navigate(
                    {
                        hash: location.hash,
                        pathname: location.pathname,
                        search: nextSearch,
                    },
                    {
                        replace: true,
                        state: location.state,
                    }
                );
            }

            return;
        }

        const nextSearch = getScreenerSearch(currentFilters, currentQuery);

        if (nextSearch !== location.search) {
            syncedSearchRef.current = nextSearch;
            navigate(
                {
                    hash: location.hash,
                    pathname: location.pathname,
                    search: nextSearch,
                },
                {
                    replace: true,
                    state: location.state,
                }
            );
        }
    }, [filters, location, navigate, query, setFilters, setQuery]);

    React.useEffect(() => {
        if (apiToken.length === 0) {
            clearRows();
            return;
        }

        const abortController = new AbortController();

        void loadRows(apiToken, abortController.signal);

        return () => {
            abortController.abort();
        };
    }, [apiToken, filters, query, reloadKey, clearRows, loadRows]);

    return (
        <main className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-100">
            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
                <ScreenHeader />
                <StockResultsTable />
            </div>
        </main>
    );
});

function getUrlScreenerState(search: string, fallbackFilters: ScreenerFilters, fallbackQuery: string): {filters: ScreenerFilters; query: string} {
    const searchParams = new URLSearchParams(search);

    return {
        filters: {
            ascend: getUrlAscend(searchParams, fallbackFilters.ascend),
            marketCap: getUrlMarketCap(searchParams, fallbackFilters.marketCap),
            order: getUrlOrder(searchParams, fallbackFilters.order),
            sector: getUrlSector(searchParams, fallbackFilters.sector),
        },
        query: searchParams.get("search") ?? fallbackQuery,
    };
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

function getUrlSector(searchParams: URLSearchParams, fallbackSector: SectorFilter): SectorFilter {
    const value = searchParams.get("sector");

    return value && sectorFilterValues.has(value) ? (value as SectorFilter) : fallbackSector;
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

    return `?${searchParams.toString()}`;
}

function areFiltersEqual(left: ScreenerFilters, right: ScreenerFilters): boolean {
    return left.ascend === right.ascend && left.marketCap === right.marketCap && left.order === right.order && left.sector === right.sector;
}
