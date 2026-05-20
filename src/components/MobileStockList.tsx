import React from "react";
import type {SortDescriptor} from "@heroui/react";
import classNames from "classnames";
import {MobileMetricValue} from "./MobileMetricValue";
import {MobileSortBar, mobileSortOptions} from "./MobileSortBar";
import type {StockRow} from "../types/Screener";
import {formatCurrency, formatPercent} from "../utils/Format";

interface Props {
    error: string | null;
    isLoading: boolean;
    rows: StockRow[];
    sortDescriptor: SortDescriptor;
    onSelectedRowChange: (row: StockRow | null) => void;
    onSortChange: (sortDescriptor: SortDescriptor) => void;
}

export const MobileStockList = React.memo<Props>(({error, isLoading, rows, sortDescriptor, onSelectedRowChange, onSortChange}) => {
    const handleRowPress = (row: StockRow) => {
        onSelectedRowChange(row);
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
                    <div className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">搵唔到符合條件嘅股票</div>
                ) : (
                    rows.map((row, index) => (
                        <button
                            key={row.ticker}
                            className="grid w-full grid-cols-[42px_minmax(0,1fr)_76px_70px] items-center gap-0 border-b border-neutral-100 px-2.5 py-3 text-left last:border-b-0 active:bg-neutral-50 dark:border-neutral-800 dark:active:bg-neutral-800/30"
                            type="button"
                            onClick={() => handleRowPress(row)}
                        >
                            <div className="flex justify-center">
                                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-neutral-300/30 text-sm font-semibold text-neutral-700 dark:bg-neutral-400/15 dark:text-neutral-300">
                                    {index + 1}
                                </span>
                            </div>
                            <div className="min-w-0 px-1.5">
                                <p className="truncate text-sm font-semibold text-neutral-950 dark:text-neutral-100">{row.ticker}</p>
                                <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{row.name}</p>
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
                        </button>
                    ))
                )}
            </section>
        </React.Fragment>
    );
});

function getMobileMetricLabel(sortDescriptor: SortDescriptor): string {
    const activeColumn = String(sortDescriptor.column);

    return mobileSortOptions.find(option => option.id === activeColumn)?.label ?? "綜合";
}
