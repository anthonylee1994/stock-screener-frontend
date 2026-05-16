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
    change: number;
    change_percent: number;
    fundamental: {
        fundamental_score: number;
    };
    market_cap: number;
    name: string;
    price: number;
    sector: string;
    technical: {
        technical_score: number;
    };
    ticker: string;
    total_score: number;
    volume: number;
};

export type ScreenerApiResponse =
    | {
          count: number;
          data: ScreenerApiRow[];
      }
    | {
          error: string;
      };
