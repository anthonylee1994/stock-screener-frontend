import React from "react";
import {FilterPanel} from "../components/FilterPanel";
import {ScreenHeader} from "../components/ScreenHeader";
import {StockResultsTable} from "../components/StockResultsTable";
import {useAuthStore} from "../stores/useAuthStore";
import {useScreenerStore} from "../stores/useScreenerStore";

export const ScreenerPage = React.memo(() => {
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

    return (
        <main className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-100">
            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
                <ScreenHeader />
                <FilterPanel />
                <StockResultsTable />
            </div>
        </main>
    );
});
