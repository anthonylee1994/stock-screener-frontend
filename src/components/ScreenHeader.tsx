import React from "react";
import {Button, Chip, Tooltip} from "@heroui/react";
import {LogOut} from "lucide-react";
import {ThemeToggleButton} from "./ThemeToggleButton";

interface Props {
    count: number;
    isDarkMode: boolean;
    onDarkModeToggle: () => void;
    onLogout: () => void;
}

export const ScreenHeader = React.memo<Props>(({count, isDarkMode, onDarkModeToggle, onLogout}) => {
    return (
        <header className="flex flex-row items-center justify-between gap-3 border-b border-neutral-200 pb-5 md:px-3 dark:border-neutral-800">
            <div className="flex items-center justify-end gap-2">
                <h1 className="text-2xl font-semibold tracking-normal text-neutral-950 dark:text-neutral-100">美股選股器</h1>
                <Chip>共 {count} 隻股票</Chip>
            </div>
            <div className="flex items-center gap-1.5">
                <ThemeToggleButton isDarkMode={isDarkMode} onPress={onDarkModeToggle} />
                <Tooltip delay={0}>
                    <Button aria-label="登出" className="h-9 w-9 rounded-lg px-0" size="sm" variant="ghost" onPress={onLogout}>
                        <LogOut className="size-4" />
                    </Button>
                    <Tooltip.Content showArrow placement="bottom">
                        <Tooltip.Arrow />
                        登出
                    </Tooltip.Content>
                </Tooltip>
            </div>
        </header>
    );
});
