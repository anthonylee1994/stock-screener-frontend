import React from "react";
import type {SortDescriptor} from "@heroui/react";
import classNames from "classnames";
import {ArrowDown, ArrowUp} from "lucide-react";
import {mobileSortOptions} from "../../../constants/MobileSortOptions";

interface Props {
    sortDescriptor: SortDescriptor;
    onSortChange: (sortDescriptor: SortDescriptor) => void;
}

export const MobileSortBar = React.memo<Props>(({sortDescriptor, onSortChange}) => {
    const activeColumn = String(sortDescriptor.column);
    const isAscending = sortDescriptor.direction === "ascending";
    const activeOption = mobileSortOptions.find(option => option.id === activeColumn) ?? mobileSortOptions[0];

    const handleDirectionPress = () => {
        onSortChange({
            column: sortDescriptor.column,
            direction: isAscending ? "descending" : "ascending",
        });
    };

    return (
        <section className="mb-4 rounded-4xl border border-neutral-200 bg-white p-2 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="grid grid-cols-[minmax(0,1fr)_36px] items-center gap-2">
                <div className="no-scrollbar min-w-0 overflow-x-auto rounded-4xl">
                    <div className="flex w-max min-w-full items-center gap-2 py-1 px-1">
                        {mobileSortOptions.map(option => {
                            const isSelected = activeColumn === option.id;
                            const className = classNames("shrink-0 whitespace-nowrap rounded-4xl px-2.5 py-1.5 text-xs font-semibold", {
                                "bg-neutral-950 text-white dark:bg-neutral-100 dark:text-neutral-950": isSelected,
                                "text-neutral-500 active:bg-neutral-100 dark:text-neutral-400 dark:active:bg-neutral-800": !isSelected,
                            });

                            return (
                                <button
                                    key={option.id}
                                    aria-pressed={isSelected}
                                    className={className}
                                    type="button"
                                    onClick={() => {
                                        onSortChange({
                                            column: option.id,
                                            direction: isSelected && !isAscending ? "ascending" : "descending",
                                        });
                                    }}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <button
                    aria-label={`${activeOption.label}${isAscending ? "升序" : "降序"}`}
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 active:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:active:bg-neutral-700"
                    type="button"
                    onClick={handleDirectionPress}
                >
                    {isAscending ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
                </button>
            </div>
        </section>
    );
});
