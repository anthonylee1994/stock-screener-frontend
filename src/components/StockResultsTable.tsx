import React from "react";
import type {SortDescriptor} from "@heroui/react";
import {Button, Chip, Modal, Table} from "@heroui/react";
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
                        <Table.Body>{renderTableBody(rows, isLoading, error, handleDetailPress)}</Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
            <ScoreDetailModal detailModal={detailModal} onOpenChange={handleModalOpenChange} />
        </React.Fragment>
    );
});

type DetailKind = "fundamental" | "technical";

type DetailModalState = {
    kind: DetailKind;
    row: StockRow;
};

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
            <Table.Cell>
                <ScoreButton score={row.fundamentalScore} onPress={() => onDetailPress(row, "fundamental")} />
            </Table.Cell>
            <Table.Cell>
                <ScoreButton score={row.technicalScore} onPress={() => onDetailPress(row, "technical")} />
            </Table.Cell>
            <Table.Cell>
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

type ScoreDetailModalProps = {
    detailModal: DetailModalState | null;
    onOpenChange: (isOpen: boolean) => void;
};

const ScoreDetailModal = React.memo((props: ScoreDetailModalProps) => {
    const {detailModal, onOpenChange} = props;
    const row = detailModal?.row;
    const title = detailModal?.kind === "fundamental" ? "基本面詳情" : "技術面詳情";
    const details = detailModal ? getDetailItems(detailModal) : [];
    const gridClassName = detailModal?.kind === "technical" ? "grid grid-cols-1 gap-3" : "grid gap-3 sm:grid-cols-2";

    return (
        <Modal.Backdrop isOpen={detailModal !== null} onOpenChange={onOpenChange}>
            <Modal.Container size="lg">
                <Modal.Dialog>
                    <Modal.CloseTrigger />
                    <Modal.Header>
                        <Modal.Heading>{row ? `${row.ticker} ${title}` : title}</Modal.Heading>
                    </Modal.Header>
                    <Modal.Body>
                        {row ? <p className="text-sm text-slate-500 mb-3">{row.name}</p> : null}
                        <div className={gridClassName}>
                            {details.map(detail => (
                                <div key={detail.label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                    <p className="text-xs font-medium text-slate-500">{detail.label}</p>
                                    <p className="mt-1 text-lg font-semibold text-slate-950">{detail.value}</p>
                                </div>
                            ))}
                        </div>
                    </Modal.Body>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
});

type DetailItem = {
    label: string;
    value: string;
};

function getDetailItems(detailModal: DetailModalState): DetailItem[] {
    const {kind, row} = detailModal;

    if (kind === "fundamental") {
        return [
            {label: "市值", value: formatCompactCurrency(row.fundamental.marketCap)},
            {label: "市值得分", value: formatScore(row.fundamental.marketCapScore)},
            {label: "預測市盈率", value: formatNumber(row.fundamental.forwardPe)},
            {label: "預測市盈率得分", value: formatScore(row.fundamental.forwardPeScore)},
            {label: "PEG", value: formatNumber(row.fundamental.peg)},
            {label: "PEG 得分", value: formatScore(row.fundamental.pegScore)},
            {label: "過去5年每股盈利", value: formatPercent(row.fundamental.epsPast5Y)},
            {label: "過去5年每股盈利得分", value: formatScore(row.fundamental.epsPast5YScore)},
            {label: "股東權益報酬率", value: formatPercent(row.fundamental.roe)},
            {label: "ROE 得分", value: formatScore(row.fundamental.roeScore)},
        ];
    }

    return [
        {label: "短期得分", value: formatScore(row.technical.shortTermScore)},
        {label: "中期得分", value: formatScore(row.technical.midTermScore)},
        {label: "長期得分", value: formatScore(row.technical.longTermScore)},
    ];
}

function formatNumber(value: number): string {
    return value.toFixed(2);
}

function getScoreClassName(score: number): string {
    const baseClassName = "inline-flex min-w-16 justify-center rounded-md px-3 py-2 font-semibold";

    if (score >= 80) {
        return `${baseClassName} bg-emerald-100 text-emerald-700`;
    }

    if (score >= 60) {
        return `${baseClassName} bg-lime-100 text-lime-700`;
    }

    if (score >= 40) {
        return `${baseClassName} bg-amber-100 text-amber-700`;
    }

    return `${baseClassName} bg-red-100 text-red-700`;
}
