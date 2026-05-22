import React from "react";
import type {SortDescriptor} from "@heroui/react";
import {DesktopStockTable} from "./DesktopStockTable";
import {MobileStockList} from "./MobileStockList";
import type {StockRow} from "../../types/Screener";
import type {DetailKind} from "../../types/StockDetail";

interface Props {
    emptyMessage: string;
    error: string | null;
    isLoading: boolean;
    rows: StockRow[];
    sortDescriptor: SortDescriptor;
    watchlistTickers: string[];
    onDetailPress(row: StockRow, kind: DetailKind): void;
    onMobileSelectedRowChange(row: StockRow | null): void;
    onSortChange(sortDescriptor: SortDescriptor): void;
    onStockDetailPress(row: StockRow): void;
    onWatchlistToggle(row: StockRow): void;
}

export const StockResultsView = React.memo<Props>(
    ({
        emptyMessage,
        error,
        isLoading,
        rows,
        sortDescriptor,
        watchlistTickers,
        onDetailPress,
        onMobileSelectedRowChange,
        onSortChange,
        onStockDetailPress,
        onWatchlistToggle,
    }) => {
        return (
            <React.Fragment>
                <div className="md:hidden">
                    <MobileStockList
                        emptyMessage={emptyMessage}
                        error={error}
                        isLoading={isLoading}
                        rows={rows}
                        sortDescriptor={sortDescriptor}
                        watchlistTickers={watchlistTickers}
                        onSelectedRowChange={onMobileSelectedRowChange}
                        onSortChange={onSortChange}
                        onWatchlistToggle={onWatchlistToggle}
                    />
                </div>
                <DesktopStockTable
                    emptyMessage={emptyMessage}
                    error={error}
                    isLoading={isLoading}
                    rows={rows}
                    sortDescriptor={sortDescriptor}
                    watchlistTickers={watchlistTickers}
                    onDetailPress={onDetailPress}
                    onSortChange={onSortChange}
                    onStockDetailPress={onStockDetailPress}
                    onWatchlistToggle={onWatchlistToggle}
                />
            </React.Fragment>
        );
    }
);
