import type {ScreenerApiResponse, ScreenerApiRow, ScreenerFilters, StockRow} from "../types/Screener";

type AuthResponse = {
    authorized: boolean;
};

export async function authenticate(apiToken: string, signal?: AbortSignal): Promise<boolean> {
    const response = await fetch(new URL("/auth", getApiUrl()), {
        body: JSON.stringify({api_token: apiToken}),
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        signal,
    });

    if (!response.ok) {
        throw new Error(`Backend 回應 ${response.status}`);
    }

    const payload = (await response.json()) as AuthResponse;

    return payload.authorized;
}

export async function fetchScreenerRows(filters: ScreenerFilters, search: string, apiToken: string, signal: AbortSignal): Promise<{count: number; data: StockRow[]}> {
    const url = new URL("/screener", getApiUrl());
    const normalizedSearch = search.trim();

    url.searchParams.set("api_token", apiToken);
    url.searchParams.set("sector", filters.sector);
    url.searchParams.set("market_cap", filters.marketCap);
    url.searchParams.set("order", filters.order);
    url.searchParams.set("ascend", String(filters.ascend));

    if (normalizedSearch.length > 0) {
        url.searchParams.set("search", normalizedSearch);
    }

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
        fundamental: {
            marketCap: row.fundamental.market_cap,
            forwardPe: row.fundamental.forward_pe,
            peg: row.fundamental.peg,
            ps: row.fundamental.ps,
            epsPast5y: row.fundamental.eps_past_5y,
            salesPast5y: row.fundamental.sales_past_5y,
            roe: row.fundamental.roe,
            profitMargin: row.fundamental.profit_margin,
            debtEquity: row.fundamental.debt_equity,
            marketCapScore: row.fundamental.market_cap_score,
            forwardPeScore: row.fundamental.forward_pe_score,
            pegScore: row.fundamental.peg_score,
            psScore: row.fundamental.ps_score,
            epsPast5yScore: row.fundamental.eps_past_5y_score,
            salesPast5yScore: row.fundamental.sales_past_5y_score,
            roeScore: row.fundamental.roe_score,
            profitMarginScore: row.fundamental.profit_margin_score,
            debtEquityScore: row.fundamental.debt_equity_score,
            score: row.fundamental.fundamental_score,
        },
        fundamentalScore: row.fundamental.fundamental_score,
        technical: {
            longTermScore: row.technical.long_term_score,
            midTermScore: row.technical.mid_term_score,
            score: row.technical.technical_score,
            shortTermScore: row.technical.short_term_score,
        },
        technicalScore: row.technical.technical_score,
        totalScore: row.total_score,
    };
}
