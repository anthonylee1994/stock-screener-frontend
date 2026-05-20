import React from "react";
import classNames from "classnames";
import {ChevronUp} from "lucide-react";

interface Props {
    children: React.ReactNode;
    sortDirection?: "ascending" | "descending";
}

export const SortableColumnHeader = React.memo<Props>(({children, sortDirection}) => {
    const iconClassName = classNames("size-3 transition-transform", {"rotate-180": sortDirection === "descending"});

    return (
        <span className="flex items-center justify-between gap-2">
            {children}
            {sortDirection ? <ChevronUp className={iconClassName} /> : <span className="size-3" />}
        </span>
    );
});
