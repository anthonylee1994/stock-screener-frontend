import React from "react";
import {useLocation, useNavigate, useParams} from "react-router";
import {fetchScreenerRows} from "@/services/ScreenerApi";
import {useAuthStore} from "@/stores/useAuthStore";
import type {ScreenerFilters, StockRow} from "@/types/Screener";
import type {DetailKind, DetailModalState} from "@/types/StockDetail";

interface RouteState {
    returnPath?: string;
}

interface UseStockRouteModalResult {
    detailModal: DetailModalState | null;
    selectedStockDetailRow: StockRow | null;
    handleDetailPress(row: StockRow, kind: DetailKind): void;
    handleScoreDetailOpenChange(isOpen: boolean): void;
    handleStockDetailOpenChange(isOpen: boolean): void;
    handleStockDetailPress(row: StockRow): void;
    handleStockDetailScorePress(row: StockRow, kind: DetailKind): void;
}

const routeLookupFilters: ScreenerFilters = {
    ascend: false,
    marketCap: "+mid",
    order: "total_score",
    sector: "All",
};

export function useStockRouteModal(rows: StockRow[]): UseStockRouteModalResult {
    const apiToken = useAuthStore(state => state.apiToken);
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [routeLookupRow, setRouteLookupRow] = React.useState<StockRow | null>(null);
    const routeTicker = params.ticker ? decodeURIComponent(params.ticker).toUpperCase() : null;
    const routeDetailKind = getRouteDetailKind(params.detailKind);
    const tableRouteRow = routeTicker ? (rows.find(row => row.ticker.toUpperCase() === routeTicker) ?? null) : null;
    const routeRow = tableRouteRow ?? (routeLookupRow?.ticker.toUpperCase() === routeTicker ? routeLookupRow : null);
    const detailModal: DetailModalState | null = routeRow && routeDetailKind ? {kind: routeDetailKind, row: routeRow} : null;
    const selectedStockDetailRow = routeRow && !routeDetailKind ? routeRow : null;
    const listPath = getListPath(location.search);

    React.useEffect(() => {
        if (params.detailKind && !routeDetailKind) {
            navigate(listPath, {replace: true});
        }
    }, [listPath, params.detailKind, routeDetailKind, navigate]);

    React.useEffect(() => {
        if (!routeTicker || tableRouteRow || apiToken.length === 0) {
            setRouteLookupRow(null);
            return;
        }

        const abortController = new AbortController();

        void fetchScreenerRows({
            apiToken,
            filters: routeLookupFilters,
            signal: abortController.signal,
            tickers: [routeTicker],
        })
            .then(response => {
                const lookupRow = response.data.find(row => row.ticker.toUpperCase() === routeTicker) ?? null;

                if (!lookupRow) {
                    navigate(listPath, {replace: true});
                    return;
                }

                setRouteLookupRow(lookupRow);
            })
            .catch(fetchError => {
                if (!abortController.signal.aborted) {
                    console.error(fetchError);
                    setRouteLookupRow(null);
                }
            });

        return () => {
            abortController.abort();
        };
    }, [apiToken, listPath, routeTicker, tableRouteRow, navigate]);

    function handleDetailPress(row: StockRow, kind: DetailKind): void {
        navigate(getScoreDetailPath(row, kind, location.search));
    }

    function handleStockDetailScorePress(row: StockRow, kind: DetailKind): void {
        navigate(getScoreDetailPath(row, kind, location.search), {state: {returnPath: getStockDetailPath(row, location.search)} satisfies RouteState});
    }

    function handleStockDetailPress(row: StockRow): void {
        navigate(getStockDetailPath(row, location.search));
    }

    function handleScoreDetailOpenChange(isOpen: boolean): void {
        if (!isOpen) {
            const state = location.state as RouteState | null;

            navigate(state?.returnPath ?? listPath);
        }
    }

    function handleStockDetailOpenChange(isOpen: boolean): void {
        if (!isOpen) {
            navigate(listPath);
        }
    }

    return {
        detailModal,
        selectedStockDetailRow,
        handleDetailPress,
        handleScoreDetailOpenChange,
        handleStockDetailOpenChange,
        handleStockDetailPress,
        handleStockDetailScorePress,
    };
}

function getRouteDetailKind(detailKind: string | undefined): DetailKind | null {
    if (detailKind === "fundamental" || detailKind === "technical") {
        return detailKind;
    }

    return null;
}

function getListPath(search: string): string {
    return `/${search}`;
}

function getStockDetailPath(row: StockRow, search: string): string {
    return `/${encodeURIComponent(row.ticker.toUpperCase())}${search}`;
}

function getScoreDetailPath(row: StockRow, kind: DetailKind, search: string): string {
    return `/${encodeURIComponent(row.ticker.toUpperCase())}/${kind}${search}`;
}
