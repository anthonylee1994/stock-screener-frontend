import React from "react";
import {Wrench} from "lucide-react";

export const MaintenancePage = React.memo(() => {
    return (
        <React.Fragment>
            <main className="min-h-screen bg-slate-50 text-slate-950">
                <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-8 sm:px-6">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                                <Wrench className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-slate-950">系統維護中</h1>
                                <p className="mt-1 text-sm text-slate-500">美股選股器暫時未開放。</p>
                            </div>
                        </div>
                        <p className="text-sm leading-6 text-slate-600">我哋而家處理緊資料同服務更新，完成之後會重新開返。</p>
                    </section>
                </div>
            </main>
        </React.Fragment>
    );
});
