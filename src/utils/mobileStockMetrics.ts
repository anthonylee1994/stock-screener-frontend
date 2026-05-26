import type {SortDescriptor} from "@heroui/react";
import {mobileSortOptions} from "@/constants/mobileSortOptions";

function getMobileMetricLabel(sortDescriptor: SortDescriptor): string {
    const activeColumn = String(sortDescriptor.column);

    return mobileSortOptions.options.find(option => option.id === activeColumn)?.label ?? "綜合";
}

export const mobileStockMetrics = {
    getMobileMetricLabel,
};
