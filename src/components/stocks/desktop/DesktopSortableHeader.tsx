import React from "react";
import type {SortDescriptor} from "@heroui/react";
import classNames from "classnames";
import {SortableColumnHeader} from "../shared/SortableColumnHeader";

interface Props {
    align?: "center" | "left" | "right";
    children: React.ReactNode;
    column: string;
    sortDescriptor: SortDescriptor;
    onSortChange(sortDescriptor: SortDescriptor): void;
}

export const DesktopSortableHeader = React.memo<Props>(({align = "left", children, column, sortDescriptor, onSortChange}) => {
    const sortDirection = String(sortDescriptor.column) === column ? sortDescriptor.direction : undefined;
    const buttonClassName = classNames("px-2 cursor-pointer", {
        "justify-self-start": align === "left",
        "justify-self-center": align === "center",
        "justify-self-end": align === "right",
    });

    return (
        <button className={buttonClassName} type="button" onClick={() => onSortChange({column, direction: sortDirection === "ascending" ? "descending" : "ascending"})}>
            <SortableColumnHeader sortDirection={sortDirection}>{children}</SortableColumnHeader>
        </button>
    );
});
