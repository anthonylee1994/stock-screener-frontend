const currencyFormatter = new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 2,
    notation: "compact",
    style: "currency",
});

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    notation: "compact",
});

function formatCurrency(value: number): string {
    return currencyFormatter.format(value);
}

function formatCompactCurrency(value: number): string {
    return compactCurrencyFormatter.format(value);
}

function formatPercent(value: number, withSign: boolean = true): string {
    const sign = withSign && value > 0 ? "+" : "";

    return `${sign}${(value * 100).toFixed(2)}%`;
}

function formatScore(value: number): string {
    return value?.toFixed(2);
}

function formatVolume(value: number): string {
    return compactNumberFormatter.format(value);
}

export const FormatUtil = Object.freeze({
    formatCurrency,
    formatCompactCurrency,
    formatPercent,
    formatScore,
    formatVolume,
});
