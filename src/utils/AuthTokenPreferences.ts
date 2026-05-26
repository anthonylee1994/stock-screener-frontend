const authTokenStorageKey = "stock-screener-api-token";

export function getInitialApiToken(): string {
    return window.localStorage.getItem(authTokenStorageKey) ?? "";
}

export function saveApiToken(apiToken: string): void {
    window.localStorage.setItem(authTokenStorageKey, apiToken);
}

export function clearApiToken(): void {
    window.localStorage.removeItem(authTokenStorageKey);
}
