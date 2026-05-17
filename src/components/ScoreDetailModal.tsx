import React from "react";
import {Modal} from "@heroui/react";
import type {StockRow} from "../types/Screener";
import {formatCompactCurrency, formatPercent, formatScore} from "../utils/Format";
import {getScoreClassName} from "../utils/ScoreStyle";

export type DetailKind = "fundamental" | "technical";

export type DetailModalState = {
    kind: DetailKind;
    row: StockRow;
};

type ScoreDetailModalProps = {
    detailModal: DetailModalState | null;
    onOpenChange: (isOpen: boolean) => void;
};

export const ScoreDetailModal = React.memo((props: ScoreDetailModalProps) => {
    const {detailModal, onOpenChange} = props;
    const row = detailModal?.row;
    const title = detailModal?.kind === "fundamental" ? "基本面詳情" : "技術面詳情";
    const details = detailModal ? getDetailItems(detailModal) : [];
    const summary = detailModal ? getDetailSummary(detailModal) : null;
    const gridClassName = detailModal?.kind === "technical" ? "grid grid-cols-3 gap-3" : "grid gap-3 grid-cols-2";

    return (
        <Modal.Backdrop isOpen={detailModal !== null} onOpenChange={onOpenChange}>
            <Modal.Container size="lg" placement="center">
                <Modal.Dialog>
                    <Modal.CloseTrigger />
                    <Modal.Header>
                        <Modal.Heading>{row ? `${row.ticker} ${title}` : title}</Modal.Heading>
                    </Modal.Header>
                    <Modal.Body>
                        {row ? <p className="text-sm text-slate-500 mb-3">{row.name}</p> : null}
                        {summary ? (
                            <div className={getScoreClassName(summary.score, "summary")}>
                                <p className="text-xs font-medium">{summary.label}</p>
                                <p className="mt-1 text-3xl font-semibold">{formatScore(summary.score)}</p>
                            </div>
                        ) : null}
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

type DetailSummary = {
    label: string;
    score: number;
};

function getDetailSummary(detailModal: DetailModalState): DetailSummary {
    const {kind, row} = detailModal;

    if (kind === "fundamental") {
        return {label: "基本面總分", score: row.fundamental.score};
    }

    return {label: "技術面總分", score: row.technical.score};
}

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
            {label: "ROE", value: formatPercent(row.fundamental.roe)},
            {label: "ROE得分", value: formatScore(row.fundamental.roeScore)},
        ];
    }

    return [
        {label: "短期走勢", value: formatScore(row.technical.shortTermScore)},
        {label: "中期走勢", value: formatScore(row.technical.midTermScore)},
        {label: "長期走勢", value: formatScore(row.technical.longTermScore)},
    ];
}

function formatNumber(value: number): string {
    return value.toFixed(2);
}
