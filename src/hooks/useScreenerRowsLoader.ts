import React from "react";
import {useAuthStore} from "@/stores/useAuthStore";
import {useScreenerStore} from "@/stores/useScreenerStore";

export function useScreenerRowsLoader(): void {
    const apiToken = useAuthStore(state => state.apiToken);
    const clearRows = useScreenerStore(state => state.clearRows);
    const filters = useScreenerStore(state => state.filters);
    const loadRows = useScreenerStore(state => state.loadRows);
    const query = useScreenerStore(state => state.query);
    const reloadKey = useScreenerStore(state => state.reloadKey);

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
}
