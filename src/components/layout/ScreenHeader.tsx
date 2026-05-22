import React from "react";
import {Button, Chip, Tooltip} from "@heroui/react";
import {LogOut} from "lucide-react";
import {ThemeToggleButton} from "./ThemeToggleButton";
import {useAuthStore} from "../../stores/useAuthStore";
import {useScreenerStore} from "../../stores/useScreenerStore";

export const ScreenHeader = React.memo(() => {
    const clearRows = useScreenerStore(state => state.clearRows);
    const isDarkMode = useScreenerStore(state => state.isDarkMode);
    const rows = useScreenerStore(state => state.rows);
    const toggleDarkMode = useScreenerStore(state => state.toggleDarkMode);
    const logout = useAuthStore(state => state.logout);

    const handleLogout = () => {
        logout();
        clearRows();
    };

    return (
        <header className="flex flex-row items-center justify-between gap-3 md:px-3">
            <div className="flex items-center justify-end gap-2">
                <h1 className="text-2xl font-semibold tracking-normal text-neutral-950 dark:text-neutral-100">美股選股器</h1>
                <Chip>共 {rows.length} 隻股票</Chip>
            </div>
            <div className="flex items-center gap-1.5">
                <ThemeToggleButton isDarkMode={isDarkMode} onPress={toggleDarkMode} />
                <Tooltip delay={0}>
                    <Button aria-label="登出" className="h-9 w-9 rounded-lg px-0" size="sm" variant="ghost" onPress={handleLogout}>
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
