import type {ScreenerApiResponse, ScreenerApiRow, ScreenerFilters, StockRow} from "../types/Screener";

const apiToken = import.meta.env.VITE_API_TOKEN;

export async function fetchScreenerRows(filters: ScreenerFilters, signal: AbortSignal): Promise<{count: number; data: StockRow[]}> {
    const url = new URL("/screener", getApiUrl());

    url.searchParams.set("api_token", apiToken);
    url.searchParams.set("sector", filters.sector);
    url.searchParams.set("market_cap", filters.marketCap);
    url.searchParams.set("order", filters.order);
    url.searchParams.set("ascend", String(filters.ascend));

    const response = await fetch(url, {signal});

    if (!response.ok) {
        throw new Error(`Backend 回應 ${response.status}`);
    }

    const payload = (await response.json()) as ScreenerApiResponse;

    if ("error" in payload) {
        throw new Error(payload.error);
    }

    return {
        count: payload.count,
        data: payload.data.map(normalizeStockRow),
    };
}

function getApiUrl(): string {
    return import.meta.env.VITE_API_URL || "https://stock-screener.on99.app";
}

function normalizeStockRow(row: ScreenerApiRow): StockRow {
    return {
        ticker: row.ticker,
        name: row.name,
        sector: row.sector,
        marketCap: row.market_cap,
        price: row.price,
        change: row.change,
        changePercent: row.change_percent,
        volume: row.volume,
        fundamentalScore: row.fundamental.fundamental_score,
        technicalScore: row.technical.technical_score,
        totalScore: row.total_score,
    };
}
