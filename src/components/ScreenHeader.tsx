import React from "react";
import {Button, Chip} from "@heroui/react";
import {LogOut} from "lucide-react";

interface Props {
    count: number;
    onLogout: () => void;
}

export const ScreenHeader = React.memo<Props>(({count, onLogout}) => {
    return (
        <header className="flex flex-row items-center justify-between gap-3 border-b border-slate-200 px-3 pb-5">
            <div className="flex items-center justify-end gap-2">
                <h1 className="text-2xl font-semibold tracking-normal text-slate-950">美股選股器</h1>
                <Chip>共 {count} 隻股票</Chip>
            </div>
            <Button className="h-9 rounded-lg px-3" size="sm" variant="outline" onPress={onLogout}>
                <LogOut className="size-4" />
                <span>登出</span>
            </Button>
        </header>
    );
});
