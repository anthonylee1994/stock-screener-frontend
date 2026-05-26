import type {Location} from "react-router";

interface RouteState {
    returnPath?: string;
}

export function getReturnPath(location: Location): string | undefined {
    const pathname = location.pathname;

    if (pathname === "/login" || pathname === "/maintenance") {
        return undefined;
    }

    return `${pathname}${location.search}${location.hash}`;
}

export function getLoginRedirectPath(location: Location): string {
    const state = location.state as RouteState | null;

    return state?.returnPath ?? "/";
}

export function getAuthToken(search: string): string | null {
    return new URLSearchParams(search).get("authToken");
}

export function getAuthTokenRedirectPath(location: Location): string {
    const searchParams = new URLSearchParams(location.search);

    searchParams.delete("authToken");

    const search = searchParams.toString();

    return `${location.pathname}${search ? `?${search}` : ""}${location.hash}`;
}

export function getAuthTokenLoginPath(location: Location): string {
    const searchParams = new URLSearchParams(location.search);

    searchParams.delete("authToken");

    const search = searchParams.toString();

    return `/login${search ? `?${search}` : ""}${location.hash}`;
}
