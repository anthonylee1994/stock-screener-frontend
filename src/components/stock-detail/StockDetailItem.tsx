import React from "react";

interface Props {
    label: string;
    value: string;
}

export const StockDetailItem = React.memo<Props>(({label, value}) => {
    return (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</p>
            <p className="mt-1 text-base font-semibold text-neutral-950 dark:text-neutral-100">{value}</p>
        </div>
    );
});
