import React from "react";
import {useThemeStore} from "@/stores/useThemeStore";

export function useThemeClassName(): void {
    const isDarkMode = useThemeStore(state => state.isDarkMode);

    React.useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);
}
