import React from "react";
import {Chip, Popover} from "@heroui/react";
import classNames from "classnames";
import {FinvizChart} from "@/components/stock-detail/FinvizChart";
import {ScoreButton} from "@/components/stock-detail/ScoreButton";
import {WatchlistButton} from "@/components/stocks/shared/WatchlistButton";
import {filterOptions} from "@/constants/filterOptions";
import type {StockRow} from "@/types/screener";
import type {DetailKind} from "@/types/stockDetail";
import {FormatUtil} from "@/utils/FormatUtil";

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
    const shouldIgnoreNextPopoverChangeRef = React.useRef(false);
    const targetPriceComparison = getTargetPriceComparison(row.price, row.fundamental.targetPrice);

    const markRowClickExcluded = () => {
        shouldIgnoreNextPopoverChangeRef.current = true;
        window.setTimeout(() => {
            shouldIgnoreNextPopoverChangeRef.current = false;
        }, 250);
    };

    const handlePopoverOpenChange = (isOpen: boolean) => {
        if (shouldIgnoreNextPopoverChangeRef.current) {
            shouldIgnoreNextPopoverChangeRef.current = false;
            return;
        }

        onChartOpenChange(row.ticker, isOpen);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onChartOpenChange(row.ticker, chartTicker !== row.ticker);
        }
    };

    const handleClick = (event: React.MouseEvent) => {
        if (event.target instanceof Element && event.target.closest("[data-row-click-excluded]")) {
            return;
        }

        onChartOpenChange(row.ticker, chartTicker !== row.ticker);
    };

    const rowClickExcludedProps = {
        "data-row-click-excluded": true,
        onClick: stopPropagation,
        onClickCapture: markRowClickExcluded,
        onKeyDown: stopPropagation,
        onKeyDownCapture: markRowClickExcluded,
        onKeyUpCapture: markRowClickExcluded,
        onPointerDownCapture: markRowClickExcluded,
        onPointerUpCapture: markRowClickExcluded,
    };

    return (
        <Popover isOpen={chartTicker === row.ticker} onOpenChange={handlePopoverOpenChange}>
            <Popover.Trigger className="block min-w-0 text-left">
                <div
                    className="grid cursor-pointer grid-cols-[72px_minmax(220px,1.8fr)_150px_110px_110px_110px_110px_104px_104px_96px] items-center border-b border-neutral-100 px-3 py-3 text-sm text-neutral-700 hover:bg-neutral-50 focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-neutral-400 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800/30"
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
                    <div className="px-2">
                        <div className="flex min-w-0 items-center gap-2">
                            <div {...rowClickExcludedProps}>
                                <WatchlistButton isWatched={isWatched} tooltipPlacement="top" onPress={() => onWatchlistToggle(row)} />
                            </div>
                            <div>
                                <p className="text-base font-semibold text-neutral-950 dark:text-neutral-100">{row.ticker}</p>
                                <p className="max-w-[140px] truncate text-sm text-neutral-500 md:max-w-[200px] dark:text-neutral-400" title={row.name}>
                                    {row.name}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Chip variant="secondary">{filterOptions.getSectorDisplayName(row.sector)}</Chip>
                    </div>
                    <div className="text-right px-2">
                        <span className="text-sm">{FormatUtil.formatCompactCurrency(row.marketCap)}</span>
                    </div>
                    <div className="px-2">
                        <div className="text-right">
                            <p className="text-base font-semibold text-neutral-950 dark:text-neutral-100">{FormatUtil.formatCurrency(row.price)}</p>
                            <p
                                className={classNames("text-sm", {
                                    "text-emerald-600 dark:text-emerald-400": row.changePercent >= 0,
                                    "text-red-500 dark:text-red-400": row.changePercent < 0,
                                })}
                            >
                                {FormatUtil.formatPercent(row.changePercent)}
                            </p>
                        </div>
                    </div>
                    <div className="px-2 text-right">
                        <p className="text-base font-semibold text-neutral-950 dark:text-neutral-100">{targetPriceComparison.targetPrice}</p>
                        <p className={classNames("text-sm", targetPriceComparison.upsideClassName)}>{targetPriceComparison.upside}</p>
                    </div>
                    <div className="px-2 text-right">{FormatUtil.formatVolume(row.volume)}</div>
                    <div className="flex justify-center" {...rowClickExcludedProps}>
                        <ScoreButton score={row.fundamentalScore} onPress={() => onDetailPress(row, "fundamental")} />
                    </div>
                    <div className="flex justify-center" {...rowClickExcludedProps}>
                        <ScoreButton score={row.technicalScore} onPress={() => onDetailPress(row, "technical")} />
                    </div>
                    <div className="flex justify-center" {...rowClickExcludedProps}>
                        <ScoreButton score={row.totalScore} onPress={() => onStockDetailPress(row)} />
                    </div>
                </div>
            </Popover.Trigger>
            <Popover.Content>
                <Popover.Dialog>
                    <FinvizChart className="min-h-[278px]" ticker={row.ticker} />
                </Popover.Dialog>
            </Popover.Content>
        </Popover>
    );
});

function stopPropagation(event: React.SyntheticEvent): void {
    event.stopPropagation();
}

interface TargetPriceComparison {
    targetPrice: string;
    upside: string;
    upsideClassName: string;
}

function getTargetPriceComparison(currentPrice: number, targetPrice: number | null): TargetPriceComparison {
    if (targetPrice === null) {
        return {
            targetPrice: "N/A",
            upside: "N/A",
            upsideClassName: "text-neutral-500 dark:text-neutral-400",
        };
    }

    const upside = targetPrice / currentPrice - 1;

    return {
        targetPrice: FormatUtil.formatCurrency(targetPrice),
        upside: FormatUtil.formatPercent(upside),
        upsideClassName: getUpsideClassName(upside),
    };
}

function getUpsideClassName(value: number): string {
    if (value > 0) {
        return "text-emerald-600 dark:text-emerald-400";
    }

    if (value < 0) {
        return "text-red-500 dark:text-red-400";
    }

    return "text-neutral-500 dark:text-neutral-400";
}
