const watchlistStorageKey = "stock-screener-watchlist";

function getInitialWatchlistTickers(): string[] {
    const storedTickers = window.localStorage.getItem(watchlistStorageKey);

    if (!storedTickers) {
        return [];
    }

    try {
        return normalizeWatchlistTickers(JSON.parse(storedTickers));
    } catch {
        return [];
    }
}

function saveWatchlistTickers(tickers: string[]): void {
    window.localStorage.setItem(watchlistStorageKey, JSON.stringify(tickers));
}

function normalizeWatchlistTicker(ticker: string): string {
    return ticker.trim().toUpperCase();
}

export const watchlistPreferences = {
    getInitialWatchlistTickers,
    saveWatchlistTickers,
    normalizeWatchlistTicker,
};

function normalizeWatchlistTickers(value: unknown): string[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return Array.from(new Set(value.map(item => normalizeWatchlistTicker(String(item))).filter(ticker => ticker.length > 0)));
}
