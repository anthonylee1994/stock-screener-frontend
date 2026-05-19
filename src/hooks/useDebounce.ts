import React from "react";

export function useDebounce<T>(value: T, delayMs: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState(value);

    React.useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedValue(value);
        }, delayMs);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [delayMs, value]);

    return debouncedValue;
}
