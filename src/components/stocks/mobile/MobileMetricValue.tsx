import React from "react";
import type {SortDescriptor} from "@heroui/react";
import classNames from "classnames";
import type {StockRow} from "@/types/screener";
import {FormatUtil} from "@/utils/FormatUtil";
import {ScoreStyleUtil} from "@/utils/ScoreStyleUtil";

interface Props {
    row: StockRow;
    sortDescriptor: SortDescriptor;
}

export const MobileMetricValue = React.memo<Props>(({row, sortDescriptor}) => {
    const column = String(sortDescriptor.column);

    if (column === "market_cap") {
        return <span className="text-[13px] font-semibold leading-5 text-neutral-800 dark:text-neutral-200">{FormatUtil.formatCompactCurrency(row.marketCap)}</span>;
    }

    if (column === "volume") {
        return <span className="text-[13px] font-semibold leading-5 text-neutral-800 dark:text-neutral-200">{FormatUtil.formatVolume(row.volume)}</span>;
    }

    if (column === "change_percent") {
        return (
            <span
                className={classNames("text-[13px] font-semibold leading-5", {
                    "text-emerald-600 dark:text-emerald-400": row.changePercent >= 0,
                    "text-red-500 dark:text-red-400": row.changePercent < 0,
                })}
            >
                {FormatUtil.formatPercent(row.changePercent)}
            </span>
        );
    }

    if (column === "fundamental_score") {
        return <span className={ScoreStyleUtil.getScoreClassName(row.fundamentalScore, "mobilePill")}>{FormatUtil.formatScore(row.fundamentalScore)}</span>;
    }

    if (column === "technical_score") {
        return <span className={ScoreStyleUtil.getScoreClassName(row.technicalScore, "mobilePill")}>{FormatUtil.formatScore(row.technicalScore)}</span>;
    }

    return <span className={ScoreStyleUtil.getScoreClassName(row.totalScore, "mobilePill")}>{FormatUtil.formatScore(row.totalScore)}</span>;
});
