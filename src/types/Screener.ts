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

export type MarketCapFilter = "+mid" | "micro" | "small" | "mid" | "large" | "mega";

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
    fundamentalScore: number;
    marketCap: number;
    name: string;
    price: number;
    sector: string;
    technicalScore: number;
    ticker: string;
    totalScore: number;
    volume: number;
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
        ema_200_distance: number;
        roc_125: number;
        ema_50_distance: number;
        roc_20: number;
        ppo_slope_3: number;
        rsi14: number;
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
