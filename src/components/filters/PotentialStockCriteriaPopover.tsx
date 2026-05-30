import React from "react";
import {Button, Popover} from "@heroui/react";
import {CircleHelp} from "lucide-react";

const requiredPotentialStockCriteria = ["ROE > 15%"] as const;
const growthPotentialStockCriteria = ["過去5年每股盈利增長 > 15%", "過去5年每股營收增長 > 20%"] as const;

export const PotentialStockCriteriaPopover = React.memo(() => {
    return (
        <Popover>
            <Popover.Trigger>
                <Button aria-label="潛力股條件" className="size-8 min-w-8 rounded-full px-0 text-neutral-500 dark:text-neutral-400" variant="ghost">
                    <CircleHelp className="size-4" />
                </Button>
            </Popover.Trigger>
            <Popover.Content
                className="w-[420px] max-w-[calc(100vw-2rem)] border border-neutral-200 bg-white text-neutral-950 shadow-xl dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                placement="bottom"
            >
                <Popover.Dialog className="p-3">
                    <Popover.Heading className="mb-2 text-sm font-semibold text-neutral-950 dark:text-neutral-100">潛力股條件</Popover.Heading>
                    <div className="space-y-3 rounded-2xl border border-neutral-200 p-3 text-xs dark:border-neutral-800">
                        <div>
                            <p className="mb-1 font-semibold text-neutral-500 dark:text-neutral-400">必須符合</p>
                            {requiredPotentialStockCriteria.map(item => (
                                <p key={item} className="font-medium text-neutral-900 dark:text-neutral-100">
                                    {item}
                                </p>
                            ))}
                        </div>
                        <div className="border-t border-neutral-200 pt-3 dark:border-neutral-800">
                            <p className="mb-2 font-semibold text-neutral-500 dark:text-neutral-400">並符合以下其中一項</p>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {growthPotentialStockCriteria.map(item => (
                                    <div key={item} className="rounded-lg bg-neutral-100 px-3 py-2 font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Popover.Dialog>
            </Popover.Content>
        </Popover>
    );
});
