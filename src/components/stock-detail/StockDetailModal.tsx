import React from "react";
import {Modal} from "@heroui/react";
import {FinvizChart} from "@/components/stock-detail/FinvizChart";
import {StockDetailItem} from "@/components/stock-detail/StockDetailItem";
import {StockScoreAction} from "@/components/stock-detail/StockScoreAction";
import {filterOptions} from "@/constants/filterOptions";
import type {StockRow} from "@/types/screener";
import type {DetailKind} from "@/types/stockDetail";
import {FormatUtil} from "@/utils/FormatUtil";

interface Props {
    row: StockRow | null;
    onDetailPress: (row: StockRow, kind: DetailKind) => void;
    onOpenChange: (isOpen: boolean) => void;
}

export const StockDetailModal = React.memo<Props>(({row, onDetailPress, onOpenChange}) => {
    const handleFundamentalPress = () => {
        if (row) {
            onOpenChange(false);
            onDetailPress(row, "fundamental");
        }
    };

    const handleTechnicalPress = () => {
        if (row) {
            onOpenChange(false);
            onDetailPress(row, "technical");
        }
    };

    return (
        <Modal.Backdrop isOpen={row !== null} onOpenChange={onOpenChange}>
            <Modal.Container size="lg" placement="center" scroll="outside">
                <Modal.Dialog className="dark:bg-neutral-900">
                    <Modal.CloseTrigger />
                    <Modal.Header>
                        <Modal.Heading>{row ? `${row.ticker} 詳情` : "股票詳情"}</Modal.Heading>
                    </Modal.Header>
                    <Modal.Body>
                        {row ? (
                            <React.Fragment>
                                <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">{row.name}</p>
                                <FinvizChart className="mb-4" ticker={row.ticker} />
                                <div className="grid grid-cols-2 gap-3">
                                    <StockDetailItem label="板塊" value={filterOptions.getSectorDisplayName(row.sector)} />
                                    <StockDetailItem label="市值" value={FormatUtil.formatCompactCurrency(row.marketCap)} />
                                    <StockDetailItem label="成交量" value={FormatUtil.formatVolume(row.volume)} />
                                    <StockDetailItem label="總分" value={FormatUtil.formatScore(row.totalScore)} />
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3">
                                    <StockScoreAction label="基本面" score={row.fundamentalScore} onPress={handleFundamentalPress} />
                                    <StockScoreAction label="技術面" score={row.technicalScore} onPress={handleTechnicalPress} />
                                </div>
                            </React.Fragment>
                        ) : null}
                    </Modal.Body>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
});
