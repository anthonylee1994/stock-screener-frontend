import React from "react";
import classNames from "classnames";
import {ProgressCircle} from "@heroui/react";

interface Props {
    className?: string;
    error: string | null;
    hasMore: boolean;
    isLoadingMore: boolean;
    loadMoreRef: React.RefObject<HTMLDivElement | null>;
}

export const LoadMoreStatus = React.memo<Props>(({className, error, hasMore, isLoadingMore, loadMoreRef}) => {
    if (!hasMore && !isLoadingMore && !error) {
        return null;
    }

    return (
        <div ref={loadMoreRef} className={classNames("px-3 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400", className)}>
            <ProgressCircle isIndeterminate aria-label="Loading">
                <ProgressCircle.Track>
                    <ProgressCircle.TrackCircle />
                    <ProgressCircle.FillCircle />
                </ProgressCircle.Track>
            </ProgressCircle>
        </div>
    );
});
