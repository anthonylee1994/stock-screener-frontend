import React from "react";
import type {SortDescriptor} from "@heroui/react";
import {MobileSortBar, mobileSortOptions} from "./MobileSortBar";
import type {DetailKind} from "./ScoreDetailModal";
import {StockDetailModal} from "./StockDetailModal";
import type {StockRow} from "../types/Screener";
import {formatCompactCurrency, formatCurrency, formatPercent, formatScore, formatVolume} from "../utils/Format";
import {getScoreClassName} from "../utils/ScoreStyle";

interface Props {
    error: string | null;
    isLoading: boolean;
    rows: StockRow[];
    selectedRow: StockRow | null;
    sortDescriptor: SortDescriptor;
    onDetailPress: (row: StockRow, kind: DetailKind) => void;
    onSelectedRowChange: (row: StockRow | null) => void;
    onSortChange: (sortDescriptor: SortDescriptor) => void;
}

export const MobileStockList = React.memo<Props>(({error, isLoading, rows, selectedRow, sortDescriptor, onDetailPress, onSelectedRowChange, onSortChange}) => {
    const handleRowPress = (row: StockRow) => {
        onSelectedRowChange(row);
    };

    const handleModalOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            onSelectedRowChange(null);
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
                                <p className={row.changePercent >= 0 ? "text-xs leading-5 text-emerald-600 dark:text-emerald-400" : "text-xs leading-5 text-red-500 dark:text-red-400"}>
                                    {formatPercent(row.changePercent)}
                                </p>
                            </div>
                            <div className="flex justify-end">
                                <MobileMetricValue row={row} sortDescriptor={sortDescriptor} />
                            </div>
                        </button>
                    ))
                )}
                <StockDetailModal row={selectedRow} onDetailPress={onDetailPress} onOpenChange={handleModalOpenChange} />
            </section>
        </React.Fragment>
    );
});

type MobileMetricValueProps = {
    row: StockRow;
    sortDescriptor: SortDescriptor;
};

const MobileMetricValue = React.memo((props: MobileMetricValueProps) => {
    const {row, sortDescriptor} = props;
    const column = String(sortDescriptor.column);

    if (column === "market_cap") {
        return <span className="text-[13px] font-semibold leading-5 text-neutral-800 dark:text-neutral-200">{formatCompactCurrency(row.marketCap)}</span>;
    }

    if (column === "volume") {
        return <span className="text-[13px] font-semibold leading-5 text-neutral-800 dark:text-neutral-200">{formatVolume(row.volume)}</span>;
    }

    if (column === "change_percent") {
        return (
            <span
                className={row.changePercent >= 0 ? "text-[13px] font-semibold leading-5 text-emerald-600 dark:text-emerald-400" : "text-[13px] font-semibold leading-5 text-red-500 dark:text-red-400"}
            >
                {formatPercent(row.changePercent)}
            </span>
        );
    }

    if (column === "fundamental_score") {
        return <span className={getScoreClassName(row.fundamentalScore, "mobilePill")}>{formatScore(row.fundamentalScore)}</span>;
    }

    if (column === "technical_score") {
        return <span className={getScoreClassName(row.technicalScore, "mobilePill")}>{formatScore(row.technicalScore)}</span>;
    }

    return <span className={getScoreClassName(row.totalScore, "mobilePill")}>{formatScore(row.totalScore)}</span>;
});

function getMobileMetricLabel(sortDescriptor: SortDescriptor): string {
    const activeColumn = String(sortDescriptor.column);

    return mobileSortOptions.find(option => option.id === activeColumn)?.label ?? "綜合";
}
