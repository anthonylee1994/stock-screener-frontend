import React from "react";
import type {SortDescriptor} from "@heroui/react";
import {Chip, Popover} from "@heroui/react";
import classNames from "classnames";
import {FinvizChart} from "../stock-detail/FinvizChart";
import {ScoreButton} from "../stock-detail/ScoreButton";
import {LoadMoreStatus} from "./LoadMoreStatus";
import {SortableColumnHeader} from "./SortableColumnHeader";
import {WatchlistButton} from "./WatchlistButton";
import {getSectorDisplayName} from "../../constants/FilterOptions";
import type {StockRow} from "../../types/Screener";
import type {DetailKind} from "../../types/StockDetail";
import {formatCompactCurrency, formatCurrency, formatPercent, formatVolume} from "../../utils/Format";

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
                    <div className="sticky top-0 z-10 grid grid-cols-[72px_minmax(220px,1.8fr)_150px_110px_110px_110px_104px_104px_96px] items-center border-b border-neutral-200 bg-neutral-50 px-3 py-3 text-xs font-semibold text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400">
                        <span className="text-center">排名</span>
                        <span className="pl-12">股票</span>
                        <span>板塊</span>
                        <SortableHeader align="right" column="market_cap" sortDescriptor={sortDescriptor} onSortChange={onSortChange}>
                            市值
                        </SortableHeader>
                        <SortableHeader align="right" column="change_percent" sortDescriptor={sortDescriptor} onSortChange={onSortChange}>
                            升跌幅
                        </SortableHeader>
                        <SortableHeader align="right" column="volume" sortDescriptor={sortDescriptor} onSortChange={onSortChange}>
                            成交量
                        </SortableHeader>
                        <SortableHeader align="center" column="fundamental_score" sortDescriptor={sortDescriptor} onSortChange={onSortChange}>
                            基本面
                        </SortableHeader>
                        <SortableHeader align="center" column="technical_score" sortDescriptor={sortDescriptor} onSortChange={onSortChange}>
                            技術面
                        </SortableHeader>
                        <SortableHeader align="center" column="total_score" sortDescriptor={sortDescriptor} onSortChange={onSortChange}>
                            綜合
                        </SortableHeader>
                    </div>
                    {renderListBody(
                        emptyMessage,
                        rows,
                        isLoading,
                        error,
                        chartTicker,
                        watchlistTickers,
                        hasMore,
                        isLoadingMore,
                        loadMoreError,
                        loadMoreRef,
                        onDetailPress,
                        handleStockDetailPress,
                        handleChartOpenChange,
                        onWatchlistToggle
                    )}
                </div>
            </section>
        );
    }
);

function renderListBody(
    emptyMessage: string,
    rows: StockRow[],
    isLoading: boolean,
    error: string | null,
    chartTicker: string | null,
    watchlistTickers: string[],
    hasMore: boolean,
    isLoadingMore: boolean,
    loadMoreError: string | null,
    loadMoreRef: React.RefObject<HTMLDivElement | null>,
    onDetailPress: (row: StockRow, kind: DetailKind) => void,
    onStockDetailPress: (row: StockRow) => void,
    onChartOpenChange: (ticker: string, isOpen: boolean) => void,
    onWatchlistToggle: (row: StockRow) => void
): React.ReactNode {
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
            {rows.map((row, index) => {
                const isWatched = watchlistTickers.includes(row.ticker.toUpperCase());

                return (
                    <div
                        key={row.ticker}
                        className="grid cursor-pointer grid-cols-[72px_minmax(220px,1.8fr)_150px_110px_110px_110px_104px_104px_96px] items-center border-b border-neutral-100 px-3 py-3 text-sm text-neutral-700 hover:bg-neutral-50 focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-neutral-400 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800/30"
                        role="button"
                        tabIndex={0}
                        onClick={() => onChartOpenChange(row.ticker, chartTicker !== row.ticker)}
                        onKeyDown={event => handleRowKeyDown(event, row, chartTicker, onChartOpenChange)}
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
            })}
            <LoadMoreStatus className="py-5" error={loadMoreError} hasMore={hasMore} isLoadingMore={isLoadingMore} loadMoreRef={loadMoreRef} />
        </React.Fragment>
    );
}

interface SortableHeaderProps {
    align?: "center" | "left" | "right";
    children: React.ReactNode;
    column: string;
    sortDescriptor: SortDescriptor;
    onSortChange(sortDescriptor: SortDescriptor): void;
}

const SortableHeader = React.memo<SortableHeaderProps>(({align = "left", children, column, sortDescriptor, onSortChange}) => {
    const sortDirection = String(sortDescriptor.column) === column ? sortDescriptor.direction : undefined;
    const buttonClassName = classNames("px-2 cursor-pointer", {
        "justify-self-start": align === "left",
        "justify-self-center": align === "center",
        "justify-self-end": align === "right",
    });

    return (
        <button className={buttonClassName} type="button" onClick={() => onSortChange({column, direction: sortDirection === "ascending" ? "descending" : "ascending"})}>
            <SortableColumnHeader sortDirection={sortDirection}>{children}</SortableColumnHeader>
        </button>
    );
});

function handleRowKeyDown(event: React.KeyboardEvent, row: StockRow, chartTicker: string | null, onChartOpenChange: (ticker: string, isOpen: boolean) => void): void {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onChartOpenChange(row.ticker, chartTicker !== row.ticker);
    }
}

function stopPropagation(event: React.MouseEvent): void {
    event.stopPropagation();
}
