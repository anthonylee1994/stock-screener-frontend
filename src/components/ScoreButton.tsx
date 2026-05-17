import React from "react";
import {Button} from "@heroui/react";
import {formatScore} from "../utils/Format";
import {getScoreClassName} from "../utils/ScoreStyle";

type ScoreButtonProps = {
    score: number;
    onPress: () => void;
};

export const ScoreButton = React.memo((props: ScoreButtonProps) => {
    const {score, onPress} = props;

    return (
        <Button className={getScoreClassName(score, "button")} size="sm" variant="ghost" onPress={onPress}>
            {formatScore(score)}
        </Button>
    );
});
