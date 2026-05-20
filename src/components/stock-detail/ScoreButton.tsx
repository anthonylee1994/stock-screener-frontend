import React from "react";
import {Button} from "@heroui/react";
import {formatScore} from "../../utils/Format";
import {getScoreClassName} from "../../utils/ScoreStyle";

interface Props {
    score: number;
    onPress: () => void;
}

export const ScoreButton = React.memo<Props>(({score, onPress}) => {
    return (
        <Button className={getScoreClassName(score, "button")} size="sm" variant="ghost" onPress={onPress}>
            {formatScore(score)}
        </Button>
    );
});
