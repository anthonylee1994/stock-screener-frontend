import React from "react";
import type {SortDescriptor} from "@heroui/react";
import {DesktopStockTable} from "./DesktopStockTable";
import {MobileStockList} from "./MobileStockList";
import {ScoreDetailModal} from "./ScoreDetailModal";
import {StockDetailModal} from "./StockDetailModal";
import {useStockRouteModal} from "../hooks/useStockRouteModal";
import {useScreenerStore} from "../stores/useScreenerStore";
import type {StockRow} from "../types/Screener";

export const StockResultsTable = React.memo(() => {
    const error = useScreenerStore(state => state.error);
    const filters = useScreenerStore(state => state.filters);
    const isLoading = useScreenerStore(state => state.isLoading);
    const rows = useScreenerStore(state => state.rows);
    const sortRows = useScreenerStore(state => state.sortRows);
    const {detailModal, selectedStockDetailRow, handleDetailPress, handleScoreDetailOpenChange, handleStockDetailOpenChange, handleStockDetailPress, handleStockDetailScorePress} =
        useStockRouteModal(rows);

    const sortDescriptor: SortDescriptor = {
        column: filters.order,
        direction: filters.ascend ? "ascending" : "descending",
    };

    const handleMobileSelectedRowChange = (row: StockRow | null) => {
        if (row) {
            handleStockDetailPress(row);
        }
    };

    return (
        <React.Fragment>
            <div className="md:hidden">
                <MobileStockList error={error} isLoading={isLoading} rows={rows} sortDescriptor={sortDescriptor} onSelectedRowChange={handleMobileSelectedRowChange} onSortChange={sortRows} />
            </div>
            <DesktopStockTable
                error={error}
                isLoading={isLoading}
                rows={rows}
                sortDescriptor={sortDescriptor}
                onDetailPress={handleDetailPress}
                onSortChange={sortRows}
                onStockDetailPress={handleStockDetailPress}
            />
            <ScoreDetailModal detailModal={detailModal} onOpenChange={handleScoreDetailOpenChange} />
            <StockDetailModal row={selectedStockDetailRow} onDetailPress={handleStockDetailScorePress} onOpenChange={handleStockDetailOpenChange} />
        </React.Fragment>
    );
});
