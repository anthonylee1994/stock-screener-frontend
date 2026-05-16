import React from "react";
import type {SortDescriptor} from "@heroui/react";
import {ArrowDown, ArrowUp} from "lucide-react";

export const mobileSortOptions = [
    {id: "total_score", label: "評分"},
    {id: "market_cap", label: "市值"},
    {id: "volume", label: "成交量"},
    {id: "fundamental_score", label: "基本面"},
    {id: "technical_score", label: "技術面"},
] as const;

type MobileSortBarProps = {
    sortDescriptor: SortDescriptor;
    onSortChange: (sortDescriptor: SortDescriptor) => void;
};

export const MobileSortBar = React.memo((props: MobileSortBarProps) => {
    const {sortDescriptor, onSortChange} = props;
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
        <section className="mb-3 rounded-2xl border border-slate-200 bg-white px-2 py-2 shadow-sm">
            <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="shrink-0 text-xs font-semibold text-slate-500">排序</span>
                        <div className="flex min-w-0 gap-0 overflow-x-auto py-1">
                            {mobileSortOptions.map(option => {
                                const isSelected = activeColumn === option.id;
                                const className = isSelected
                                    ? "whitespace-nowrap rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs font-semibold text-white"
                                    : "whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 active:bg-slate-100";

                                return (
                                    <button
                                        key={option.id}
                                        aria-pressed={isSelected}
                                        className={className}
                                        type="button"
                                        onClick={() => {
                                            onSortChange({
                                                column: option.id,
                                                direction: isSelected && isAscending ? "descending" : "ascending",
                                            });
                                        }}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <button
                    aria-label={`${activeOption.label}${isAscending ? "升序" : "降序"}`}
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 active:bg-slate-200"
                    type="button"
                    onClick={handleDirectionPress}
                >
                    {isAscending ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
                </button>
            </div>
        </section>
    );
});
