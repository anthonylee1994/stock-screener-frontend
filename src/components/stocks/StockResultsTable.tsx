import React from "react";
import type {Key} from "@heroui/react";
import {Tabs} from "@heroui/react";
import {FilterPanel} from "@/components/filters/FilterPanel";
import {ScoreDetailModal} from "@/components/stock-detail/ScoreDetailModal";
import {StockDetailModal} from "@/components/stock-detail/StockDetailModal";
import {StockResultsView} from "@/components/stocks/StockResultsView";
import {WatchlistSearchBar} from "@/components/stocks/watchlist/WatchlistSearchBar";
import {useAllStockResults} from "@/hooks/useAllStockResults";
import {useStockRouteModal} from "@/hooks/useStockRouteModal";
import {useWatchlistResults} from "@/hooks/useWatchlistResults";
import {useAuthStore} from "@/stores/useAuthStore";
import {useMainTabStore} from "@/stores/useMainTabStore";
import type {StockRow} from "@/types/screener";

export const StockResultsTable = React.memo(() => {
    const apiToken = useAuthStore(state => state.apiToken);
    const setSelectedTab = useMainTabStore(state => state.setActiveTab);
    const selectedTab = useMainTabStore(state => state.activeTab);
    const allStockResults = useAllStockResults(apiToken);
    const watchlistResults = useWatchlistResults({
        apiToken,
        filters: allStockResults.filters,
        isActive: selectedTab === "watchlist",
    });

    const {detailModal, selectedStockDetailRow, handleDetailPress, handleScoreDetailOpenChange, handleStockDetailOpenChange, handleStockDetailPress, handleStockDetailScorePress} = useStockRouteModal(
        selectedTab === "watchlist" ? watchlistResults.filteredWatchlistRows : allStockResults.rows
    );

    const handleMobileSelectedRowChange = (row: StockRow | null) => {
        if (row) {
            handleStockDetailPress(row);
        }
    };

    const handleTabSelectionChange = (key: Key) => {
        setSelectedTab(key === "watchlist" ? "watchlist" : "all");
    };

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
                            觀察名單 ({watchlistResults.watchlistTickers.length})
                            <Tabs.Indicator />
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs.ListContainer>
                <Tabs.Panel className="px-0 mb-14 xl:mb-0" id="all">
                    <FilterPanel />
                    <StockResultsView
                        emptyMessage="搵唔到符合條件嘅股票"
                        error={allStockResults.error}
                        hasMore={allStockResults.hasMore}
                        isLoading={allStockResults.isLoading}
                        isLoadingMore={allStockResults.isLoadingMore}
                        loadMoreError={allStockResults.loadMoreError}
                        rows={allStockResults.rows}
                        sortDescriptor={allStockResults.sortDescriptor}
                        watchlistTickers={watchlistResults.watchlistTickers}
                        onDetailPress={handleDetailPress}
                        onLoadMore={allStockResults.handleLoadMore}
                        onMobileSelectedRowChange={handleMobileSelectedRowChange}
                        onSortChange={allStockResults.sortRows}
                        onStockDetailPress={handleStockDetailPress}
                        onWatchlistToggle={watchlistResults.handleWatchlistToggle}
                    />
                </Tabs.Panel>
                <Tabs.Panel className="px-0 mb-14 xl:mb-0" id="watchlist">
                    <WatchlistSearchBar value={watchlistResults.watchlistSearchText} onChange={watchlistResults.setWatchlistSearchText} />
                    <StockResultsView
                        emptyMessage={watchlistResults.watchlistEmptyMessage}
                        error={watchlistResults.watchlistError}
                        hasMore={false}
                        isLoading={watchlistResults.isWatchlistLoading}
                        isLoadingMore={false}
                        loadMoreError={null}
                        rows={watchlistResults.filteredWatchlistRows}
                        sortDescriptor={allStockResults.sortDescriptor}
                        watchlistTickers={watchlistResults.watchlistTickers}
                        onDetailPress={handleDetailPress}
                        onLoadMore={allStockResults.handleLoadMore}
                        onMobileSelectedRowChange={handleMobileSelectedRowChange}
                        onSortChange={allStockResults.sortRows}
                        onStockDetailPress={handleStockDetailPress}
                        onWatchlistToggle={watchlistResults.handleWatchlistToggle}
                    />
                </Tabs.Panel>
            </Tabs>
            <ScoreDetailModal detailModal={detailModal} onOpenChange={handleScoreDetailOpenChange} />
            <StockDetailModal row={selectedStockDetailRow} onDetailPress={handleStockDetailScorePress} onOpenChange={handleStockDetailOpenChange} />
        </React.Fragment>
    );
});
