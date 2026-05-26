import type {Location} from "react-router";

interface RouteState {
    returnPath?: string;
}

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

function getAuthToken(search: string): string | null {
    return new URLSearchParams(search).get("authToken");
}

function getAuthTokenRedirectPath(location: Location): string {
    const searchParams = new URLSearchParams(location.search);

    searchParams.delete("authToken");

    const search = searchParams.toString();

    return `${location.pathname}${search ? `?${search}` : ""}${location.hash}`;
}

function getAuthTokenLoginPath(location: Location): string {
    const searchParams = new URLSearchParams(location.search);

    searchParams.delete("authToken");

    const search = searchParams.toString();

    return `/login${search ? `?${search}` : ""}${location.hash}`;
}

export const appRoutes = {
    getReturnPath,
    getLoginRedirectPath,
    getAuthToken,
    getAuthTokenRedirectPath,
    getAuthTokenLoginPath,
};
