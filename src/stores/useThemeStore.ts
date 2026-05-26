import {create} from "zustand";
import {getInitialDarkMode, saveDarkMode} from "@/utils/ScreenerPreferences";

interface ThemeStore {
    isDarkMode: boolean;
    toggleDarkMode(): void;
}

export const useThemeStore = create<ThemeStore>()(set => {
    return {
        isDarkMode: getInitialDarkMode(),
        toggleDarkMode() {
            set(state => {
                const isDarkMode = !state.isDarkMode;

                saveDarkMode(isDarkMode);

                return {isDarkMode};
            });
        },
    };
});
