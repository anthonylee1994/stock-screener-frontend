import type {DetailModalState} from "@/types/stockDetail";
import {format} from "@/utils/format";

export interface DetailItem {
    label: string;
    value: string;
}

export interface DetailSection {
    items: DetailItem[];
    title?: string;
}

export interface DetailSummary {
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

function getDetailSections(detailModal: DetailModalState): DetailSection[] {
    const {kind, row} = detailModal;

    if (kind === "fundamental") {
        return [
            {
                title: "納入總分",
                items: [
                    {label: "市值", value: format.formatCompactCurrency(row.fundamental.marketCap ?? 0)},
                    {label: "市值得分", value: format.formatScore(row.fundamental.marketCapScore)},
                    {label: "PEG", value: formatNumber(row.fundamental.peg ?? 0)},
                    {label: "PEG 得分", value: format.formatScore(row.fundamental.pegScore)},
                    {label: "過去5年每股盈利", value: format.formatPercent(row.fundamental.epsPast5y ?? 0)},
                    {label: "過去5年每股盈利得分", value: format.formatScore(row.fundamental.epsPast5yScore)},
                    {label: "ROE", value: format.formatPercent(row.fundamental.roe ?? 0, false)},
                    {label: "ROE 得分", value: format.formatScore(row.fundamental.roeScore)},
                    {label: "ROIC", value: format.formatPercent(row.fundamental.roic ?? 0, false)},
                    {label: "ROIC 得分", value: format.formatScore(row.fundamental.roicScore)},
                ],
            },
            {
                title: "不納入總分",
                items: [
                    {label: "預測市盈率", value: formatNumber(row.fundamental.forwardPe ?? 0)},
                    {label: "預測市盈率得分", value: format.formatScore(row.fundamental.forwardPeScore)},
                    {label: "市銷率", value: formatNumber(row.fundamental.ps ?? 0)},
                    {label: "市銷率得分", value: format.formatScore(row.fundamental.psScore)},
                    {label: "市現率", value: format.formatScore(row.fundamental.pfcf ?? 0)},
                    {label: "市現率得分", value: format.formatScore(row.fundamental.pfcfScore)},
                    {label: "過去5年每股營收", value: format.formatPercent(row.fundamental.salesPast5y ?? 0)},
                    {label: "過去5年每股營收得分", value: format.formatScore(row.fundamental.salesPast5yScore)},
                    {label: "純利率", value: format.formatPercent(row.fundamental.profitMargin ?? 0, false)},
                    {label: "純利率得分", value: format.formatScore(row.fundamental.profitMarginScore)},
                    {label: "負債/資產比率", value: formatNumber(row.fundamental.debtEquity ?? 0)},
                    {label: "負債/資產比率得分", value: format.formatScore(row.fundamental.debtEquityScore)},
                ],
            },
        ];
    }

    return [
        {
            items: [
                {label: "短期走勢", value: format.formatScore(row.technical.shortTermScore)},
                {label: "中期走勢", value: format.formatScore(row.technical.midTermScore)},
                {label: "長期走勢", value: format.formatScore(row.technical.longTermScore)},
            ],
        },
    ];
}

export const scoreDetailSections = {
    getDetailSummary,
    getDetailSections,
};

function formatNumber(value: number): string {
    return value.toFixed(2);
}
