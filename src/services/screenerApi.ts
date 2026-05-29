import type {ScreenerApiResponse, ScreenerApiRow, ScreenerFilters, ScreenerRowsResponse, StockRow} from "@/types/screener";

type AuthResponse = {
    authorized: boolean;
};

interface FetchScreenerRowsOptions {
    apiToken: string;
    filters: ScreenerFilters;
    limit?: number;
    offset?: number;
    search?: string;
    signal: AbortSignal;
    tickers?: string[];
}

async function authenticate(apiToken: string, signal?: AbortSignal): Promise<boolean> {
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

async function fetchScreenerRows(options: FetchScreenerRowsOptions): Promise<ScreenerRowsResponse> {
    const url = new URL("/screener", getApiUrl());
    const normalizedSearch = options.search?.trim() ?? "";
    const normalizedTickers = normalizeTickers(options.tickers ?? []);

    url.searchParams.set("api_token", options.apiToken);
    url.searchParams.set("order", options.filters.order);
    url.searchParams.set("ascend", String(options.filters.ascend));
    url.searchParams.set("potential_stock", String(options.filters.potentialStock));

    if (options.limit !== undefined) {
        url.searchParams.set("limit", String(options.limit));
    }

    if (options.offset !== undefined) {
        url.searchParams.set("offset", String(options.offset));
    }

    if (normalizedTickers.length > 0) {
        url.searchParams.set("tickers", normalizedTickers.join(","));
    } else {
        url.searchParams.set("sector", options.filters.sector);
        url.searchParams.set("market_cap", options.filters.marketCap);
    }

    if (normalizedTickers.length === 0 && normalizedSearch.length > 0) {
        url.searchParams.set("search", normalizedSearch);
    }

    const response = await fetch(url, {signal: options.signal});

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
        hasMore: payload.has_more,
        limit: payload.limit,
        nextOffset: payload.next_offset,
        offset: payload.offset,
    };
}

function normalizeTickers(tickers: string[]): string[] {
    return Array.from(new Set(tickers.map(ticker => ticker.trim().toUpperCase()).filter(ticker => ticker.length > 0)));
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
            pfcf: row.fundamental.pfcf,
            epsPast5y: row.fundamental.eps_past_5y,
            salesPast5y: row.fundamental.sales_past_5y,
            roe: row.fundamental.roe,
            roic: row.fundamental.roic,
            profitMargin: row.fundamental.profit_margin,
            debtEquity: row.fundamental.debt_equity,
            marketCapScore: row.fundamental.market_cap_score,
            forwardPeScore: row.fundamental.forward_pe_score,
            pegScore: row.fundamental.peg_score,
            psScore: row.fundamental.ps_score,
            pfcfScore: row.fundamental.pfcf_score,
            epsPast5yScore: row.fundamental.eps_past_5y_score,
            salesPast5yScore: row.fundamental.sales_past_5y_score,
            roeScore: row.fundamental.roe_score,
            roicScore: row.fundamental.roic_score,
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

export const screenerApi = {
    authenticate,
    fetchScreenerRows,
};
