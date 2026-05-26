import {useAuthStore} from "@/stores/useAuthStore";
import {useMainTabStore} from "@/stores/useMainTabStore";
import {useScreenerStore} from "@/stores/useScreenerStore";
import {useThemeStore} from "@/stores/useThemeStore";
import {useWatchlistStore} from "@/stores/useWatchlistStore";

export function useScreenHeaderController() {
    const clearRows = useScreenerStore(state => state.clearRows);
    const isLoading = useScreenerStore(state => state.isLoading);
    const clearWatchlistRows = useWatchlistStore(state => state.clearRows);
    const isDarkMode = useThemeStore(state => state.isDarkMode);
    const totalCount = useScreenerStore(state => state.totalCount);
    const toggleDarkMode = useThemeStore(state => state.toggleDarkMode);
    const activeTab = useMainTabStore(state => state.activeTab);
    const watchlistTickers = useWatchlistStore(state => state.tickers);
    const logout = useAuthStore(state => state.logout);
    const stockCount = activeTab === "watchlist" ? watchlistTickers.length : totalCount;

    function handleLogout(): void {
        logout();
        clearRows();
        clearWatchlistRows();
    }

    return {
        isDarkMode,
        isLoading,
        stockCount,
        handleLogout,
        toggleDarkMode,
    };
}
