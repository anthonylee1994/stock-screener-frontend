import type {DetailModalState} from "@/types/stockDetail";
import {FormatUtil} from "@/utils/FormatUtil";

export interface DetailItem {
    label: string;
    score?: number;
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
                title: "增長",
                items: [
                    {label: "過去5年每股盈利", score: row.fundamental.epsPast5yScore, value: formatPercent(row.fundamental.epsPast5y)},
                    {label: "過去5年每股營收", score: row.fundamental.salesPast5yScore, value: formatPercent(row.fundamental.salesPast5y)},
                    {label: "每股盈利季度增長", value: formatPercent(row.fundamental.epsQuarterOverQuarter)},
                    {label: "每股營收季度增長", value: formatPercent(row.fundamental.salesQuarterOverQuarter)},
                ],
            },
            {
                title: "質素",
                items: [
                    {label: "ROE", score: row.fundamental.roeScore, value: formatPercent(row.fundamental.roe, false)},
                    {label: "ROIC", value: formatPercent(row.fundamental.roic, false)},
                    {label: "純利率", value: formatPercent(row.fundamental.profitMargin, false)},
                    {label: "毛利率", value: formatPercent(row.fundamental.grossMargin, false)},
                    {label: "營業利潤率", value: formatPercent(row.fundamental.operatingMargin, false)},
                ],
            },
            {
                title: "估值",
                items: [
                    {label: "PEG", value: formatNumber(row.fundamental.peg)},
                    {label: "市現率", value: formatNumber(row.fundamental.pfcf)},
                    {label: "預測市盈率", value: formatNumber(row.fundamental.forwardPe)},
                    {label: "市銷率", value: formatNumber(row.fundamental.ps)},
                ],
            },
            {
                title: "規模/風險",
                items: [
                    {label: "市值", score: row.fundamental.marketCapScore, value: formatCompactCurrency(row.fundamental.marketCap)},
                    {label: "負債/資產比率", score: row.fundamental.debtEquityScore, value: formatNumber(row.fundamental.debtEquity)},
                    {label: "距離52週高位", value: formatPercent(row.fundamental.high52w, false)},
                    {label: "沽空比例", value: formatPercent(row.fundamental.shortInterest, false)},
                ],
            },
        ];
    }

    return [
        {
            items: [
                {label: "短期走勢", value: formatScore(row.technical.shortTermScore)},
                {label: "中期走勢", value: formatScore(row.technical.midTermScore)},
                {label: "長期走勢", value: formatScore(row.technical.longTermScore)},
            ],
        },
    ];
}

function formatNullableNumber(value: number | null, formatter: (value: number) => string): string {
    if (value === null) {
        return "N/A";
    }

    return formatter(value);
}

function formatCompactCurrency(value: number | null): string {
    return formatNullableNumber(value, FormatUtil.formatCompactCurrency);
}

function formatScore(value: number | null): string {
    return formatNullableNumber(value, FormatUtil.formatScore);
}

function formatPercent(value: number | null, withSign?: boolean): string {
    return formatNullableNumber(value, currentValue => FormatUtil.formatPercent(currentValue, withSign));
}

function formatNumber(value: number | null): string {
    return formatNullableNumber(value, currentValue => currentValue.toFixed(2));
}

export const ScoreDetailSectionsUtil = Object.freeze({
    getDetailSummary,
    getDetailSections,
});
