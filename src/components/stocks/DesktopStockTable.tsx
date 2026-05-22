import React from "react";
import type {SortDescriptor} from "@heroui/react";
import {Chip, Popover, Table} from "@heroui/react";
import classNames from "classnames";
import {FinvizChart} from "../stock-detail/FinvizChart";
import {ScoreButton} from "../stock-detail/ScoreButton";
import {SortableColumnHeader} from "./SortableColumnHeader";
import {WatchlistButton} from "./WatchlistButton";
import {getSectorDisplayName} from "../../constants/FilterOptions";
import type {StockRow} from "../../types/Screener";
import type {DetailKind} from "../../types/StockDetail";
import {formatCompactCurrency, formatCurrency, formatPercent, formatVolume} from "../../utils/Format";

interface Props {
    emptyMessage: string;
    error: string | null;
    isLoading: boolean;
    rows: StockRow[];
    sortDescriptor: SortDescriptor;
    watchlistTickers: string[];
    onDetailPress(row: StockRow, kind: DetailKind): void;
    onSortChange(sortDescriptor: SortDescriptor): void;
    onStockDetailPress(row: StockRow): void;
    onWatchlistToggle(row: StockRow): void;
}

export const DesktopStockTable = React.memo<Props>(({emptyMessage, error, isLoading, rows, sortDescriptor, watchlistTickers, onDetailPress, onSortChange, onStockDetailPress, onWatchlistToggle}) => {
    const [chartTicker, setChartTicker] = React.useState<string | null>(null);

    const handleChartOpenChange = (ticker: string, isOpen: boolean) => {
        setChartTicker(isOpen ? ticker : null);
    };

    const handleStockDetailPress = (row: StockRow) => {
        setChartTicker(null);
        onStockDetailPress(row);
    };

    return (
        <Table className="hidden md:block">
            <Table.ScrollContainer>
                <Table.Content aria-label="Stock screener results" className="min-w-[980px]" sortDescriptor={sortDescriptor} onSortChange={onSortChange}>
                    <Table.Header>
                        <Table.Column className="min-w-[64px]" isRowHeader>
                            排名
                        </Table.Column>
                        <Table.Column className="min-w-[128px] md:min-w-[220px]">股票</Table.Column>
                        <Table.Column className="hidden min-w-[150px] md:table-cell">板塊</Table.Column>
                        <Table.Column allowsSorting className="hidden min-w-[92px] md:table-cell" id="market_cap">
                            {({sortDirection}) => <SortableColumnHeader sortDirection={sortDirection}>市值</SortableColumnHeader>}
                        </Table.Column>
                        <Table.Column allowsSorting className="min-w-[96px]" id="change_percent">
                            {({sortDirection}) => <SortableColumnHeader sortDirection={sortDirection}>升跌幅</SortableColumnHeader>}
                        </Table.Column>
                        <Table.Column allowsSorting className="hidden min-w-[100px] md:table-cell" id="volume">
                            {({sortDirection}) => <SortableColumnHeader sortDirection={sortDirection}>成交量</SortableColumnHeader>}
                        </Table.Column>
                        <Table.Column allowsSorting className="hidden min-w-[100px] md:table-cell" id="fundamental_score">
                            {({sortDirection}) => <SortableColumnHeader sortDirection={sortDirection}>基本面</SortableColumnHeader>}
                        </Table.Column>
                        <Table.Column allowsSorting className="hidden min-w-[82px] md:table-cell" id="technical_score">
                            {({sortDirection}) => <SortableColumnHeader sortDirection={sortDirection}>技術面</SortableColumnHeader>}
                        </Table.Column>
                        <Table.Column allowsSorting className="min-w-[82px]" id="total_score">
                            {({sortDirection}) => <SortableColumnHeader sortDirection={sortDirection}>綜合</SortableColumnHeader>}
                        </Table.Column>
                    </Table.Header>
                    <Table.Body>
                        {renderTableBody(emptyMessage, rows, isLoading, error, chartTicker, watchlistTickers, onDetailPress, handleStockDetailPress, handleChartOpenChange, onWatchlistToggle)}
                    </Table.Body>
                </Table.Content>
            </Table.ScrollContainer>
        </Table>
    );
});

function renderTableBody(
    emptyMessage: string,
    rows: StockRow[],
    isLoading: boolean,
    error: string | null,
    chartTicker: string | null,
    watchlistTickers: string[],
    onDetailPress: (row: StockRow, kind: DetailKind) => void,
    onStockDetailPress: (row: StockRow) => void,
    onChartOpenChange: (ticker: string, isOpen: boolean) => void,
    onWatchlistToggle: (row: StockRow) => void
): React.ReactNode {
    if (isLoading) {
        return (
            <Table.Row>
                <Table.Cell colSpan={9}>
                    <div className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">載入緊...</div>
                </Table.Cell>
            </Table.Row>
        );
    }

    if (error) {
        return (
            <Table.Row>
                <Table.Cell colSpan={9}>
                    <div className="py-8 text-center text-sm text-red-600 dark:text-red-400">{error}</div>
                </Table.Cell>
            </Table.Row>
        );
    }

    if (rows.length === 0) {
        return (
            <Table.Row>
                <Table.Cell colSpan={9}>
                    <div className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">{emptyMessage}</div>
                </Table.Cell>
            </Table.Row>
        );
    }

    return rows.map((row, index) => {
        const isWatched = watchlistTickers.includes(row.ticker.toUpperCase());

        return (
            <Table.Row key={row.ticker} className="cursor-pointer" onAction={() => onChartOpenChange(row.ticker, chartTicker !== row.ticker)}>
                <Table.Cell className="px-2 md:px-4">
                    <span className="inline-flex size-9 items-center justify-center rounded-lg bg-neutral-300/30 text-sm font-semibold text-neutral-700 dark:bg-neutral-400/15 dark:text-neutral-300">
                        {index + 1}
                    </span>
                </Table.Cell>
                <Table.Cell className="px-2 md:px-4">
                    <div className="flex min-w-0 items-center gap-2">
                        <WatchlistButton isWatched={isWatched} tooltipPlacement="top" onPress={() => onWatchlistToggle(row)} />
                        <Popover isOpen={chartTicker === row.ticker} onOpenChange={isOpen => onChartOpenChange(row.ticker, isOpen)}>
                            <Popover.Trigger className="block min-w-0">
                                <div className="min-w-0">
                                    <p className="text-base font-semibold text-neutral-950 dark:text-neutral-100">{row.ticker}</p>
                                    <p className="max-w-[140px] truncate text-sm text-neutral-500 md:max-w-[200px] dark:text-neutral-400" title={row.name}>
                                        {row.name}
                                    </p>
                                </div>
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
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell">
                    <Chip variant="secondary">{getSectorDisplayName(row.sector)}</Chip>
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell">
                    <span className="text-sm">{formatCompactCurrency(row.marketCap)}</span>
                </Table.Cell>
                <Table.Cell className="px-2 md:px-4">
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
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell">{formatVolume(row.volume)}</Table.Cell>
                <Table.Cell className="hidden md:table-cell">
                    <ScoreButton score={row.fundamentalScore} onPress={() => onDetailPress(row, "fundamental")} />
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell">
                    <ScoreButton score={row.technicalScore} onPress={() => onDetailPress(row, "technical")} />
                </Table.Cell>
                <Table.Cell className="px-2 md:px-4">
                    <ScoreButton score={row.totalScore} onPress={() => onStockDetailPress(row)} />
                </Table.Cell>
            </Table.Row>
        );
    });
}
