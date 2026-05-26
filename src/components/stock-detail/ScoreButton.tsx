import React from "react";
import {Button} from "@heroui/react";
import {FormatUtil} from "@/utils/FormatUtil";
import {ScoreStyleUtil} from "@/utils/ScoreStyleUtil";

interface Props {
    score: number;
    onPress: () => void;
}

export const ScoreButton = React.memo<Props>(({score, onPress}) => {
    return (
        <Button className={ScoreStyleUtil.getScoreClassName(score, "button")} size="sm" variant="ghost" onPress={onPress}>
            {FormatUtil.formatScore(score)}
        </Button>
    );
});
