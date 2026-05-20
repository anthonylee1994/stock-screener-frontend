import React from "react";
import type {SortDescriptor} from "@heroui/react";
import {Chip, Popover, Table} from "@heroui/react";
import classNames from "classnames";
import {FinvizChart} from "./FinvizChart";
import {MobileStockList} from "./MobileStockList";
import {ScoreButton} from "./ScoreButton";
import {ScoreDetailModal} from "./ScoreDetailModal";
import type {DetailKind, DetailModalState} from "./ScoreDetailModal";
import {SortableColumnHeader} from "./SortableColumnHeader";
import {StockDetailModal} from "./StockDetailModal";
import {getSectorDisplayName} from "../constants/FilterOptions";
import {useScreenerStore} from "../stores/useScreenerStore";
import {formatCompactCurrency, formatCurrency, formatPercent, formatVolume} from "../utils/Format";
import type {StockRow} from "../types/Screener";

export const StockResultsTable = React.memo(() => {
    const error = useScreenerStore(state => state.error);
    const filters = useScreenerStore(state => state.filters);
    const isLoading = useScreenerStore(state => state.isLoading);
    const rows = useScreenerStore(state => state.rows);
    const sortRows = useScreenerStore(state => state.sortRows);
    const [detailModal, setDetailModal] = React.useState<DetailModalState | null>(null);
    const [chartTicker, setChartTicker] = React.useState<string | null>(null);
    const [selectedStockDetailRow, setSelectedStockDetailRow] = React.useState<StockRow | null>(null);
    const [mobileSelectedRow, setMobileSelectedRow] = React.useState<StockRow | null>(null);
    const [mobileReturnRow, setMobileReturnRow] = React.useState<StockRow | null>(null);
    const sortDescriptor: SortDescriptor = {
        column: filters.order,
        direction: filters.ascend ? "ascending" : "descending",
    };

    const handleDetailPress = (row: StockRow, kind: DetailKind) => {
        setDetailModal({kind, row});
    };

    const handleMobileDetailPress = (row: StockRow, kind: DetailKind) => {
        setMobileSelectedRow(null);
        setMobileReturnRow(row);
        setDetailModal({kind, row});
    };

    const handleStockDetailPress = (row: StockRow) => {
        setChartTicker(null);
        setSelectedStockDetailRow(row);
    };

    const handleChartOpenChange = (ticker: string, isOpen: boolean) => {
        setChartTicker(isOpen ? ticker : null);
    };

    const handleModalOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setDetailModal(null);

            if (mobileReturnRow) {
                setMobileSelectedRow(mobileReturnRow);
                setMobileReturnRow(null);
            }
        }
    };

    const handleStockDetailOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setSelectedStockDetailRow(null);
        }
    };

    return (
        <React.Fragment>
            <div className="md:hidden">
                <MobileStockList
                    error={error}
                    isLoading={isLoading}
                    rows={rows}
                    selectedRow={mobileSelectedRow}
                    sortDescriptor={sortDescriptor}
                    onDetailPress={handleMobileDetailPress}
                    onSelectedRowChange={setMobileSelectedRow}
                    onSortChange={sortRows}
                />
            </div>
            <Table className="hidden md:block">
                <Table.ScrollContainer>
                    <Table.Content aria-label="Stock screener results" className="min-w-[980px]" sortDescriptor={sortDescriptor} onSortChange={sortRows}>
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
                        <Table.Body>{renderTableBody(rows, isLoading, error, chartTicker, handleDetailPress, handleStockDetailPress, handleChartOpenChange)}</Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
            <ScoreDetailModal detailModal={detailModal} onOpenChange={handleModalOpenChange} />
            <StockDetailModal row={selectedStockDetailRow} onDetailPress={handleDetailPress} onOpenChange={handleStockDetailOpenChange} />
        </React.Fragment>
    );
});

function renderTableBody(
    rows: StockRow[],
    isLoading: boolean,
    error: string | null,
    chartTicker: string | null,
    onDetailPress: (row: StockRow, kind: DetailKind) => void,
    onStockDetailPress: (row: StockRow) => void,
    onChartOpenChange: (ticker: string, isOpen: boolean) => void
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
                    <div className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">搵唔到符合條件嘅股票</div>
                </Table.Cell>
            </Table.Row>
        );
    }

    return rows.map((row, index) => (
        <Table.Row key={row.ticker} className="cursor-pointer" onAction={() => onChartOpenChange(row.ticker, chartTicker !== row.ticker)}>
            <Table.Cell className="px-2 md:px-4">
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-neutral-300/30 text-sm font-semibold text-neutral-700 dark:bg-neutral-400/15 dark:text-neutral-300">
                    {index + 1}
                </span>
            </Table.Cell>
            <Table.Cell className="px-2 md:px-4">
                <Popover isOpen={chartTicker === row.ticker} onOpenChange={isOpen => onChartOpenChange(row.ticker, isOpen)}>
                    <Popover.Trigger className="block min-w-0">
                        <div className="min-w-0">
                            <p className="text-base font-semibold text-neutral-950 dark:text-neutral-100">{row.ticker}</p>
                            <p className="max-w-[140px] truncate text-sm text-neutral-500 md:max-w-[240px] dark:text-neutral-400" title={row.name}>
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
    ));
}
