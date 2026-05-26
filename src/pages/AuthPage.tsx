import React from "react";
import {Button, Form, InputGroup, Label} from "@heroui/react";
import {Eye, EyeOff, KeyRound} from "lucide-react";
import {useLocation, useNavigate} from "react-router";
import {ThemeToggleButton} from "@/components/layout/ThemeToggleButton";
import {useAuthStore} from "@/stores/useAuthStore";
import {useScreenerStore} from "@/stores/useScreenerStore";

interface LocationState {
    returnPath?: string;
}

export const AuthPage = React.memo(() => {
    const apiToken = useAuthStore(state => state.apiToken);
    const authError = useAuthStore(state => state.authError);
    const isAuthenticating = useAuthStore(state => state.isAuthenticating);
    const login = useAuthStore(state => state.login);
    const setTokenInput = useAuthStore(state => state.setTokenInput);
    const tokenInput = useAuthStore(state => state.tokenInput);
    const isDarkMode = useScreenerStore(state => state.isDarkMode);
    const toggleDarkMode = useScreenerStore(state => state.toggleDarkMode);
    const location = useLocation();
    const navigate = useNavigate();
    const abortControllerRef = React.useRef<AbortController | null>(null);
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    const locationState = location.state as LocationState | null;
    const returnPath = locationState?.returnPath ?? "/";

    React.useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    React.useEffect(() => {
        if (apiToken.length > 0) {
            navigate(returnPath, {replace: true});
        }
    }, [apiToken, returnPath, navigate]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        abortControllerRef.current?.abort();

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        void login(abortController.signal);
    };

    const handleTokenInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTokenInput(event.target.value);
    };

    const handlePasswordVisibilityToggle = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <main className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-100">
            <div className="absolute top-4 right-4">
                <ThemeToggleButton isDarkMode={isDarkMode} onPress={toggleDarkMode} />
            </div>
            <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-8 sm:px-6">
                <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 dark:bg-neutral-400/15 dark:text-neutral-300">
                            <KeyRound className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">登入美股選股器</h1>
                            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">輸入密碼後先可以查看資料。</p>
                        </div>
                    </div>
                    <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div className="flex w-full flex-col gap-2">
                            <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="api-token">
                                密碼
                            </Label>
                            <InputGroup className="h-11 rounded-full bg-neutral-100 shadow-none dark:bg-neutral-800" variant="secondary">
                                <InputGroup.Input
                                    autoComplete="current-password"
                                    className="w-full"
                                    id="api-token"
                                    name="api-token"
                                    placeholder="輸入密碼"
                                    type={isPasswordVisible ? "text" : "password"}
                                    value={tokenInput}
                                    onChange={handleTokenInputChange}
                                />
                                <InputGroup.Suffix className="pr-1">
                                    <Button
                                        aria-label={isPasswordVisible ? "隱藏密碼" : "顯示密碼"}
                                        className="size-8 rounded-full px-0 dark:hover:bg-neutral-700"
                                        isIconOnly
                                        size="sm"
                                        type="button"
                                        variant="ghost"
                                        onPress={handlePasswordVisibilityToggle}
                                    >
                                        {isPasswordVisible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                                    </Button>
                                </InputGroup.Suffix>
                            </InputGroup>
                        </div>
                        {authError ? <p className="text-sm font-medium text-red-600 dark:text-red-400">{authError}</p> : null}
                        <Button className="h-11 w-full rounded-full" isDisabled={tokenInput.trim().length === 0} isPending={isAuthenticating} type="submit">
                            登入
                        </Button>
                    </Form>
                </section>
            </div>
        </main>
    );
});
