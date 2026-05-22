import React from "react";
import type {SortDescriptor} from "@heroui/react";
import classNames from "classnames";
import {MobileMetricValue} from "./MobileMetricValue";
import {MobileSortBar, mobileSortOptions} from "./MobileSortBar";
import {WatchlistButton} from "./WatchlistButton";
import type {StockRow} from "../../types/Screener";
import {formatCurrency, formatPercent} from "../../utils/Format";

interface Props {
    emptyMessage: string;
    error: string | null;
    isLoading: boolean;
    rows: StockRow[];
    sortDescriptor: SortDescriptor;
    watchlistTickers: string[];
    onSelectedRowChange: (row: StockRow | null) => void;
    onSortChange: (sortDescriptor: SortDescriptor) => void;
    onWatchlistToggle(row: StockRow): void;
}

export const MobileStockList = React.memo<Props>(({emptyMessage, error, isLoading, rows, sortDescriptor, watchlistTickers, onSelectedRowChange, onSortChange, onWatchlistToggle}) => {
    const handleRowPress = (row: StockRow) => {
        onSelectedRowChange(row);
    };

    const handleRowKeyDown = (event: React.KeyboardEvent, row: StockRow) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleRowPress(row);
        }
    };

    const metricLabel = getMobileMetricLabel(sortDescriptor);

    return (
        <React.Fragment>
            <MobileSortBar sortDescriptor={sortDescriptor} onSortChange={onSortChange} />
            <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="grid grid-cols-[42px_minmax(0,1fr)_76px_70px] border-b border-neutral-200 bg-neutral-50 px-2.5 py-3 text-xs font-semibold text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400">
                    <span className="text-center">排名</span>
                    <span>股票</span>
                    <span className="text-right">價格</span>
                    <span className="text-right">{metricLabel}</span>
                </div>
                {isLoading ? (
                    <div className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">載入緊...</div>
                ) : error ? (
                    <div className="py-8 text-center text-sm text-red-600 dark:text-red-400">{error}</div>
                ) : rows.length === 0 ? (
                    <div className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">{emptyMessage}</div>
                ) : (
                    rows.map((row, index) => {
                        const isWatched = watchlistTickers.includes(row.ticker.toUpperCase());

                        return (
                            <div
                                key={row.ticker}
                                className="grid w-full grid-cols-[42px_minmax(0,1fr)_76px_70px] items-center gap-0 border-b border-neutral-100 px-2.5 py-3 text-left last:border-b-0 active:bg-neutral-50 dark:border-neutral-800 dark:active:bg-neutral-800/30"
                                role="button"
                                tabIndex={0}
                                onClick={() => handleRowPress(row)}
                                onKeyDown={event => handleRowKeyDown(event, row)}
                            >
                                <div className="flex justify-center">
                                    <span className="inline-flex size-9 items-center justify-center rounded-lg bg-neutral-300/30 text-sm font-semibold text-neutral-700 dark:bg-neutral-400/15 dark:text-neutral-300">
                                        {index + 1}
                                    </span>
                                </div>
                                <div className="flex min-w-0 items-center gap-1.5 px-1.5">
                                    <WatchlistButton isWatched={isWatched} onPress={() => onWatchlistToggle(row)} />
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-neutral-950 dark:text-neutral-100">{row.ticker}</p>
                                        <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{row.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[13px] font-semibold leading-5 text-neutral-950 dark:text-neutral-100">{formatCurrency(row.price)}</p>
                                    <p
                                        className={classNames("text-xs leading-5", {
                                            "text-emerald-600 dark:text-emerald-400": row.changePercent >= 0,
                                            "text-red-500 dark:text-red-400": row.changePercent < 0,
                                        })}
                                    >
                                        {formatPercent(row.changePercent)}
                                    </p>
                                </div>
                                <div className="flex justify-end">
                                    <MobileMetricValue row={row} sortDescriptor={sortDescriptor} />
                                </div>
                            </div>
                        );
                    })
                )}
            </section>
        </React.Fragment>
    );
});

function getMobileMetricLabel(sortDescriptor: SortDescriptor): string {
    const activeColumn = String(sortDescriptor.column);

    return mobileSortOptions.find(option => option.id === activeColumn)?.label ?? "綜合";
}
