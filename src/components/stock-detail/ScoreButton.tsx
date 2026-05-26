import React from "react";
import {Button} from "@heroui/react";
import {format} from "@/utils/format";
import {scoreStyle} from "@/utils/scoreStyle";

interface Props {
    score: number;
    onPress: () => void;
}

export const ScoreButton = React.memo<Props>(({score, onPress}) => {
    return (
        <Button className={scoreStyle.getScoreClassName(score, "button")} size="sm" variant="ghost" onPress={onPress}>
            {format.formatScore(score)}
        </Button>
    );
});
