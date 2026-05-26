import React from "react";

interface UseLoadMoreObserverOptions {
    error: string | null;
    hasMore: boolean;
    isLoading: boolean;
    isLoadingMore: boolean;
    loadMoreError: string | null;
    onLoadMore(): void;
}

export function useLoadMoreObserver(options: UseLoadMoreObserverOptions): React.RefObject<HTMLDivElement | null> {
    const {error, hasMore, isLoading, isLoadingMore, loadMoreError, onLoadMore} = options;
    const loadMoreRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        const element = loadMoreRef.current;

        if (!element || !hasMore || isLoading || isLoadingMore || error || loadMoreError) {
            return;
        }

        const observer = new IntersectionObserver(entries => {
            const entry = entries[0];

            if (entry?.isIntersecting) {
                onLoadMore();
            }
        });

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [error, hasMore, isLoading, isLoadingMore, loadMoreError, onLoadMore]);

    return loadMoreRef;
}
