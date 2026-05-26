import type {SortDescriptor} from "@heroui/react";
import {mobileSortOptions} from "@/constants/MobileSortOptions";

export function getMobileMetricLabel(sortDescriptor: SortDescriptor): string {
    const activeColumn = String(sortDescriptor.column);

    return mobileSortOptions.find(option => option.id === activeColumn)?.label ?? "綜合";
}
