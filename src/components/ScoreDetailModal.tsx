import React from "react";
import {Modal} from "@heroui/react";
import classNames from "classnames";
import type {StockRow} from "../types/Screener";
import {formatCompactCurrency, formatPercent, formatScore} from "../utils/Format";
import {getScoreClassName} from "../utils/ScoreStyle";
import {FinvizChart} from "./FinvizChart";

export type DetailKind = "fundamental" | "technical";

export interface DetailModalState {
    kind: DetailKind;
    row: StockRow;
}

interface Props {
    detailModal: DetailModalState | null;
    onOpenChange: (isOpen: boolean) => void;
}

export const ScoreDetailModal = React.memo<Props>(({detailModal, onOpenChange}) => {
    const row = detailModal?.row;
    const title = detailModal?.kind === "fundamental" ? "基本面詳情" : "技術面詳情";
    const details = detailModal ? getDetailItems(detailModal) : [];
    const summary = detailModal ? getDetailSummary(detailModal) : null;
    const gridClassName = classNames("grid gap-3", {
        "grid-cols-3": detailModal?.kind === "technical",
        "grid-cols-2": detailModal?.kind !== "technical",
    });

    return (
        <Modal.Backdrop isOpen={detailModal !== null} onOpenChange={onOpenChange}>
            <Modal.Container size="lg" placement="center" scroll="outside">
                <Modal.Dialog className="dark:bg-neutral-900">
                    <Modal.CloseTrigger />
                    <Modal.Header>
                        <Modal.Heading>{row ? `${row.ticker} ${title}` : title}</Modal.Heading>
                    </Modal.Header>
                    <Modal.Body>
                        {row ? <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">{row.name}</p> : null}
                        {row && detailModal?.kind === "technical" ? <FinvizChart className="mb-4" ticker={row.ticker} /> : null}
                        {summary ? (
                            <div className={getScoreClassName(summary.score, "summary")}>
                                <p className="text-xs font-medium">{summary.label}</p>
                                <p className="mt-1 text-3xl font-semibold">{formatScore(summary.score)}</p>
                            </div>
                        ) : null}
                        <div className={gridClassName}>
                            {details.map(detail => (
                                <div key={detail.label} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800">
                                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{detail.label}</p>
                                    <p className="mt-1 text-lg font-semibold text-neutral-950 dark:text-neutral-100">{detail.value}</p>
                                </div>
                            ))}
                        </div>
                    </Modal.Body>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
});

interface DetailItem {
    label: string;
    value: string;
}

interface DetailSummary {
    label: string;
    score: number;
}

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
            {label: "市值", value: formatCompactCurrency(row.fundamental.marketCap ?? 0)},
            {label: "市值得分", value: formatScore(row.fundamental.marketCapScore)},
            {label: "預測市盈率", value: formatNumber(row.fundamental.forwardPe ?? 0)},
            {label: "預測市盈率得分", value: formatScore(row.fundamental.forwardPeScore)},
            {label: "PEG", value: formatNumber(row.fundamental.peg ?? 0)},
            {label: "PEG 得分", value: formatScore(row.fundamental.pegScore)},
            {label: "市銷率", value: formatNumber(row.fundamental.ps ?? 0)},
            {label: "市銷率得分", value: formatScore(row.fundamental.psScore)},
            {label: "過去5年每股盈利", value: formatPercent(row.fundamental.epsPast5y ?? 0)},
            {label: "過去5年每股盈利得分", value: formatScore(row.fundamental.epsPast5yScore)},
            {label: "過去5年每股營收", value: formatPercent(row.fundamental.salesPast5y ?? 0)},
            {label: "過去5年每股營收得分", value: formatScore(row.fundamental.salesPast5yScore)},
            {label: "ROE", value: formatPercent(row.fundamental.roe ?? 0, false)},
            {label: "ROE 得分", value: formatScore(row.fundamental.roeScore)},
            {label: "純利率", value: formatPercent(row.fundamental.profitMargin ?? 0, false)},
            {label: "純利率得分", value: formatScore(row.fundamental.profitMarginScore)},
            {label: "負債比率", value: formatPercent(row.fundamental.debtEquity ?? 0, false)},
            {label: "負債比率得分", value: formatScore(row.fundamental.debtEquityScore)},
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
