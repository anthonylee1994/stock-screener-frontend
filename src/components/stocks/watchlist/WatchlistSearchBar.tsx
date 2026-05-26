import React from "react";
import {Label, SearchField} from "@heroui/react";
import {Search} from "lucide-react";

interface Props {
    value: string;
    onChange(value: string): void;
}

export const WatchlistSearchBar = React.memo<Props>(({value, onChange}) => {
    return (
        <section className="mb-4 rounded-4xl border border-neutral-200 bg-white/90 p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/90">
            <SearchField className="min-w-0" name="watchlist-search" value={value} onChange={onChange}>
                <Label className="sr-only">搜尋觀察名單</Label>
                <SearchField.Group className="h-10 rounded-4xl border-neutral-200 bg-neutral-100 shadow-none dark:border-neutral-700 dark:bg-neutral-800">
                    <SearchField.SearchIcon>
                        <Search className="size-4 text-neutral-500 dark:text-neutral-400" />
                    </SearchField.SearchIcon>
                    <SearchField.Input className="w-full text-sm" placeholder="搜尋股票代碼或名稱..." />
                    <SearchField.ClearButton />
                </SearchField.Group>
            </SearchField>
        </section>
    );
});
