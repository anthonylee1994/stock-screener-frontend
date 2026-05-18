import React from "react";
import type {Key} from "@heroui/react";
import {Button, Label, ListBox, SearchField, Select} from "@heroui/react";
import {RefreshCw, Search} from "lucide-react";
import {marketCapOptions, sectorOptions} from "../constants/FilterOptions";
import type {MarketCapFilter, ScreenerFilters, SectorFilter} from "../types/Screener";

interface Props {
    filters: ScreenerFilters;
    isLoading: boolean;
    query: string;
    onFiltersChange: (filters: ScreenerFilters) => void;
    onQueryChange: (query: string) => void;
    onRetry: () => void;
}

export const FilterPanel = React.memo<Props>(({filters, isLoading, query, onFiltersChange, onQueryChange, onRetry}) => {
    const [searchText, setSearchText] = React.useState(query);
    const debouncedSearchText = useDebounce(searchText, 250);

    React.useEffect(() => {
        setSearchText(query);
    }, [query]);

    React.useEffect(() => {
        if (debouncedSearchText !== query) {
            onQueryChange(debouncedSearchText);
        }
    }, [debouncedSearchText, onQueryChange, query]);

    const handleSectorChange = (value: Key | null) => {
        onFiltersChange({...filters, sector: String(value ?? "All") as SectorFilter});
    };

    const handleMarketCapChange = (value: Key | null) => {
        onFiltersChange({...filters, marketCap: String(value ?? "+mid") as MarketCapFilter});
    };

    const handleQueryChange = (value: string) => {
        setSearchText(value);
    };

    return (
        <section className="mt-5 mb-4 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[minmax(260px,1.8fr)_minmax(150px,0.7fr)_minmax(170px,0.7fr)_auto] lg:items-end">
                <SearchField className="min-w-0" name="stock-search" value={searchText} onChange={handleQueryChange}>
                    <Label className="sr-only">搜尋</Label>
                    <SearchField.Group className="h-10 rounded-lg border-slate-200 bg-slate-50 shadow-none">
                        <SearchField.SearchIcon>
                            <Search className="size-4 text-slate-500" />
                        </SearchField.SearchIcon>
                        <SearchField.Input className="w-full text-sm" placeholder="搜尋股票代碼或名稱..." />
                        <SearchField.ClearButton />
                    </SearchField.Group>
                </SearchField>
                <FilterSelect label="板塊" options={sectorOptions} placeholder="板塊" value={filters.sector} onChange={handleSectorChange} />
                <FilterSelect label="市值" options={marketCapOptions} placeholder="市值" value={filters.marketCap} onChange={handleMarketCapChange} />
                <Button className="h-10 w-full whitespace-nowrap rounded-lg px-3" isDisabled={isLoading} variant="tertiary" onPress={onRetry}>
                    <RefreshCw className={isLoading ? "size-4 animate-spin" : "size-4"} />
                    <span>重新整理</span>
                </Button>
            </div>
        </section>
    );
});

type FilterSelectProps = {
    label: string;
    options: readonly {label: string; value: string}[];
    placeholder: string;
    value: string;
    onChange: (value: Key | null) => void;
};

const FilterSelect = React.memo((props: FilterSelectProps) => {
    const {label, options, placeholder, value, onChange} = props;

    return (
        <Select className="text-slate-950" placeholder={placeholder} value={value} onChange={onChange}>
            <Label className="sr-only">{label}</Label>
            <Select.Trigger className="h-10 rounded-lg border-slate-200 bg-slate-50 text-sm font-medium text-slate-950 shadow-none">
                <Select.Value />
                <Select.Indicator />
            </Select.Trigger>
            <Select.Popover className="border border-slate-200 bg-white text-slate-950 shadow-xl">
                <ListBox className="bg-white p-2 text-slate-950">
                    {options.map(option => (
                        <ListBox.Item
                            key={option.value}
                            className="cursor-pointer rounded-2xl px-3 py-2 text-sm text-slate-950 outline-none hover:bg-emerald-50 data-focused:bg-emerald-50 data-selected:bg-emerald-100"
                            id={option.value}
                            textValue={option.label}
                        >
                            <span className="font-medium text-slate-950">{option.label}</span>
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Select.Popover>
        </Select>
    );
});

function useDebounce<T>(value: T, delayMs: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState(value);

    React.useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedValue(value);
        }, delayMs);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [delayMs, value]);

    return debouncedValue;
}
