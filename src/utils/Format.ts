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

export function formatCurrency(value: number): string {
    return currencyFormatter.format(value);
}

export function formatCompactCurrency(value: number): string {
    return compactCurrencyFormatter.format(value);
}

export function formatPercent(value: number): string {
    const normalizedValue = Math.abs(value) > 1 ? value / 100 : value;
    const sign = normalizedValue > 0 ? "+" : "";

    return `${sign}${(normalizedValue * 100).toFixed(2)}%`;
}

export function formatScore(value: number): string {
    return value.toFixed(1);
}

export function formatVolume(value: number): string {
    return compactNumberFormatter.format(value);
}
