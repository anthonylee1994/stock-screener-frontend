import React from "react";
import {Chip, Popover} from "@heroui/react";
import classNames from "classnames";
import {FinvizChart} from "../stock-detail/FinvizChart";
import {ScoreButton} from "../stock-detail/ScoreButton";
import {WatchlistButton} from "./WatchlistButton";
import {getSectorDisplayName} from "../../constants/FilterOptions";
import type {StockRow} from "../../types/Screener";
import type {DetailKind} from "../../types/StockDetail";
import {formatCompactCurrency, formatCurrency, formatPercent, formatVolume} from "../../utils/Format";

interface Props {
    chartTicker: string | null;
    index: number;
    isWatched: boolean;
    row: StockRow;
    onChartOpenChange(ticker: string, isOpen: boolean): void;
    onDetailPress(row: StockRow, kind: DetailKind): void;
    onStockDetailPress(row: StockRow): void;
    onWatchlistToggle(row: StockRow): void;
}

export const DesktopStockTableRow = React.memo<Props>(({chartTicker, index, isWatched, row, onChartOpenChange, onDetailPress, onStockDetailPress, onWatchlistToggle}) => {
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onChartOpenChange(row.ticker, chartTicker !== row.ticker);
        }
    };

    const handleClick = () => {
        onChartOpenChange(row.ticker, chartTicker !== row.ticker);
    };

    return (
        <div
            className="grid cursor-pointer grid-cols-[72px_minmax(220px,1.8fr)_150px_110px_110px_110px_104px_104px_96px] items-center border-b border-neutral-100 px-3 py-3 text-sm text-neutral-700 hover:bg-neutral-50 focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-neutral-400 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800/30"
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        >
            <div className="flex justify-center">
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-neutral-300/30 text-sm font-semibold text-neutral-700 dark:bg-neutral-400/15 dark:text-neutral-300">
                    {index + 1}
                </span>
            </div>
            <div className="px-2" onClick={stopPropagation}>
                <div className="flex min-w-0 items-center gap-2">
                    <WatchlistButton isWatched={isWatched} tooltipPlacement="top" onPress={() => onWatchlistToggle(row)} />
                    <Popover isOpen={chartTicker === row.ticker} onOpenChange={isOpen => onChartOpenChange(row.ticker, isOpen)}>
                        <Popover.Trigger>
                            <button className="block min-w-0 text-left" type="button">
                                <p className="text-base font-semibold text-neutral-950 dark:text-neutral-100">{row.ticker}</p>
                                <p className="max-w-[140px] truncate text-sm text-neutral-500 md:max-w-[200px] dark:text-neutral-400" title={row.name}>
                                    {row.name}
                                </p>
                            </button>
                        </Popover.Trigger>
                        <Popover.Content
                            className="w-[620px] max-w-[calc(100vw-2rem)] border border-neutral-200 bg-white text-neutral-950 shadow-xl dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                            placement="right"
                        >
                            <Popover.Dialog className="p-3">
                                <FinvizChart className="min-h-[278px]" ticker={row.ticker} />
                            </Popover.Dialog>
                        </Popover.Content>
                    </Popover>
                </div>
            </div>
            <div>
                <Chip variant="secondary">{getSectorDisplayName(row.sector)}</Chip>
            </div>
            <div className="text-right px-2">
                <span className="text-sm">{formatCompactCurrency(row.marketCap)}</span>
            </div>
            <div className="px-2">
                <div className="text-right">
                    <p className="text-base font-semibold text-neutral-950 dark:text-neutral-100">{formatCurrency(row.price)}</p>
                    <p
                        className={classNames("text-sm", {
                            "text-emerald-600 dark:text-emerald-400": row.changePercent >= 0,
                            "text-red-500 dark:text-red-400": row.changePercent < 0,
                        })}
                    >
                        {formatPercent(row.changePercent)}
                    </p>
                </div>
            </div>
            <div className="px-2 text-right">{formatVolume(row.volume)}</div>
            <div className="flex justify-center" onClick={stopPropagation}>
                <ScoreButton score={row.fundamentalScore} onPress={() => onDetailPress(row, "fundamental")} />
            </div>
            <div className="flex justify-center" onClick={stopPropagation}>
                <ScoreButton score={row.technicalScore} onPress={() => onDetailPress(row, "technical")} />
            </div>
            <div className="flex justify-center" onClick={stopPropagation}>
                <ScoreButton score={row.totalScore} onPress={() => onStockDetailPress(row)} />
            </div>
        </div>
    );
});

function stopPropagation(event: React.MouseEvent): void {
    event.stopPropagation();
}
