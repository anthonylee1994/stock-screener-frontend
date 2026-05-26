import type {StockRow} from "@/types/screener";
import type {DetailKind} from "@/types/stockDetail";

export interface StockDetailRouteState {
    returnPath?: string;
}

function getRouteDetailKind(detailKind: string | undefined): DetailKind | null {
    if (detailKind === "fundamental" || detailKind === "technical") {
        return detailKind;
    }

    return null;
}

function getListPath(search: string): string {
    return `/${search}`;
}

function getStockDetailPath(row: StockRow, search: string): string {
    return `/${encodeURIComponent(row.ticker.toUpperCase())}${search}`;
}

function getScoreDetailPath(row: StockRow, kind: DetailKind, search: string): string {
    return `/${encodeURIComponent(row.ticker.toUpperCase())}/${kind}${search}`;
}

export const StockDetailUtil = Object.freeze({
    getRouteDetailKind,
    getListPath,
    getStockDetailPath,
    getScoreDetailPath,
});
