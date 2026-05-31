import React from "react";
import {Modal} from "@heroui/react";
import classNames from "classnames";
import {FinvizChart} from "@/components/stock-detail/FinvizChart";
import type {DetailModalState} from "@/types/stockDetail";
import {FormatUtil} from "@/utils/FormatUtil";
import {ScoreDetailSectionsUtil} from "@/utils/ScoreDetailSectionsUtil";
import {ScoreStyleUtil} from "@/utils/ScoreStyleUtil";

interface Props {
    detailModal: DetailModalState | null;
    onOpenChange: (isOpen: boolean) => void;
}

export const ScoreDetailModal = React.memo<Props>(({detailModal, onOpenChange}) => {
    const row = detailModal?.row;
    const title = detailModal?.kind === "fundamental" ? "基本面詳情" : "技術面詳情";
    const sections = detailModal ? ScoreDetailSectionsUtil.getDetailSections(detailModal) : [];
    const summary = detailModal ? ScoreDetailSectionsUtil.getDetailSummary(detailModal) : null;
    const priceComparison = row && detailModal?.kind === "fundamental" ? getPriceComparison(row.price, row.fundamental.targetPrice) : null;
    const gridClassName = classNames("grid gap-3", {
        "grid-cols-3": detailModal?.kind === "technical",
        "grid-cols-1 sm:grid-cols-2": detailModal?.kind !== "technical",
    });

    return (
        <Modal.Backdrop isOpen={detailModal !== null} onOpenChange={onOpenChange}>
            <Modal.Container size="lg" placement="center" scroll="outside">
                <Modal.Dialog className="dark:bg-neutral-900">
                    <Modal.CloseTrigger />
                    <Modal.Header>
                        <Modal.Heading>{row ? `${row.ticker} ${title}` : title}</Modal.Heading>
                    </Modal.Header>
                    <Modal.Body>
                        {row ? <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">{row.name}</p> : null}
                        {row && detailModal?.kind === "technical" ? <FinvizChart className="mb-4" ticker={row.ticker} /> : null}
                        {summary ? (
                            <div className={ScoreStyleUtil.getScoreClassName(summary.score, "summary")}>
                                <p className="text-xs font-medium">{summary.label}</p>
                                <p className="mt-1 text-3xl font-semibold">{FormatUtil.formatScore(summary.score)}</p>
                            </div>
                        ) : null}
                        {priceComparison ? (
                            <div className="grid grid-cols-3 gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-right dark:border-neutral-700 dark:bg-neutral-800">
                                <div>
                                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">現價</p>
                                    <p className="mt-1 text-sm font-semibold text-neutral-950 dark:text-neutral-100">{priceComparison.currentPrice}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">目標價</p>
                                    <p className="mt-1 text-sm font-semibold text-neutral-950 dark:text-neutral-100">{priceComparison.targetPrice}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">潛在升跌</p>
                                    <p className={classNames("mt-1 text-sm font-semibold", priceComparison.upsideClassName)}>{priceComparison.upside}</p>
                                </div>
                            </div>
                        ) : null}
                        {sections.map(section => (
                            <section key={section.title ?? "details"} className="space-y-2 mt-4 mb-2">
                                {section.title ? <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">{section.title}</h3> : null}
                                <div className={gridClassName}>
                                    {section.items.map(detail => (
                                        <div key={detail.label} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800">
                                            <div className="flex min-h-6 items-start justify-between gap-2 relative">
                                                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{detail.label}</p>
                                                {detail.score !== undefined ? (
                                                    <span className={ScoreStyleUtil.getScoreClassName(detail.score, "detailBadge")}>{FormatUtil.formatScore(detail.score)}</span>
                                                ) : null}
                                            </div>
                                            <p className="mt-1 text-lg font-semibold text-neutral-950 dark:text-neutral-100">{detail.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </Modal.Body>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
});

interface PriceComparison {
    currentPrice: string;
    targetPrice: string;
    upside: string;
    upsideClassName: string;
}

function getPriceComparison(currentPrice: number, targetPrice: number | null): PriceComparison {
    if (targetPrice === null) {
        return {
            currentPrice: FormatUtil.formatCurrency(currentPrice),
            targetPrice: "N/A",
            upside: "N/A",
            upsideClassName: "text-neutral-950 dark:text-neutral-100",
        };
    }

    const upside = targetPrice / currentPrice - 1;

    return {
        currentPrice: FormatUtil.formatCurrency(currentPrice),
        targetPrice: FormatUtil.formatCurrency(targetPrice),
        upside: FormatUtil.formatPercent(upside),
        upsideClassName: getUpsideClassName(upside),
    };
}

function getUpsideClassName(value: number): string {
    if (value > 0) {
        return "text-emerald-700 dark:text-emerald-300";
    }

    if (value < 0) {
        return "text-red-700 dark:text-red-300";
    }

    return "text-neutral-950 dark:text-neutral-100";
}
