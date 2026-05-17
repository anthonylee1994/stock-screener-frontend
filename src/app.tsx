import React from "react";
import {AuthPage} from "./components/AuthPage";
import {FilterPanel} from "./components/FilterPanel";
import {ScreenHeader} from "./components/ScreenHeader";
import {StockResultsTable} from "./components/StockResultsTable";
import {authenticate, fetchScreenerRows} from "./services/ScreenerApi";
import type {SortDescriptor} from "@heroui/react";
import type {ScreenerFilters, StockRow} from "./types/Screener";

const authTokenStorageKey = "stock-screener-api-token";

const defaultFilters: ScreenerFilters = {
    sector: "All",
    marketCap: "+mid",
    order: "total_score",
    ascend: false,
};

export const App = React.memo(() => {
    const [apiToken, setApiToken] = React.useState(() => window.localStorage.getItem(authTokenStorageKey) ?? "");
    const [tokenInput, setTokenInput] = React.useState("");
    const [filters, setFilters] = React.useState<ScreenerFilters>(defaultFilters);
    const [query, setQuery] = React.useState("");
    const [rows, setRows] = React.useState<StockRow[]>([]);
    const [isAuthenticating, setIsAuthenticating] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(apiToken.length > 0);
    const [authError, setAuthError] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (apiToken.length === 0) {
            setIsLoading(false);
            setRows([]);
            return;
        }

        const abortController = new AbortController();

        async function loadRows() {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetchScreenerRows(filters, query, apiToken, abortController.signal);

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
    }, [apiToken, filters, query]);

    const handleAuthSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextApiToken = tokenInput.trim();

        if (nextApiToken.length === 0) {
            setAuthError("請輸入密碼");
            return;
        }

        const abortController = new AbortController();

        async function authorize() {
            setIsAuthenticating(true);
            setAuthError(null);

            try {
                const authorized = await authenticate(nextApiToken, abortController.signal);

                if (!authorized) {
                    setAuthError("密碼唔正確");
                    return;
                }

                window.localStorage.setItem(authTokenStorageKey, nextApiToken);
                setApiToken(nextApiToken);
                setTokenInput("");
            } catch (authFetchError) {
                if (abortController.signal.aborted) {
                    return;
                }

                setAuthError(authFetchError instanceof Error ? authFetchError.message : "驗證失敗");
            } finally {
                if (!abortController.signal.aborted) {
                    setIsAuthenticating(false);
                }
            }
        }

        void authorize();
    };

    const handleFiltersChange = (nextFilters: ScreenerFilters) => {
        setFilters(nextFilters);
    };

    const handleQueryChange = (nextQuery: string) => {
        setQuery(nextQuery);
    };

    const handleRetry = () => {
        setFilters({...filters});
    };

    const handleTokenInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTokenInput(event.target.value);
    };

    const handleLogout = () => {
        window.localStorage.removeItem(authTokenStorageKey);
        setApiToken("");
        setRows([]);
        setError(null);
        setAuthError(null);
        setTokenInput("");
    };

    const handleSortChange = (sortDescriptor: SortDescriptor) => {
        const isChangingColumn = String(sortDescriptor.column) !== filters.order;
        const direction = isChangingColumn ? "descending" : sortDescriptor.direction;

        setFilters({
            ...filters,
            ascend: direction === "ascending",
            order: String(sortDescriptor.column) as ScreenerFilters["order"],
        });
    };

    const sortDescriptor: SortDescriptor = {
        column: filters.order,
        direction: filters.ascend ? "ascending" : "descending",
    };

    if (apiToken.length === 0) {
        return <AuthPage error={authError} isAuthenticating={isAuthenticating} tokenInput={tokenInput} onSubmit={handleAuthSubmit} onTokenInputChange={handleTokenInputChange} />;
    }

    return (
        <React.Fragment>
            <main className="min-h-screen bg-slate-50 text-slate-950">
                <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
                    <ScreenHeader count={rows.length} onLogout={handleLogout} />
                    <FilterPanel filters={filters} isLoading={isLoading} query={query} onFiltersChange={handleFiltersChange} onQueryChange={handleQueryChange} onRetry={handleRetry} />
                    <StockResultsTable error={error} isLoading={isLoading} rows={rows} sortDescriptor={sortDescriptor} onSortChange={handleSortChange} />
                </div>
            </main>
        </React.Fragment>
    );
});
