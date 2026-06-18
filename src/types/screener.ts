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

export type OrderFilter = "change_percent" | "fundamental_score" | "market_cap" | "target_price_upside" | "technical_score" | "total_score" | "volume";

export interface ScreenerFilters {
    ascend: boolean;
    marketCap: MarketCapFilter;
    order: OrderFilter;
    potentialStock: boolean;
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
    targetPrice: number | null;
    high52w: number | null;
    shortInterest: number | null;
    epsPast5y: number | null;
    epsQuarterOverQuarter: number | null;
    salesPast5y: number | null;
    salesQuarterOverQuarter: number | null;
    roe: number | null;
    roic: number | null;
    grossMargin: number | null;
    operatingMargin: number | null;
    profitMargin: number | null;
    debtEquity: number | null;
    potentialStock: boolean;
    debtEquityScore: number;
    epsPast5yScore: number;
    forwardPeScore: number;
    fundamentalScore: number;
    grossMarginScore: number;
    marketCapScore: number;
    pegScore: number;
    pfcfScore: number;
    profitMarginScore: number;
    psScore: number;
    roeScore: number;
    roicScore: number;
    salesPast5yScore: number;
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
        debt_equity: number | null;
        debt_equity_score: number;
        eps_past_5y: number | null;
        eps_past_5y_score: number;
        eps_quarter_over_quarter: number | null;
        forward_pe: number | null;
        forward_pe_score: number;
        fundamental_score: number;
        gross_margin: number | null;
        gross_margin_score: number;
        high_52w: number | null;
        market_cap: number | null;
        market_cap_score: number;
        operating_margin: number | null;
        peg: number | null;
        peg_score: number;
        pfcf: number | null;
        pfcf_score: number;
        potential_stock: number | null;
        profit_margin: number | null;
        profit_margin_score: number;
        ps: number | null;
        ps_score: number;
        roe: number | null;
        roe_score: number;
        roic: number | null;
        roic_score: number;
        sales_past_5y: number | null;
        sales_past_5y_score: number;
        sales_quarter_over_quarter: number | null;
        short_interest: number | null;
        sma200: number | null;
        target_price: number | null;
        target_price_upside: number | null;
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
