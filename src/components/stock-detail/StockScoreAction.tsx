import React from "react";
import {formatScore} from "@/utils/Format";
import {getScoreClassName} from "@/utils/ScoreStyle";

interface Props {
    label: string;
    score: number;
    onPress: () => void;
}

export const StockScoreAction = React.memo<Props>(({label, score, onPress}) => {
    return (
        <button
            className="flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-3 text-left active:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:active:bg-neutral-800/30"
            type="button"
            onClick={onPress}
        >
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">{label}</span>
            <span className={getScoreClassName(score, "mobilePill")}>{formatScore(score)}</span>
        </button>
    );
});
