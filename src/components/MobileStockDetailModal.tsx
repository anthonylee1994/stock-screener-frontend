import React from "react";
import {Modal} from "@heroui/react";
import type {DetailKind} from "./ScoreDetailModal";
import {getSectorDisplayName} from "../constants/FilterOptions";
import type {StockRow} from "../types/Screener";
import {formatCompactCurrency, formatScore, formatVolume} from "../utils/Format";
import {getScoreClassName} from "../utils/ScoreStyle";

interface Props {
    row: StockRow | null;
    onDetailPress: (row: StockRow, kind: DetailKind) => void;
    onOpenChange: (isOpen: boolean) => void;
}

export const MobileStockDetailModal = React.memo<Props>(({row, onDetailPress, onOpenChange}) => {
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
            <Modal.Container size="lg" placement="center">
                <Modal.Dialog>
                    <Modal.CloseTrigger />
                    <Modal.Header>
                        <Modal.Heading>{row ? `${row.ticker} 詳情` : "股票詳情"}</Modal.Heading>
                    </Modal.Header>
                    <Modal.Body>
                        {row ? (
                            <React.Fragment>
                                <p className="text-sm text-slate-500 mb-3">{row.name}</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <MobileDetailItem label="板塊" value={getSectorDisplayName(row.sector)} />
                                    <MobileDetailItem label="市值" value={formatCompactCurrency(row.marketCap)} />
                                    <MobileDetailItem label="成交量" value={formatVolume(row.volume)} />
                                    <MobileDetailItem label="總分" value={formatScore(row.totalScore)} />
                                </div>
                                <div className="flex flex-col gap-3 pt-3">
                                    <MobileScoreAction label="基本面" score={row.fundamentalScore} onPress={handleFundamentalPress} />
                                    <MobileScoreAction label="技術面" score={row.technicalScore} onPress={handleTechnicalPress} />
                                </div>
                            </React.Fragment>
                        ) : null}
                    </Modal.Body>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
});

type MobileScoreActionProps = {
    label: string;
    score: number;
    onPress: () => void;
};

const MobileScoreAction = React.memo((props: MobileScoreActionProps) => {
    const {label, score, onPress} = props;

    return (
        <button className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-3 text-left active:bg-slate-50" type="button" onClick={onPress}>
            <span className="text-sm font-medium text-slate-600">{label}</span>
            <span className={getScoreClassName(score, "mobilePill")}>{formatScore(score)}</span>
        </button>
    );
});

type MobileDetailItemProps = {
    label: string;
    value: string;
};

const MobileDetailItem = React.memo((props: MobileDetailItemProps) => {
    const {label, value} = props;

    return (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className="mt-1 text-base font-semibold text-slate-950">{value}</p>
        </div>
    );
});
