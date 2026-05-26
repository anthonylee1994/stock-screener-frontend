const authTokenStorageKey = "stock-screener-api-token";

function getInitialApiToken(): string {
    return window.localStorage.getItem(authTokenStorageKey) ?? "";
}

function saveApiToken(apiToken: string): void {
    window.localStorage.setItem(authTokenStorageKey, apiToken);
}

function clearApiToken(): void {
    window.localStorage.removeItem(authTokenStorageKey);
}

export const authTokenPreferences = {
    getInitialApiToken,
    saveApiToken,
    clearApiToken,
};
