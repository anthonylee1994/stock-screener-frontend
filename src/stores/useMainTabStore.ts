import {create} from "zustand";

export type MainTab = "all" | "watchlist";

interface MainTabStore {
    activeTab: MainTab;
    setActiveTab(activeTab: MainTab): void;
}

export const useMainTabStore = create<MainTabStore>()(set => {
    return {
        activeTab: "all",
        setActiveTab(activeTab: MainTab) {
            set({activeTab});
        },
    };
});
