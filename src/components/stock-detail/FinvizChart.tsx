import React from "react";
import classNames from "classnames";

interface Props {
    className?: string;
    ticker: string;
}

export const FinvizChart = React.memo<Props>(({className, ticker}) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const chartUrl = getFinvizChartUrl(ticker);

    const onClick = () => {
        window.open(`https://finviz.com/stock?t=${ticker}`, "_blank");
    };

    React.useEffect(() => {
        setIsLoading(true);
    }, [chartUrl]);

    return (
        <div className={buildContainerClassName(className, isLoading)}>
            <img alt={`${ticker} stock chart`} className={buildImageClassName(isLoading)} src={chartUrl} onClick={onClick} onError={() => setIsLoading(false)} onLoad={() => setIsLoading(false)} />
        </div>
    );
});

function buildContainerClassName(className: string | undefined, isLoading: boolean): string {
    return classNames("relative aspect-[13/6] w-full overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-900", {"skeleton--shimmer": isLoading}, className);
}

function buildImageClassName(isLoading: boolean): string {
    return classNames("h-full w-full object-fill transition-opacity dark:[filter:invert(1)_hue-rotate(180deg)] cursor-pointer", {
        "opacity-0": isLoading,
        "opacity-100": !isLoading,
    });
}

function getFinvizChartUrl(ticker: string): string {
    return `https://charts2.finviz.com/chart.ashx?t=${encodeURIComponent(ticker.toLowerCase())}&ty=c&ta=0&p=d&s=l`;
}
