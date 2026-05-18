import React from "react";
import {Button, Form, Input, Label} from "@heroui/react";
import {KeyRound} from "lucide-react";
import {ThemeToggleButton} from "./ThemeToggleButton";

interface Props {
    error: string | null;
    isAuthenticating: boolean;
    isDarkMode: boolean;
    tokenInput: string;
    onDarkModeToggle: () => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onTokenInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AuthPage = React.memo<Props>(({error, isAuthenticating, isDarkMode, tokenInput, onDarkModeToggle, onSubmit, onTokenInputChange}) => {
    return (
        <React.Fragment>
            <main className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-100">
                <div className="absolute top-4 right-4">
                    <ThemeToggleButton isDarkMode={isDarkMode} onPress={onDarkModeToggle} />
                </div>
                <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-8 sm:px-6">
                    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 dark:bg-neutral-400/15 dark:text-neutral-300">
                                <KeyRound className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">登入美股選股器</h1>
                                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">輸入密碼後先可以查看資料。</p>
                            </div>
                        </div>
                        <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
                            <div className="flex w-full flex-col gap-2">
                                <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="api-token">
                                    密碼
                                </Label>
                                <Input
                                    variant="secondary"
                                    autoComplete="current-password"
                                    className="h-11 rounded-lg bg-neutral-100 shadow-none dark:bg-neutral-800"
                                    fullWidth
                                    id="api-token"
                                    name="api-token"
                                    placeholder="輸入密碼"
                                    type="password"
                                    value={tokenInput}
                                    onChange={onTokenInputChange}
                                />
                            </div>
                            {error ? <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p> : null}
                            <Button className="h-11 w-full rounded-lg" isDisabled={tokenInput.trim().length === 0} isPending={isAuthenticating} type="submit">
                                登入
                            </Button>
                        </Form>
                    </section>
                </div>
            </main>
        </React.Fragment>
    );
});
