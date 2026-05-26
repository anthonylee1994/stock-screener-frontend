import React from "react";
import type {SortDescriptor} from "@heroui/react";
import {useScreenerStore} from "@/stores/useScreenerStore";

export function useAllStockResults(apiToken: string) {
    const error = useScreenerStore(state => state.error);
    const filters = useScreenerStore(state => state.filters);
    const hasMore = useScreenerStore(state => state.hasMore);
    const isLoading = useScreenerStore(state => state.isLoading);
    const isLoadingMore = useScreenerStore(state => state.isLoadingMore);
    const loadMoreError = useScreenerStore(state => state.loadMoreError);
    const loadMoreRows = useScreenerStore(state => state.loadMoreRows);
    const rows = useScreenerStore(state => state.rows);
    const sortRows = useScreenerStore(state => state.sortRows);

    const sortDescriptor = React.useMemo<SortDescriptor>(() => {
        return {
            column: filters.order,
            direction: filters.ascend ? "ascending" : "descending",
        };
    }, [filters.ascend, filters.order]);

    function handleLoadMore(): void {
        void loadMoreRows(apiToken);
    }

    return {
        error,
        filters,
        hasMore,
        isLoading,
        isLoadingMore,
        loadMoreError,
        rows,
        sortDescriptor,
        handleLoadMore,
        sortRows,
    };
}
