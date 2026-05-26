import React from "react";
import type {SortDescriptor} from "@heroui/react";
import {DesktopStockTable} from "./desktop/DesktopStockTable";
import {MobileStockList} from "./mobile/MobileStockList";
import type {StockRow} from "../../types/Screener";
import type {DetailKind} from "../../types/StockDetail";

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
    onMobileSelectedRowChange(row: StockRow | null): void;
    onSortChange(sortDescriptor: SortDescriptor): void;
    onStockDetailPress(row: StockRow): void;
    onWatchlistToggle(row: StockRow): void;
}

export const StockResultsView = React.memo<Props>(
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
        onMobileSelectedRowChange,
        onSortChange,
        onStockDetailPress,
        onWatchlistToggle,
    }) => {
        return (
            <React.Fragment>
                <div className="lg:hidden">
                    <MobileStockList
                        emptyMessage={emptyMessage}
                        error={error}
                        hasMore={hasMore}
                        isLoading={isLoading}
                        isLoadingMore={isLoadingMore}
                        loadMoreError={loadMoreError}
                        rows={rows}
                        sortDescriptor={sortDescriptor}
                        watchlistTickers={watchlistTickers}
                        onLoadMore={onLoadMore}
                        onSelectedRowChange={onMobileSelectedRowChange}
                        onSortChange={onSortChange}
                        onWatchlistToggle={onWatchlistToggle}
                    />
                </div>
                <DesktopStockTable
                    emptyMessage={emptyMessage}
                    error={error}
                    hasMore={hasMore}
                    isLoading={isLoading}
                    isLoadingMore={isLoadingMore}
                    loadMoreError={loadMoreError}
                    rows={rows}
                    sortDescriptor={sortDescriptor}
                    watchlistTickers={watchlistTickers}
                    onDetailPress={onDetailPress}
                    onLoadMore={onLoadMore}
                    onSortChange={onSortChange}
                    onStockDetailPress={onStockDetailPress}
                    onWatchlistToggle={onWatchlistToggle}
                />
            </React.Fragment>
        );
    }
);
