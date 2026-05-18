import React from "react";
import {Button, Form, Input, Label} from "@heroui/react";
import {KeyRound} from "lucide-react";

interface Props {
    error: string | null;
    isAuthenticating: boolean;
    tokenInput: string;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onTokenInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AuthPage = React.memo<Props>(({error, isAuthenticating, tokenInput, onSubmit, onTokenInputChange}) => {
    return (
        <React.Fragment>
            <main className="min-h-screen bg-slate-50 text-slate-950">
                <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-8 sm:px-6">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                <KeyRound className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-slate-950">登入美股選股器</h1>
                                <p className="mt-1 text-sm text-slate-500">輸入密碼後先可以查看資料。</p>
                            </div>
                        </div>
                        <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
                            <div className="flex w-full flex-col gap-2">
                                <Label className="text-sm font-medium text-slate-700" htmlFor="api-token">
                                    密碼
                                </Label>
                                <Input
                                    variant="secondary"
                                    autoComplete="current-password"
                                    className="h-11 rounded-lg bg-slate-100 shadow-none"
                                    fullWidth
                                    id="api-token"
                                    name="api-token"
                                    placeholder="輸入密碼"
                                    type="password"
                                    value={tokenInput}
                                    onChange={onTokenInputChange}
                                />
                            </div>
                            {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
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
