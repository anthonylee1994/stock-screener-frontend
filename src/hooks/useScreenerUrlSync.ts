import React from "react";
import {useLocation, useNavigate} from "react-router";
import {useScreenerStore} from "@/stores/useScreenerStore";
import {areFiltersEqual, getScreenerSearch, getUrlScreenerState} from "@/utils/ScreenerUrlState";

export function useScreenerUrlSync(): void {
    const filters = useScreenerStore(state => state.filters);
    const query = useScreenerStore(state => state.query);
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
}
