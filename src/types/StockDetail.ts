import type {StockRow} from "./Screener";

export type DetailKind = "fundamental" | "technical";

export interface DetailModalState {
    kind: DetailKind;
    row: StockRow;
}
