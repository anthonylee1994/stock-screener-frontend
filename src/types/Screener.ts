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

export type MarketCapFilter = "+mid" | "mid" | "large" | "mega";

export type OrderFilter = "market_cap" | "fundamental_score" | "technical_score" | "total_score" | "volume";

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
    epsPast5Y: number;
    epsPast5YScore: number;
    forwardPe: number;
    forwardPeScore: number;
    marketCap: number;
    marketCapScore: number;
    peg: number;
    pegScore: number;
    roe: number;
    roeScore: number;
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
        fundamental_score: number;
        market_cap: number;
        forward_pe: number;
        peg: number;
        eps_past_5y: number;
        roe: number;
        market_cap_score: number;
        forward_pe_score: number;
        peg_score: number;
        eps_past_5y_score: number;
        roe_score: number;
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
      }
    | {
          error: string;
      };
