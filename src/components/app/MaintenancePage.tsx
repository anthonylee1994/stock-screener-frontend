import React from "react";
import {Wrench} from "lucide-react";
import {ThemeToggleButton} from "../layout/ThemeToggleButton";
import {useScreenerStore} from "../../stores/useScreenerStore";

export const MaintenancePage = React.memo(() => {
    const isDarkMode = useScreenerStore(state => state.isDarkMode);
    const toggleDarkMode = useScreenerStore(state => state.toggleDarkMode);

    return (
        <main className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-100">
            <div className="absolute top-4 right-4">
                <ThemeToggleButton isDarkMode={isDarkMode} onPress={toggleDarkMode} />
            </div>
            <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-8 sm:px-6">
                <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-full bg-amber-50 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">
                            <Wrench className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">系統維護中</h1>
                            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">美股選股器暫時未開放。</p>
                        </div>
                    </div>
                    <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">我哋而家處理緊資料同服務更新，完成之後會重新開返。</p>
                </section>
            </div>
        </main>
    );
});
