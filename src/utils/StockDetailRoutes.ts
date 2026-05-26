import type {StockRow} from "@/types/Screener";
import type {DetailKind} from "@/types/StockDetail";

export interface StockDetailRouteState {
    returnPath?: string;
}

export function getRouteDetailKind(detailKind: string | undefined): DetailKind | null {
    if (detailKind === "fundamental" || detailKind === "technical") {
        return detailKind;
    }

    return null;
}

export function getListPath(search: string): string {
    return `/${search}`;
}

export function getStockDetailPath(row: StockRow, search: string): string {
    return `/${encodeURIComponent(row.ticker.toUpperCase())}${search}`;
}

export function getScoreDetailPath(row: StockRow, kind: DetailKind, search: string): string {
    return `/${encodeURIComponent(row.ticker.toUpperCase())}/${kind}${search}`;
}
