import React from "react";
import {ChevronUp} from "lucide-react";

type SortableColumnHeaderProps = {
    children: React.ReactNode;
    sortDirection?: "ascending" | "descending";
};

export const SortableColumnHeader = React.memo((props: SortableColumnHeaderProps) => {
    const {children, sortDirection} = props;
    const iconClassName = sortDirection === "descending" ? "size-3 rotate-180 transition-transform" : "size-3 transition-transform";

    return (
        <span className="flex items-center justify-between gap-2">
            {children}
            {sortDirection ? <ChevronUp className={iconClassName} /> : <span className="size-3" />}
        </span>
    );
});
