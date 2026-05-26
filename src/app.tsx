import React from "react";
import {Navigate, Route, Routes, useLocation} from "react-router";
import {AuthTokenRedirect} from "@/components/app/AuthTokenRedirect";
import {MaintenancePage} from "@/components/app/MaintenancePage";
import {useThemeClassName} from "@/hooks/useThemeClassName";
import {AuthPage} from "@/pages/AuthPage";
import {ScreenerPage} from "@/pages/ScreenerPage";
import {useAuthStore} from "@/stores/useAuthStore";
import {appRoutes} from "@/utils/appRoutes";

const maintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === "1";

export const App = React.memo(() => {
    const apiToken = useAuthStore(state => state.apiToken);
    const authenticateWithToken = useAuthStore(state => state.authenticateWithToken);
    const location = useLocation();
    const authToken = appRoutes.getAuthToken(location.search);
    const authTokenRedirectPath = appRoutes.getAuthTokenRedirectPath(location);
    const authTokenLoginPath = appRoutes.getAuthTokenLoginPath(location);

    useThemeClassName();

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
                <Route element={<Navigate replace state={{returnPath: appRoutes.getReturnPath(location)}} to="/login" />} path="*" />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route element={<Navigate replace to={appRoutes.getLoginRedirectPath(location)} />} path="/login" />
            <Route element={<Navigate replace to="/" />} path="/maintenance" />
            <Route element={<ScreenerPage />} path="/" />
            <Route element={<ScreenerPage />} path="/:ticker" />
            <Route element={<ScreenerPage />} path="/:ticker/:detailKind" />
            <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
    );
});
