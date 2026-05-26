import React from "react";
import {useLocation, useNavigate} from "react-router";
import {ScrollToTopButton} from "../components/layout/ScrollToTopButton";
import {ScreenHeader} from "../components/layout/ScreenHeader";
import {StockResultsTable} from "../components/stocks/StockResultsTable";
import {useAuthStore} from "../stores/useAuthStore";
import {useScreenerStore} from "../stores/useScreenerStore";
import {areFiltersEqual, getScreenerSearch, getUrlScreenerState} from "../utils/ScreenerUrlState";

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
            <ScrollToTopButton />
        </main>
    );
});
