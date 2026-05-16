import React from "react";
import type {SortDescriptor} from "@heroui/react";
import {Chip, Table} from "@heroui/react";
import {ChevronUp} from "lucide-react";
import {getSectorDisplayName} from "../constants/FilterOptions";
import {formatCompactCurrency, formatCurrency, formatPercent, formatScore, formatVolume} from "../utils/Format";
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

    return (
        <Table>
            <Table.ScrollContainer>
                <Table.Content aria-label="Stock screener results" className="min-w-[980px]" sortDescriptor={sortDescriptor} onSortChange={onSortChange}>
                    <Table.Header>
                        <Table.Column isRowHeader>排名</Table.Column>
                        <Table.Column>股票</Table.Column>
                        <Table.Column className="min-w-[150px]">板塊</Table.Column>
                        <Table.Column allowsSorting id="market_cap">
                            {({sortDirection}) => <SortableColumnHeader sortDirection={sortDirection}>市值</SortableColumnHeader>}
                        </Table.Column>
                        <Table.Column>價格</Table.Column>
                        <Table.Column allowsSorting id="volume" className="min-w-[100px]">
                            {({sortDirection}) => <SortableColumnHeader sortDirection={sortDirection}>成交量</SortableColumnHeader>}
                        </Table.Column>
                        <Table.Column allowsSorting id="fundamental_score" className="min-w-[100px]">
                            {({sortDirection}) => <SortableColumnHeader sortDirection={sortDirection}>基本面</SortableColumnHeader>}
                        </Table.Column>
                        <Table.Column allowsSorting id="technical_score" className="min-w-[100px]">
                            {({sortDirection}) => <SortableColumnHeader sortDirection={sortDirection}>技術面</SortableColumnHeader>}
                        </Table.Column>
                        <Table.Column allowsSorting id="total_score">
                            {({sortDirection}) => <SortableColumnHeader sortDirection={sortDirection}>總分</SortableColumnHeader>}
                        </Table.Column>
                    </Table.Header>
                    <Table.Body>{renderTableBody(rows, isLoading, error)}</Table.Body>
                </Table.Content>
            </Table.ScrollContainer>
        </Table>
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

function renderTableBody(rows: StockRow[], isLoading: boolean, error: string | null): React.ReactNode {
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
            <Table.Cell>
                <span className="inline-flex size-9 items-center justify-center rounded-md bg-emerald-50 text-sm font-semibold text-emerald-700">{index + 1}</span>
            </Table.Cell>
            <Table.Cell>
                <div className="min-w-0">
                    <p className="text-base font-semibold text-slate-950">{row.ticker}</p>
                    <p className="max-w-[240px] truncate text-sm text-slate-500">{row.name}</p>
                </div>
            </Table.Cell>
            <Table.Cell>
                <Chip variant="secondary">{getSectorDisplayName(row.sector)}</Chip>
            </Table.Cell>
            <Table.Cell>{formatCompactCurrency(row.marketCap)}</Table.Cell>
            <Table.Cell>
                <div className="text-right">
                    <p className="font-semibold text-slate-950">{formatCurrency(row.price)}</p>
                    <p className={row.changePercent >= 0 ? "text-sm text-emerald-600" : "text-sm text-red-500"}>{formatPercent(row.changePercent)}</p>
                </div>
            </Table.Cell>
            <Table.Cell>{formatVolume(row.volume)}</Table.Cell>
            <Table.Cell>{formatScore(row.fundamentalScore)}</Table.Cell>
            <Table.Cell>{formatScore(row.technicalScore)}</Table.Cell>
            <Table.Cell>
                <span className="inline-flex min-w-16 justify-center rounded-md bg-emerald-50 px-3 py-2 font-semibold text-emerald-700">{formatScore(row.totalScore)}</span>
            </Table.Cell>
        </Table.Row>
    ));
}
