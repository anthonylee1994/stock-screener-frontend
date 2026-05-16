import React from "react";
import {FilterPanel} from "./components/FilterPanel";
import {ScreenHeader} from "./components/ScreenHeader";
import {StockResultsTable} from "./components/StockResultsTable";
import {fetchScreenerRows} from "./services/ScreenerApi";
import type {SortDescriptor} from "@heroui/react";
import type {ScreenerFilters, StockRow} from "./types/Screener";

const defaultFilters: ScreenerFilters = {
    sector: "All",
    marketCap: "+mid",
    order: "total_score",
    ascend: false,
};

export const App = React.memo(() => {
    const [filters, setFilters] = React.useState<ScreenerFilters>(defaultFilters);
    const [query, setQuery] = React.useState("");
    const [rows, setRows] = React.useState<StockRow[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const abortController = new AbortController();

        async function loadRows() {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetchScreenerRows(filters, abortController.signal);

                setRows(response.data);
            } catch (fetchError) {
                if (abortController.signal.aborted) {
                    return;
                }

                setError(fetchError instanceof Error ? fetchError.message : "載入選股資料失敗");
            } finally {
                if (!abortController.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        void loadRows();

        return () => {
            abortController.abort();
        };
    }, [filters]);

    const filteredRows = React.useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        if (normalizedQuery.length === 0) {
            return rows;
        }

        return rows.filter(row => {
            return row.ticker.toLowerCase().includes(normalizedQuery) || row.name.toLowerCase().includes(normalizedQuery);
        });
    }, [query, rows]);

    const handleFiltersChange = (nextFilters: ScreenerFilters) => {
        setFilters(nextFilters);
    };

    const handleQueryChange = (nextQuery: string) => {
        setQuery(nextQuery);
    };

    const handleRetry = () => {
        setFilters({...filters});
    };

    const handleSortChange = (sortDescriptor: SortDescriptor) => {
        setFilters({
            ...filters,
            ascend: sortDescriptor.direction === "ascending",
            order: String(sortDescriptor.column) as ScreenerFilters["order"],
        });
    };

    const sortDescriptor: SortDescriptor = {
        column: filters.order,
        direction: filters.ascend ? "ascending" : "descending",
    };

    return (
        <React.Fragment>
            <main className="min-h-screen bg-slate-50 text-slate-950">
                <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
                    <ScreenHeader count={filteredRows.length} />
                    <FilterPanel filters={filters} isLoading={isLoading} query={query} onFiltersChange={handleFiltersChange} onQueryChange={handleQueryChange} onRetry={handleRetry} />
                    <StockResultsTable error={error} isLoading={isLoading} rows={filteredRows} sortDescriptor={sortDescriptor} onSortChange={handleSortChange} />
                </div>
            </main>
        </React.Fragment>
    );
});
