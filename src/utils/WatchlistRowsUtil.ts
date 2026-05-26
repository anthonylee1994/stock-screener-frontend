import type {StockRow} from "@/types/screener";

function getWatchlistEmptyMessage(watchlistTickerCount: number, searchText: string): string {
    if (watchlistTickerCount === 0) {
        return "未加入任何股票";
    }

    if (searchText.trim().length > 0) {
        return "搵唔到符合條件嘅股票";
    }

    return "搵唔到觀察名單股票";
}

function getWatchlistSearchRows(rows: StockRow[], normalizedSearchText: string): StockRow[] {
    const tickerRows = rows.filter(row => row.ticker.toLowerCase().includes(normalizedSearchText));

    if (tickerRows.length > 0) {
        return tickerRows;
    }

    return rows.filter(row => row.name.toLowerCase().includes(normalizedSearchText));
}

export const WatchlistRowsUtil = Object.freeze({
    getWatchlistEmptyMessage,
    getWatchlistSearchRows,
});
