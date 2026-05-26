import React from "react";
import {DesktopStockTableRow} from "./DesktopStockTableRow";
import {LoadMoreStatus} from "../shared/LoadMoreStatus";
import {StockRow} from "../../../types/Screener";
import {DetailKind} from "../../../types/StockDetail";

interface Props {
    chartTicker: string | null;
    emptyMessage: string;
    error: string | null;
    hasMore: boolean;
    isLoading: boolean;
    isLoadingMore: boolean;
    loadMoreError: string | null;
    loadMoreRef: React.RefObject<HTMLDivElement | null>;
    rows: StockRow[];
    watchlistTickers: string[];
    onChartOpenChange(ticker: string, isOpen: boolean): void;
    onDetailPress(row: StockRow, kind: DetailKind): void;
    onStockDetailPress(row: StockRow): void;
    onWatchlistToggle(row: StockRow): void;
}

export const DesktopStockTableBody = React.memo<Props>(
    ({
        chartTicker,
        emptyMessage,
        error,
        hasMore,
        isLoading,
        isLoadingMore,
        loadMoreError,
        loadMoreRef,
        rows,
        watchlistTickers,
        onChartOpenChange,
        onDetailPress,
        onStockDetailPress,
        onWatchlistToggle,
    }) => {
        if (isLoading) {
            return <div className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">載入緊...</div>;
        }

        if (error) {
            return <div className="py-8 text-center text-sm text-red-600 dark:text-red-400">{error}</div>;
        }

        if (rows.length === 0) {
            return <div className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">{emptyMessage}</div>;
        }

        return (
            <React.Fragment>
                {rows.map((row, index) => (
                    <DesktopStockTableRow
                        key={row.ticker}
                        chartTicker={chartTicker}
                        index={index}
                        isWatched={watchlistTickers.includes(row.ticker.toUpperCase())}
                        row={row}
                        onChartOpenChange={onChartOpenChange}
                        onDetailPress={onDetailPress}
                        onStockDetailPress={onStockDetailPress}
                        onWatchlistToggle={onWatchlistToggle}
                    />
                ))}
                <LoadMoreStatus className="py-5" error={loadMoreError} hasMore={hasMore} isLoadingMore={isLoadingMore} loadMoreRef={loadMoreRef} />
            </React.Fragment>
        );
    }
);
