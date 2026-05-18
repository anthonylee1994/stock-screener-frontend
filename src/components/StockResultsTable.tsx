import React from "react";
import type {SortDescriptor} from "@heroui/react";
import {Chip, Table} from "@heroui/react";
import {MobileStockList} from "./MobileStockList";
import {ScoreButton} from "./ScoreButton";
import {ScoreDetailModal} from "./ScoreDetailModal";
import type {DetailKind, DetailModalState} from "./ScoreDetailModal";
import {SortableColumnHeader} from "./SortableColumnHeader";
import {getSectorDisplayName} from "../constants/FilterOptions";
import {formatCompactCurrency, formatCurrency, formatPercent, formatScore, formatVolume} from "../utils/Format";
import {getScoreClassName} from "../utils/ScoreStyle";
import type {StockRow} from "../types/Screener";

interface Props {
    error: string | null;
    isLoading: boolean;
    sortDescriptor: SortDescriptor;
    rows: StockRow[];
    onSortChange: (sortDescriptor: SortDescriptor) => void;
}

export const StockResultsTable = React.memo<Props>(({error, isLoading, rows, sortDescriptor, onSortChange}) => {
    const [detailModal, setDetailModal] = React.useState<DetailModalState | null>(null);
    const [mobileSelectedRow, setMobileSelectedRow] = React.useState<StockRow | null>(null);
    const [mobileReturnRow, setMobileReturnRow] = React.useState<StockRow | null>(null);

    const handleDetailPress = (row: StockRow, kind: DetailKind) => {
        setDetailModal({kind, row});
    };

    const handleMobileDetailPress = (row: StockRow, kind: DetailKind) => {
        setMobileSelectedRow(null);
        setMobileReturnRow(row);
        setDetailModal({kind, row});
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
                    onSortChange={onSortChange}
                />
            </div>
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
                            <Table.Column className="min-w-[96px]">價格</Table.Column>
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
                        <Table.Body>{renderTableBody(rows, isLoading, error, handleDetailPress)}</Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
            <ScoreDetailModal detailModal={detailModal} onOpenChange={handleModalOpenChange} />
        </React.Fragment>
    );
});

function renderTableBody(rows: StockRow[], isLoading: boolean, error: string | null, onDetailPress: (row: StockRow, kind: DetailKind) => void): React.ReactNode {
    if (isLoading) {
        return (
            <Table.Row>
                <Table.Cell colSpan={9}>
                    <div className="py-8 text-center text-sm text-slate-500">載入緊...</div>
                </Table.Cell>
            </Table.Row>
        );
    }

    if (error) {
        return (
            <Table.Row>
                <Table.Cell colSpan={9}>
                    <div className="py-8 text-center text-sm text-red-600">{error}</div>
                </Table.Cell>
            </Table.Row>
        );
    }

    if (rows.length === 0) {
        return (
            <Table.Row>
                <Table.Cell colSpan={9}>
                    <div className="py-8 text-center text-sm text-slate-500">搵唔到符合條件嘅股票</div>
                </Table.Cell>
            </Table.Row>
        );
    }

    return rows.map((row, index) => (
        <Table.Row key={row.ticker}>
            <Table.Cell className="px-2 md:px-4">
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-sm font-semibold text-emerald-700">{index + 1}</span>
            </Table.Cell>
            <Table.Cell className="px-2 md:px-4">
                <div className="min-w-0">
                    <p className="text-base font-semibold text-slate-950">{row.ticker}</p>
                    <p className="max-w-[140px] truncate text-sm text-slate-500 md:max-w-[240px]">{row.name}</p>
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
                    <p className="text-base font-semibold text-slate-950">{formatCurrency(row.price)}</p>
                    <p className={row.changePercent >= 0 ? "text-sm text-emerald-600" : "text-sm text-red-500"}>{formatPercent(row.changePercent)}</p>
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
                <span className={getScoreClassName(row.totalScore, "button")}>{formatScore(row.totalScore)}</span>
            </Table.Cell>
        </Table.Row>
    ));
}
