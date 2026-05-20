import React from "react";
import {Navigate, Route, Routes, useLocation} from "react-router";
import type {Location} from "react-router";
import {MaintenancePage} from "./components/MaintenancePage";
import {AuthPage} from "./pages/AuthPage";
import {ScreenerPage} from "./pages/ScreenerPage";
import {useAuthStore} from "./stores/useAuthStore";
import {useScreenerStore} from "./stores/useScreenerStore";

const maintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === "1";

interface RouteState {
    returnPath?: string;
}

export const App = React.memo(() => {
    const apiToken = useAuthStore(state => state.apiToken);
    const isDarkMode = useScreenerStore(state => state.isDarkMode);
    const location = useLocation();

    React.useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);

    if (maintenanceMode) {
        return (
            <Routes>
                <Route element={<MaintenancePage />} path="/maintenance" />
                <Route element={<Navigate replace to="/maintenance" />} path="*" />
            </Routes>
        );
    }

    if (apiToken.length === 0) {
        return (
            <Routes>
                <Route element={<AuthPage />} path="/login" />
                <Route element={<Navigate replace state={{returnPath: getReturnPath(location)}} to="/login" />} path="*" />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route element={<Navigate replace to={getLoginRedirectPath(location)} />} path="/login" />
            <Route element={<Navigate replace to="/" />} path="/maintenance" />
            <Route element={<ScreenerPage />} path="/" />
            <Route element={<ScreenerPage />} path="/:ticker" />
            <Route element={<ScreenerPage />} path="/:ticker/:detailKind" />
            <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
    );
});

function getReturnPath(location: Location): string | undefined {
    const pathname = location.pathname;

    if (pathname === "/login" || pathname === "/maintenance") {
        return undefined;
    }

    return `${pathname}${location.search}${location.hash}`;
}

function getLoginRedirectPath(location: Location): string {
    const state = location.state as RouteState | null;

    return state?.returnPath ?? "/";
}
