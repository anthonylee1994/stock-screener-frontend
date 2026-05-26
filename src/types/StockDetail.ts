import type {StockRow} from "@/types/Screener";

export type DetailKind = "fundamental" | "technical";

export interface DetailModalState {
    kind: DetailKind;
    row: StockRow;
}
