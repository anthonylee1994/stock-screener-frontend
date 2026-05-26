import React from "react";
import {DesktopStockTableBody} from "./DesktopStockTableBody";
import {DesktopStockTableHeader} from "./DesktopStockTableHeader";
import type {StockRow} from "../../../types/Screener";
import {DetailKind} from "../../../types/StockDetail";
import {SortDescriptor} from "@heroui/react";

interface Props {
    emptyMessage: string;
    error: string | null;
    hasMore: boolean;
    isLoading: boolean;
    isLoadingMore: boolean;
    loadMoreError: string | null;
    rows: StockRow[];
    sortDescriptor: SortDescriptor;
    watchlistTickers: string[];
    onDetailPress(row: StockRow, kind: DetailKind): void;
    onLoadMore(): void;
    onSortChange(sortDescriptor: SortDescriptor): void;
    onStockDetailPress(row: StockRow): void;
    onWatchlistToggle(row: StockRow): void;
}

export const DesktopStockTable = React.memo<Props>(
    ({
        emptyMessage,
        error,
        hasMore,
        isLoading,
        isLoadingMore,
        loadMoreError,
        rows,
        sortDescriptor,
        watchlistTickers,
        onDetailPress,
        onLoadMore,
        onSortChange,
        onStockDetailPress,
        onWatchlistToggle,
    }) => {
        const [chartTicker, setChartTicker] = React.useState<string | null>(null);
        const loadMoreRef = React.useRef<HTMLDivElement | null>(null);

        React.useEffect(() => {
            const element = loadMoreRef.current;

            if (!element || !hasMore || isLoading || isLoadingMore || error || loadMoreError) {
                return;
            }

            const observer = new IntersectionObserver(entries => {
                const entry = entries[0];

                if (entry?.isIntersecting) {
                    onLoadMore();
                }
            });

            observer.observe(element);

            return () => {
                observer.disconnect();
            };
        }, [error, hasMore, isLoading, isLoadingMore, loadMoreError, onLoadMore]);

        const handleChartOpenChange = (ticker: string, isOpen: boolean) => {
            setChartTicker(isOpen ? ticker : null);
        };

        const handleStockDetailPress = (row: StockRow) => {
            setChartTicker(null);
            onStockDetailPress(row);
        };

        return (
            <section
                className="hidden overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:block"
                aria-label="Stock screener results"
            >
                <div className="min-w-[1120px]">
                    <DesktopStockTableHeader sortDescriptor={sortDescriptor} onSortChange={onSortChange} />
                    <DesktopStockTableBody
                        chartTicker={chartTicker}
                        emptyMessage={emptyMessage}
                        error={error}
                        hasMore={hasMore}
                        isLoading={isLoading}
                        isLoadingMore={isLoadingMore}
                        loadMoreError={loadMoreError}
                        loadMoreRef={loadMoreRef}
                        rows={rows}
                        watchlistTickers={watchlistTickers}
                        onChartOpenChange={handleChartOpenChange}
                        onDetailPress={onDetailPress}
                        onStockDetailPress={handleStockDetailPress}
                        onWatchlistToggle={onWatchlistToggle}
                    />
                </div>
            </section>
        );
    }
);
