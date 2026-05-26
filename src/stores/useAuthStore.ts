import {create} from "zustand";
import {screenerApi} from "@/services/screenerApi";
import {AuthTokenUtil} from "@/utils/AuthTokenUtil";

interface AuthStore {
    apiToken: string;
    authError: string | null;
    authenticateWithToken(apiToken: string, signal: AbortSignal): Promise<boolean>;
    isAuthenticating: boolean;
    tokenInput: string;
    login(signal: AbortSignal): Promise<void>;
    logout(): void;
    setTokenInput(tokenInput: string): void;
}

export const useAuthStore = create<AuthStore>()((set, get) => {
    return {
        apiToken: AuthTokenUtil.getInitialApiToken(),
        authError: null,
        isAuthenticating: false,
        tokenInput: "",
        async authenticateWithToken(apiToken: string, signal: AbortSignal) {
            const nextApiToken = apiToken.trim();

            if (nextApiToken.length === 0) {
                set({authError: "請輸入密碼"});
                return false;
            }

            set({
                authError: null,
                isAuthenticating: true,
            });

            try {
                const authorized = await screenerApi.authenticate(nextApiToken, signal);

                if (!authorized) {
                    set({authError: "密碼唔正確"});
                    return false;
                }

                AuthTokenUtil.saveApiToken(nextApiToken);
                set({
                    apiToken: nextApiToken,
                    authError: null,
                    tokenInput: "",
                });

                return true;
            } catch (authFetchError) {
                if (signal.aborted) {
                    return false;
                }

                set({
                    authError: authFetchError instanceof Error ? authFetchError.message : "驗證失敗",
                });

                return false;
            } finally {
                if (!signal.aborted) {
                    set({isAuthenticating: false});
                }
            }
        },
        async login(signal: AbortSignal) {
            const nextApiToken = get().tokenInput.trim();

            if (nextApiToken.length === 0) {
                set({authError: "請輸入密碼"});
                return;
            }

            set({
                authError: null,
                isAuthenticating: true,
            });

            try {
                const authorized = await screenerApi.authenticate(nextApiToken, signal);

                if (!authorized) {
                    set({
                        authError: "密碼唔正確",
                        tokenInput: "",
                    });
                    return;
                }

                AuthTokenUtil.saveApiToken(nextApiToken);
                set({
                    apiToken: nextApiToken,
                    authError: null,
                    tokenInput: "",
                });
            } catch (authFetchError) {
                if (signal.aborted) {
                    return;
                }

                set({
                    authError: authFetchError instanceof Error ? authFetchError.message : "驗證失敗",
                    tokenInput: "",
                });
            } finally {
                if (!signal.aborted) {
                    set({isAuthenticating: false});
                }
            }
        },
        logout() {
            AuthTokenUtil.clearApiToken();
            set({
                apiToken: "",
                authError: null,
                tokenInput: "",
            });
        },
        setTokenInput(tokenInput: string) {
            set({tokenInput});
        },
    };
});
