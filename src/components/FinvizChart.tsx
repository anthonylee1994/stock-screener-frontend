import React from "react";

interface Props {
    className?: string;
    ticker: string;
}

export const FinvizChart = React.memo<Props>(({className, ticker}) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const chartUrl = getFinvizChartUrl(ticker);

    React.useEffect(() => {
        setIsLoading(true);
    }, [chartUrl]);

    return (
        <div className={buildContainerClassName(className, isLoading)}>
            <img alt={`${ticker} stock chart`} className={buildImageClassName(isLoading)} src={chartUrl} onError={() => setIsLoading(false)} onLoad={() => setIsLoading(false)} />
        </div>
    );
});

function buildContainerClassName(className: string | undefined, loading: boolean): string {
    const baseClassName = `relative aspect-[13/6] w-full overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800 ${loading ? "skeleton--shimmer" : ""}`;

    if (!className) {
        return baseClassName;
    }

    return `${baseClassName} ${className}`;
}

function buildImageClassName(isLoading: boolean): string {
    const visibilityClassName = isLoading ? "opacity-0" : "opacity-100";

    return `h-full w-full object-fill transition-opacity dark:[filter:invert(1)_hue-rotate(180deg)] ${visibilityClassName}`;
}

function getFinvizChartUrl(ticker: string): string {
    return `https://charts2.finviz.com/chart.ashx?t=${encodeURIComponent(ticker.toLowerCase())}&ty=c&ta=0&p=d&s=l`;
}
