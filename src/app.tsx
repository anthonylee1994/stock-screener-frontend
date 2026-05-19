import React from "react";
import {MaintenancePage} from "./components/MaintenancePage";
import {AuthPage} from "./pages/AuthPage";
import {ScreenerPage} from "./pages/ScreenerPage";
import {useAuthStore} from "./stores/useAuthStore";
import {useScreenerStore} from "./stores/useScreenerStore";

const maintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === "1";

export const App = React.memo(() => {
    const apiToken = useAuthStore(state => state.apiToken);
    const isDarkMode = useScreenerStore(state => state.isDarkMode);

    React.useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);

    if (maintenanceMode) {
        return <MaintenancePage />;
    }

    if (apiToken.length === 0) {
        return <AuthPage />;
    }

    return <ScreenerPage />;
});
