import React from "react";
import {DesktopSortableHeader} from "@/components/stocks/desktop/DesktopSortableHeader";
import {SortDescriptor} from "@heroui/react";

interface Props {
    sortDescriptor: SortDescriptor;
    onSortChange(sortDescriptor: SortDescriptor): void;
}

export const DesktopStockTableHeader = React.memo<Props>(({sortDescriptor, onSortChange}) => {
    return (
        <div className="sticky top-0 z-10 grid grid-cols-[72px_minmax(220px,1.8fr)_150px_110px_110px_110px_110px_104px_104px_96px] items-center border-b border-neutral-200 bg-neutral-50 px-3 py-3 text-xs font-semibold text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400">
            <span className="text-center">排名</span>
            <span className="pl-12">股票</span>
            <span>板塊</span>
            <DesktopSortableHeader align="right" column="market_cap" sortDescriptor={sortDescriptor} onSortChange={onSortChange}>
                市值
            </DesktopSortableHeader>
            <DesktopSortableHeader align="right" column="change_percent" sortDescriptor={sortDescriptor} onSortChange={onSortChange}>
                升跌幅
            </DesktopSortableHeader>
            <DesktopSortableHeader align="right" column="target_price_upside" sortDescriptor={sortDescriptor} onSortChange={onSortChange}>
                目標價
            </DesktopSortableHeader>
            <DesktopSortableHeader align="right" column="volume" sortDescriptor={sortDescriptor} onSortChange={onSortChange}>
                成交量
            </DesktopSortableHeader>
            <DesktopSortableHeader align="center" column="fundamental_score" sortDescriptor={sortDescriptor} onSortChange={onSortChange}>
                基本面
            </DesktopSortableHeader>
            <DesktopSortableHeader align="center" column="technical_score" sortDescriptor={sortDescriptor} onSortChange={onSortChange}>
                技術面
            </DesktopSortableHeader>
            <DesktopSortableHeader align="center" column="total_score" sortDescriptor={sortDescriptor} onSortChange={onSortChange}>
                綜合
            </DesktopSortableHeader>
        </div>
    );
});
