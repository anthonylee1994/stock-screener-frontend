import React from "react";
import type {SortDescriptor} from "@heroui/react";
import {Button, Chip, Table} from "@heroui/react";
import {ChevronUp} from "lucide-react";
import {MobileStockDetailModal} from "./MobileStockDetailModal";
import {ScoreDetailModal} from "./ScoreDetailModal";
import type {DetailKind, DetailModalState} from "./ScoreDetailModal";
import {getSectorDisplayName} from "../constants/FilterOptions";
import {formatCompactCurrency, formatCurrency, formatPercent, formatScore, formatVolume} from "../utils/Format";
import {getScoreClassName} from "../utils/ScoreStyle";
import type {StockRow} from "../types/Screener";

type StockResultsTableProps = {
    error: string | null;
    isLoading: boolean;
    sortDescriptor: SortDescriptor;
    rows: StockRow[];
    onSortChange: (sortDescriptor: SortDescriptor) => void;
};

export const StockResultsTable = React.memo((props: StockResultsTableProps) => {
    const {error, isLoading, rows, sortDescriptor, onSortChange} = props;
    const [detailModal, setDetailModal] = React.useState<DetailModalState | null>(null);

    const handleDetailPress = (row: StockRow, kind: DetailKind) => {
        setDetailModal({kind, row});
    };

    const handleModalOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setDetailModal(null);
        }
    };

    return (
        <React.Fragment>
            <div className="md:hidden">
                <MobileStockList error={error} isLoading={isLoading} rows={rows} onDetailPress={handleDetailPress} />
            </div>
            <Table className="hidden md:block">
                <Table.ScrollContainer>
                    <Table.Content aria-label="Stock screener results" className="min-w-[980px]" sortDescriptor={sortDescriptor} onSortChange={onSortChange}>
                        <Table.Header>
                            <Table.Column className="w-12" isRowHeader>
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
                                {({sortDirection}) => <SortableColumnHeader sortDirection={sortDirection}>評分</SortableColumnHeader>}
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

type MobileStockListProps = {
    error: string | null;
    isLoading: boolean;
    rows: StockRow[];
    onDetailPress: (row: StockRow, kind: DetailKind) => void;
};

const MobileStockList = React.memo((props: MobileStockListProps) => {
    const {error, isLoading, rows, onDetailPress} = props;
    const [selectedRow, setSelectedRow] = React.useState<StockRow | null>(null);

    const handleRowPress = (row: StockRow) => {
        setSelectedRow(row);
    };

    const handleModalOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setSelectedRow(null);
        }
    };

    if (isLoading) {
        return <div className="rounded-2xl bg-white py-8 text-center text-sm text-slate-500">載入緊...</div>;
    }

    if (error) {
        return <div className="rounded-2xl bg-white py-8 text-center text-sm text-red-600">{error}</div>;
    }

    if (rows.length === 0) {
        return <div className="rounded-2xl bg-white py-8 text-center text-sm text-slate-500">搵唔到符合條件嘅股票</div>;
    }

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-[48px_minmax(0,1fr)_92px_64px] border-b border-slate-200 bg-slate-50 px-3 py-3 text-xs font-semibold text-slate-500">
                <span className="text-center">排名</span>
                <span>股票</span>
                <span className="text-right">價格</span>
                <span className="text-right">評分</span>
            </div>
            {rows.map((row, index) => (
                <button
                    key={row.ticker}
                    className="grid w-full grid-cols-[48px_minmax(0,1fr)_92px_64px] items-center gap-0 border-b border-slate-100 px-3 py-3 text-left last:border-b-0 active:bg-slate-50"
                    type="button"
                    onClick={() => handleRowPress(row)}
                >
                    <div className="flex justify-center">
                        <span className="inline-flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-sm font-semibold text-emerald-700">{index + 1}</span>
                    </div>
                    <div className="min-w-0 px-2">
                        <p className="truncate text-base font-semibold text-slate-950">{row.ticker}</p>
                        <p className="truncate text-sm text-slate-500">{row.name}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-slate-950">{formatCurrency(row.price)}</p>
                        <p className={row.changePercent >= 0 ? "text-sm text-emerald-600" : "text-sm text-red-500"}>{formatPercent(row.changePercent)}</p>
                    </div>
                    <div className="flex justify-end">
                        <span className={getScoreClassName(row.totalScore, "mobilePill")}>{formatScore(row.totalScore)}</span>
                    </div>
                </button>
            ))}
            <MobileStockDetailModal row={selectedRow} onDetailPress={onDetailPress} onOpenChange={handleModalOpenChange} />
        </section>
    );
});

type SortableColumnHeaderProps = {
    children: React.ReactNode;
    sortDirection?: "ascending" | "descending";
};

const SortableColumnHeader = React.memo((props: SortableColumnHeaderProps) => {
    const {children, sortDirection} = props;
    const iconClassName = sortDirection === "descending" ? "size-3 rotate-180 transition-transform" : "size-3 transition-transform";

    return (
        <span className="flex items-center justify-between gap-2">
            {children}
            {sortDirection ? <ChevronUp className={iconClassName} /> : <span className="size-3" />}
        </span>
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
                <span className={getScoreClassName(row.totalScore)}>{formatScore(row.totalScore)}</span>
            </Table.Cell>
        </Table.Row>
    ));
}

type ScoreButtonProps = {
    score: number;
    onPress: () => void;
};

const ScoreButton = React.memo((props: ScoreButtonProps) => {
    const {score, onPress} = props;

    return (
        <Button className="h-8 min-w-14 rounded-md px-2 font-semibold text-slate-800" size="sm" variant="ghost" onPress={onPress}>
            {formatScore(score)}
        </Button>
    );
});
