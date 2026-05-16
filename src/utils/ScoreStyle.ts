export function getScoreClassName(score: number, variant: "pill" | "summary" = "pill"): string {
    const baseClassName = variant === "summary" ? "mb-3 rounded-lg border p-4" : "inline-flex min-w-16 justify-center rounded-md px-3 py-2 font-semibold";

    if (score >= 80) {
        return `${baseClassName} border-emerald-200 bg-emerald-100 text-emerald-700`;
    }

    if (score >= 60) {
        return `${baseClassName} border-lime-200 bg-lime-100 text-lime-700`;
    }

    if (score >= 40) {
        return `${baseClassName} border-amber-200 bg-amber-100 text-amber-700`;
    }

    return `${baseClassName} border-red-200 bg-red-100 text-red-700`;
}
