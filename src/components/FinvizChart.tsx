import React from "react";

interface Props {
    className?: string;
    ticker: string;
}

export const FinvizChart = React.memo<Props>(({className, ticker}) => {
    return <img alt={`${ticker} stock chart`} className={buildClassName(className)} src={getFinvizChartUrl(ticker)} />;
});

function buildClassName(className: string | undefined): string {
    const baseClassName = "w-full rounded-md bg-neutral-100 object-contain dark:bg-neutral-800 dark:[filter:invert(1)_hue-rotate(180deg)]";

    if (!className) {
        return baseClassName;
    }

    return `${baseClassName} ${className}`;
}

function getFinvizChartUrl(ticker: string): string {
    return `https://charts2.finviz.com/chart.ashx?t=${encodeURIComponent(ticker.toLowerCase())}&ty=c&ta=0&p=d&s=l`;
}
