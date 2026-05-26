import React from "react";
import {Button, Chip, Tooltip} from "@heroui/react";
import {LogOut} from "lucide-react";
import {ThemeToggleButton} from "@/components/layout/ThemeToggleButton";
import {useScreenHeaderController} from "@/hooks/useScreenHeaderController";

export const ScreenHeader = React.memo(() => {
    const {isDarkMode, isLoading, stockCount, handleLogout, toggleDarkMode} = useScreenHeaderController();

    return (
        <header className="flex flex-row items-center justify-between gap-3 mb-5">
            <div className="flex items-center justify-end gap-2">
                <h1 className="text-2xl font-semibold tracking-normal text-neutral-950 dark:text-neutral-100">美股選股器</h1>
                <Chip>{isLoading ? "載入中..." : `共 ${stockCount} 隻股票`}</Chip>
            </div>
            <div className="flex items-center gap-1.5">
                <ThemeToggleButton isDarkMode={isDarkMode} onPress={toggleDarkMode} />
                <Tooltip delay={0}>
                    <Button aria-label="登出" className="h-9 w-9 rounded-full px-0" size="sm" variant="ghost" onPress={handleLogout}>
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
