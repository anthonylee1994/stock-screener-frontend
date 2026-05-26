import type {StockRow} from "@/types/screener";

export type DetailKind = "fundamental" | "technical";

export interface DetailModalState {
    kind: DetailKind;
    row: StockRow;
}
