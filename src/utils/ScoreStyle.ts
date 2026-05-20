import classNames from "classnames";

export function getScoreClassName(score: number, variant: "button" | "mobilePill" | "pill" | "summary" = "pill"): string {
    const baseClassName = getScoreBaseClassName(variant);

    if (score >= 80) {
        return classNames(baseClassName, "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-300");
    }

    if (score >= 60) {
        return classNames(baseClassName, "border-lime-200 bg-lime-100 text-lime-700 dark:border-lime-400/30 dark:bg-lime-400/15 dark:text-lime-300");
    }

    if (score >= 40) {
        return classNames(baseClassName, "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-300");
    }

    return classNames(baseClassName, "border-red-200 bg-red-100 text-red-700 dark:border-red-400/30 dark:bg-red-400/15 dark:text-red-300");
}

function getScoreBaseClassName(variant: "button" | "mobilePill" | "pill" | "summary"): string {
    if (variant === "summary") {
        return "mb-3 rounded-lg border p-4";
    }

    if (variant === "button") {
        return "inline-flex h-8 min-w-14 items-center justify-center rounded-md border px-2 font-semibold duration-0";
    }

    if (variant === "mobilePill") {
        return "inline-flex min-w-11 justify-center rounded-lg px-2 py-1.5 text-xs font-semibold border";
    }

    return "inline-flex min-w-16 justify-center rounded-md px-3 py-2 font-semibold";
}
