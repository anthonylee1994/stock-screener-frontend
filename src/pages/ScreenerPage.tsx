import React from "react";
import {ScrollToTopButton} from "@/components/layout/ScrollToTopButton";
import {ScreenHeader} from "@/components/layout/ScreenHeader";
import {StockResultsTable} from "@/components/stocks/StockResultsTable";
import {useScreenerRowsLoader} from "@/hooks/useScreenerRowsLoader";
import {useScreenerUrlSync} from "@/hooks/useScreenerUrlSync";

export const ScreenerPage = React.memo(() => {
    useScreenerUrlSync();
    useScreenerRowsLoader();

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
