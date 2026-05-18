import React from "react";
import {Button, Tooltip} from "@heroui/react";
import {Moon, Sun} from "lucide-react";

interface Props {
    isDarkMode: boolean;
    onPress: () => void;
}

export const ThemeToggleButton = React.memo<Props>(({isDarkMode, onPress}) => {
    return (
        <Tooltip delay={0}>
            <Button aria-label={isDarkMode ? "切換至淺色模式" : "切換至深色模式"} className="h-9 w-9 rounded-lg px-0" size="sm" variant="ghost" onPress={onPress}>
                {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Tooltip.Content showArrow placement="bottom">
                <Tooltip.Arrow />
                {isDarkMode ? "淺色模式" : "深色模式"}
            </Tooltip.Content>
        </Tooltip>
    );
});
