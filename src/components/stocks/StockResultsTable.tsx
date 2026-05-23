import React from "react";
import type {Key, SortDescriptor} from "@heroui/react";
import {Tabs} from "@heroui/react";
import {FilterPanel} from "../filters/FilterPanel";
import {ScoreDetailModal} from "../stock-detail/ScoreDetailModal";
import {StockDetailModal} from "../stock-detail/StockDetailModal";
import {StockResultsView} from "./StockResultsView";
import {useStockRouteModal} from "../../hooks/useStockRouteModal";
import {useAuthStore} from "../../stores/useAuthStore";
import {useMainTabStore} from "../../stores/useMainTabStore";
import {useScreenerStore} from "../../stores/useScreenerStore";
import {useWatchlistStore} from "../../stores/useWatchlistStore";
import type {StockRow} from "../../types/Screener";

export const StockResultsTable = React.memo(() => {
    const apiToken = useAuthStore(state => state.apiToken);
    const setSelectedTab = useMainTabStore(state => state.setActiveTab);

    const error = useScreenerStore(state => state.error);
    const filters = useScreenerStore(state => state.filters);
    const isLoading = useScreenerStore(state => state.isLoading);
    const rows = useScreenerStore(state => state.rows);
    const sortRows = useScreenerStore(state => state.sortRows);

    const watchlistError = useWatchlistStore(state => state.error);
    const isWatchlistLoading = useWatchlistStore(state => state.isLoading);
    const loadWatchlistRows = useWatchlistStore(state => state.loadRows);
    const watchlistReloadKey = useWatchlistStore(state => state.reloadKey);
    const watchlistRows = useWatchlistStore(state => state.rows);
    const watchlistTickers = useWatchlistStore(state => state.tickers);
    const selectedTab = useMainTabStore(state => state.activeTab);
    const toggleWatchlistTicker = useWatchlistStore(state => state.toggleTicker);

    const {detailModal, selectedStockDetailRow, handleDetailPress, handleScoreDetailOpenChange, handleStockDetailOpenChange, handleStockDetailPress, handleStockDetailScorePress} = useStockRouteModal(
        selectedTab === "watchlist" ? watchlistRows : rows
    );

    const sortDescriptor: SortDescriptor = {
        column: filters.order,
        direction: filters.ascend ? "ascending" : "descending",
    };

    React.useEffect(() => {
        if (selectedTab !== "watchlist") {
            return;
        }

        if (watchlistTickers.length === 0) {
            return;
        }

        const abortController = new AbortController();

        void loadWatchlistRows(filters, apiToken, abortController.signal);

        return () => {
            abortController.abort();
        };
    }, [apiToken, filters, loadWatchlistRows, selectedTab, watchlistReloadKey, watchlistTickers]);

    const handleMobileSelectedRowChange = (row: StockRow | null) => {
        if (row) {
            handleStockDetailPress(row);
        }
    };

    const handleTabSelectionChange = (key: Key) => {
        setSelectedTab(key === "watchlist" ? "watchlist" : "all");
    };

    const handleWatchlistToggle = (row: StockRow) => {
        toggleWatchlistTicker(row.ticker);
    };

    const watchlistEmptyMessage = watchlistTickers.length === 0 ? "未加入任何股票" : "搵唔到 Watchlist 股票";

    return (
        <React.Fragment>
            <Tabs selectedKey={selectedTab} onSelectionChange={handleTabSelectionChange}>
                <Tabs.ListContainer>
                    <Tabs.List aria-label="股票列表">
                        <Tabs.Tab id="all">
                            全部
                            <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab id="watchlist">
                            觀察名單 ({watchlistTickers.length})
                            <Tabs.Indicator />
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs.ListContainer>
                <Tabs.Panel className="px-0 mb-14 xl:mb-0" id="all">
                    <FilterPanel />
                    <StockResultsView
                        emptyMessage="搵唔到符合條件嘅股票"
                        error={error}
                        isLoading={isLoading}
                        rows={rows}
                        sortDescriptor={sortDescriptor}
                        watchlistTickers={watchlistTickers}
                        onDetailPress={handleDetailPress}
                        onMobileSelectedRowChange={handleMobileSelectedRowChange}
                        onSortChange={sortRows}
                        onStockDetailPress={handleStockDetailPress}
                        onWatchlistToggle={handleWatchlistToggle}
                    />
                </Tabs.Panel>
                <Tabs.Panel className="px-0 mb-14 xl:mb-0" id="watchlist">
                    <StockResultsView
                        emptyMessage={watchlistEmptyMessage}
                        error={watchlistError}
                        isLoading={isWatchlistLoading}
                        rows={watchlistRows}
                        sortDescriptor={sortDescriptor}
                        watchlistTickers={watchlistTickers}
                        onDetailPress={handleDetailPress}
                        onMobileSelectedRowChange={handleMobileSelectedRowChange}
                        onSortChange={sortRows}
                        onStockDetailPress={handleStockDetailPress}
                        onWatchlistToggle={handleWatchlistToggle}
                    />
                </Tabs.Panel>
            </Tabs>
            <ScoreDetailModal detailModal={detailModal} onOpenChange={handleScoreDetailOpenChange} />
            <StockDetailModal row={selectedStockDetailRow} onDetailPress={handleStockDetailScorePress} onOpenChange={handleStockDetailOpenChange} />
        </React.Fragment>
    );
});
