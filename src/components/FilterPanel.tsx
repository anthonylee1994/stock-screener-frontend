import React from "react";
import type {Key} from "@heroui/react";
import {Button, Label, SearchField} from "@heroui/react";
import classNames from "classnames";
import {RefreshCw, Search} from "lucide-react";
import {marketCapOptions, sectorOptions} from "../constants/FilterOptions";
import {useDebounce} from "../hooks/useDebounce";
import {useScreenerStore} from "../stores/useScreenerStore";
import type {MarketCapFilter, SectorFilter} from "../types/Screener";
import {FilterSelect} from "./FilterSelect";

export const FilterPanel = React.memo(() => {
    const filters = useScreenerStore(state => state.filters);
    const isLoading = useScreenerStore(state => state.isLoading);
    const query = useScreenerStore(state => state.query);
    const retryRows = useScreenerStore(state => state.retryRows);
    const setFilters = useScreenerStore(state => state.setFilters);
    const setQuery = useScreenerStore(state => state.setQuery);
    const [searchText, setSearchText] = React.useState(query);
    const debouncedSearchText = useDebounce(searchText, 250);
    const hasPendingSearchInputRef = React.useRef(false);

    React.useEffect(() => {
        hasPendingSearchInputRef.current = false;
        setSearchText(query);
    }, [query]);

    React.useEffect(() => {
        if (!hasPendingSearchInputRef.current) {
            return;
        }

        if (debouncedSearchText !== searchText) {
            return;
        }

        if (debouncedSearchText !== query) {
            setQuery(debouncedSearchText);
        }

        hasPendingSearchInputRef.current = false;
    }, [debouncedSearchText, query, searchText, setQuery]);

    const handleSectorChange = (value: Key | null) => {
        setFilters({...filters, sector: String(value ?? "All") as SectorFilter});
    };

    const handleMarketCapChange = (value: Key | null) => {
        setFilters({...filters, marketCap: String(value ?? "+mid") as MarketCapFilter});
    };

    const handleQueryChange = (value: string) => {
        hasPendingSearchInputRef.current = true;
        setSearchText(value);
    };

    return (
        <section className="mt-5 mb-4 rounded-2xl border border-neutral-200 bg-white/90 p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/90">
            <div className="grid gap-3 lg:grid-cols-[minmax(260px,1.8fr)_minmax(150px,0.7fr)_minmax(170px,0.7fr)_auto] lg:items-end">
                <SearchField className="min-w-0" name="stock-search" value={searchText} onChange={handleQueryChange}>
                    <Label className="sr-only">搜尋</Label>
                    <SearchField.Group className="h-10 rounded-lg border-neutral-200 bg-neutral-100 shadow-none dark:border-neutral-700 dark:bg-neutral-800">
                        <SearchField.SearchIcon>
                            <Search className="size-4 text-neutral-500 dark:text-neutral-400" />
                        </SearchField.SearchIcon>
                        <SearchField.Input className="w-full text-sm" placeholder="搜尋股票代碼或名稱..." />
                        <SearchField.ClearButton />
                    </SearchField.Group>
                </SearchField>
                <FilterSelect label="板塊" options={sectorOptions} placeholder="板塊" value={filters.sector} onChange={handleSectorChange} />
                <FilterSelect label="市值" options={marketCapOptions} placeholder="市值" value={filters.marketCap} onChange={handleMarketCapChange} />
                <Button className="h-10 w-full whitespace-nowrap rounded-lg px-3" isDisabled={isLoading} variant="primary" onPress={retryRows}>
                    <RefreshCw className={classNames("size-4", {"animate-spin": isLoading})} />
                    <span>重新整理</span>
                </Button>
            </div>
        </section>
    );
});
