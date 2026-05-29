import React from "react";
import {Button, Popover} from "@heroui/react";
import {CircleHelp} from "lucide-react";

const potentialStockCriteria = [
    {condition: "每股盈利季度增長", threshold: "每股盈利按季增長 >= 10%"},
    {condition: "每股營收季度增長", threshold: "每股營收按季增長 >= 5%"},
    {condition: "經營槓桿", threshold: "每股盈利季度增長 > 每股營收季度增長"},
    {condition: "估值未離地", threshold: "預測市盈率 <= 35 或 PEG <= 2"},
    {condition: "營業利潤率", threshold: "營業利潤率 >= 8%"},
    {condition: "沽空部署", threshold: "沽空比率 >= 3%"},
    {condition: "未離 52 週高位太遠", threshold: "距離 52 週高位 >= -25%，缺值當通過"},
] as const;

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
                    <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                <tr>
                                    <th className="w-[42%] px-3 py-2 font-semibold">條件</th>
                                    <th className="px-3 py-2 font-semibold">門檻</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {potentialStockCriteria.map(item => (
                                    <tr key={item.condition}>
                                        <td className="px-3 py-2 font-medium text-neutral-800 dark:text-neutral-200">{item.condition}</td>
                                        <td className="px-3 py-2 text-neutral-600 dark:text-neutral-300">{item.threshold}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Popover.Dialog>
            </Popover.Content>
        </Popover>
    );
});
