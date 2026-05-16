import React from "react";
import {Chip} from "@heroui/react";

interface Props {
    count: number;
}

export const ScreenHeader = React.memo<Props>(({count}) => {
    return (
        <header className="flex gap-3 border-b border-slate-200 pb-5 flex-row items-center justify-between">
            <h1 className="mt-1 text-3xl font-semibold tracking-normal text-slate-950 sm:text-3xl">美股選股器</h1>
            <div className="flex flex-wrap gap-2">
                <Chip>共 {count} 隻股票</Chip>
            </div>
        </header>
    );
});
