import React from "react";
import {Button, Tooltip} from "@heroui/react";
import classNames from "classnames";
import {Star} from "lucide-react";

interface Props {
    isWatched: boolean;
    tooltipPlacement?: "top" | "bottom" | "left" | "right";
    onPress(): void;
}

export const WatchlistButton = React.memo<Props>(({isWatched, tooltipPlacement, onPress}) => {
    const label = isWatched ? "從觀察名單移除" : "加入觀察名單";

    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    const button = (
        <Button aria-label={label} className="h-8 w-8 shrink-0 rounded-lg px-0" size="sm" variant="ghost" onClick={handleClick} onPress={onPress}>
            <Star className={classNames("size-4", {"fill-yellow-400 text-yellow-400": isWatched, "text-neutral-400": !isWatched})} />
        </Button>
    );

    if (!tooltipPlacement) {
        return button;
    }

    return (
        <Tooltip delay={0}>
            {button}
            <Tooltip.Content showArrow placement={tooltipPlacement}>
                <Tooltip.Arrow />
                {label}
            </Tooltip.Content>
        </Tooltip>
    );
});
