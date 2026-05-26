import {create} from "zustand";
import {ScreenerUtil} from "@/utils/ScreenerUtil";

interface ThemeStore {
    isDarkMode: boolean;
    toggleDarkMode(): void;
}

export const useThemeStore = create<ThemeStore>()(set => {
    return {
        isDarkMode: ScreenerUtil.getInitialDarkMode(),
        toggleDarkMode() {
            set(state => {
                const isDarkMode = !state.isDarkMode;

                ScreenerUtil.saveDarkMode(isDarkMode);

                return {isDarkMode};
            });
        },
    };
});
