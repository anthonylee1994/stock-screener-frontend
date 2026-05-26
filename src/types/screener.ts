export type SectorFilter =
    | "All"
    | "Basic Materials"
    | "Communication Services"
    | "Consumer Cyclical"
    | "Consumer Defensive"
    | "Energy"
    | "Financial"
    | "Healthcare"
    | "Industrials"
    | "Real Estate"
    | "Technology"
    | "Utilities";

export type MarketCapFilter = "+mid" | "+large" | "mid" | "large" | "mega";

export type OrderFilter = "change_percent" | "market_cap" | "fundamental_score" | "technical_score" | "total_score" | "volume";

export interface ScreenerFilters {
    ascend: boolean;
    marketCap: MarketCapFilter;
    order: OrderFilter;
    sector: SectorFilter;
}

export interface StockRow {
    change: number;
    changePercent: number;
    fundamental: StockFundamentalDetail;
    fundamentalScore: number;
    marketCap: number;
    name: string;
    price: number;
    sector: string;
    technical: StockTechnicalDetail;
    technicalScore: number;
    ticker: string;
    totalScore: number;
    volume: number;
}

export interface StockFundamentalDetail {
    marketCap: number | null;
    forwardPe: number | null;
    peg: number | null;
    ps: number | null;
    pfcf: number | null;
    epsPast5y: number | null;
    salesPast5y: number | null;
    roe: number | null;
    roic: number | null;
    profitMargin: number | null;
    debtEquity: number | null;
    marketCapScore: number;
    forwardPeScore: number;
    pegScore: number;
    psScore: number;
    pfcfScore: number;
    epsPast5yScore: number;
    salesPast5yScore: number;
    roeScore: number;
    roicScore: number;
    profitMarginScore: number;
    debtEquityScore: number;
    score: number;
}

export interface StockTechnicalDetail {
    shortTermScore: number;
    midTermScore: number;
    longTermScore: number;
    score: number;
}

export type ScreenerApiRow = {
    ticker: string;
    name: string;
    volume: number;
    market_cap: number;
    price: number;
    sector: string;
    change: number;
    change_percent: number;
    total_score: number;
    fundamental: {
        market_cap: number | null;
        forward_pe: number | null;
        peg: number | null;
        ps: number | null;
        pfcf: number | null;
        eps_past_5y: number | null;
        sales_past_5y: number | null;
        roe: number | null;
        roic: number | null;
        profit_margin: number | null;
        debt_equity: number | null;
        market_cap_score: number;
        forward_pe_score: number;
        peg_score: number;
        ps_score: number;
        pfcf_score: number;
        eps_past_5y_score: number;
        sales_past_5y_score: number;
        roe_score: number;
        roic_score: number;
        profit_margin_score: number;
        debt_equity_score: number;
        fundamental_score: number;
    };
    technical: {
        long_term_score: number;
        mid_term_score: number;
        short_term_score: number;
        technical_score: number;
    };
};

export type ScreenerApiResponse =
    | {
          count: number;
          data: ScreenerApiRow[];
          has_more: boolean;
          limit: number;
          next_offset: number | null;
          offset: number;
      }
    | {
          error: string;
      };

export interface ScreenerRowsResponse {
    count: number;
    data: StockRow[];
    hasMore: boolean;
    limit: number;
    nextOffset: number | null;
    offset: number;
}
