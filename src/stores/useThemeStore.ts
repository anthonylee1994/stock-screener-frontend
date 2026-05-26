import {create} from "zustand";
import {screenerPreferences} from "@/utils/screenerPreferences";

interface ThemeStore {
    isDarkMode: boolean;
    toggleDarkMode(): void;
}

export const useThemeStore = create<ThemeStore>()(set => {
    return {
        isDarkMode: screenerPreferences.getInitialDarkMode(),
        toggleDarkMode() {
            set(state => {
                const isDarkMode = !state.isDarkMode;

                screenerPreferences.saveDarkMode(isDarkMode);

                return {isDarkMode};
            });
        },
    };
});
