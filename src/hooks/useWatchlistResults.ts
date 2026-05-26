import React from "react";
import {useDebounce} from "@/hooks/useDebounce";
import {useWatchlistStore} from "@/stores/useWatchlistStore";
import type {ScreenerFilters, StockRow} from "@/types/screener";
import {WatchlistRowsUtil as watchlistRowsUtil} from "@/utils/WatchlistRowsUtil";

interface UseWatchlistResultsOptions {
    apiToken: string;
    filters: ScreenerFilters;
    isActive: boolean;
}

export function useWatchlistResults(options: UseWatchlistResultsOptions) {
    const watchlistError = useWatchlistStore(state => state.error);
    const isWatchlistLoading = useWatchlistStore(state => state.isLoading);
    const loadWatchlistRows = useWatchlistStore(state => state.loadRows);
    const watchlistReloadKey = useWatchlistStore(state => state.reloadKey);
    const watchlistRows = useWatchlistStore(state => state.rows);
    const watchlistTickers = useWatchlistStore(state => state.tickers);
    const toggleWatchlistTicker = useWatchlistStore(state => state.toggleTicker);
    const [watchlistSearchText, setWatchlistSearchText] = React.useState("");
    const debouncedWatchlistSearchText = useDebounce(watchlistSearchText, 250);

    const filteredWatchlistRows = React.useMemo(() => {
        return getFilteredWatchlistRows(watchlistRows, debouncedWatchlistSearchText);
    }, [debouncedWatchlistSearchText, watchlistRows]);

    const watchlistEmptyMessage = watchlistRowsUtil.getWatchlistEmptyMessage(watchlistTickers.length, debouncedWatchlistSearchText);

    React.useEffect(() => {
        if (!options.isActive || watchlistTickers.length === 0) {
            return;
        }

        const abortController = new AbortController();

        void loadWatchlistRows(options.filters, options.apiToken, abortController.signal);

        return () => {
            abortController.abort();
        };
    }, [loadWatchlistRows, options.apiToken, options.filters, options.isActive, watchlistReloadKey, watchlistTickers]);

    function handleWatchlistToggle(row: StockRow): void {
        toggleWatchlistTicker(row.ticker);
    }

    return {
        filteredWatchlistRows,
        isWatchlistLoading,
        watchlistEmptyMessage,
        watchlistError,
        watchlistSearchText,
        watchlistTickers,
        handleWatchlistToggle,
        setWatchlistSearchText,
    };
}

function getFilteredWatchlistRows(rows: StockRow[], searchText: string): StockRow[] {
    const normalizedSearchText = searchText.trim().toLowerCase();

    if (normalizedSearchText.length === 0) {
        return rows;
    }

    return watchlistRowsUtil.getWatchlistSearchRows(rows, normalizedSearchText);
}
