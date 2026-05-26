import React from "react";
import {Navigate, Route, Routes, useLocation} from "react-router";
import {AuthTokenRedirect} from "@/components/app/AuthTokenRedirect";
import {MaintenancePage} from "@/components/app/MaintenancePage";
import {AuthPage} from "@/pages/AuthPage";
import {ScreenerPage} from "@/pages/ScreenerPage";
import {useAuthStore} from "@/stores/useAuthStore";
import {useScreenerStore} from "@/stores/useScreenerStore";
import {getAuthToken, getAuthTokenLoginPath, getAuthTokenRedirectPath, getLoginRedirectPath, getReturnPath} from "@/utils/AppRoutes";

const maintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === "1";

export const App = React.memo(() => {
    const apiToken = useAuthStore(state => state.apiToken);
    const authenticateWithToken = useAuthStore(state => state.authenticateWithToken);
    const isDarkMode = useScreenerStore(state => state.isDarkMode);
    const location = useLocation();
    const authToken = getAuthToken(location.search);
    const authTokenRedirectPath = getAuthTokenRedirectPath(location);
    const authTokenLoginPath = getAuthTokenLoginPath(location);

    React.useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);

    if (authToken) {
        return (
            <Routes>
                <Route element={<AuthTokenRedirect authToken={authToken} loginPath={authTokenLoginPath} redirectPath={authTokenRedirectPath} onAuthenticate={authenticateWithToken} />} path="*" />
            </Routes>
        );
    }

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
