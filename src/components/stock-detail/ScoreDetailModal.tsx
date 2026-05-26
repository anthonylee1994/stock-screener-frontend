import React from "react";
import {Modal} from "@heroui/react";
import classNames from "classnames";
import {FinvizChart} from "@/components/stock-detail/FinvizChart";
import type {DetailModalState} from "@/types/stockDetail";
import {format} from "@/utils/format";
import {scoreDetailSections} from "@/utils/scoreDetailSections";
import {scoreStyle} from "@/utils/scoreStyle";

interface Props {
    detailModal: DetailModalState | null;
    onOpenChange: (isOpen: boolean) => void;
}

export const ScoreDetailModal = React.memo<Props>(({detailModal, onOpenChange}) => {
    const row = detailModal?.row;
    const title = detailModal?.kind === "fundamental" ? "基本面詳情" : "技術面詳情";
    const sections = detailModal ? scoreDetailSections.getDetailSections(detailModal) : [];
    const summary = detailModal ? scoreDetailSections.getDetailSummary(detailModal) : null;
    const gridClassName = classNames("grid gap-3", {
        "grid-cols-3": detailModal?.kind === "technical",
        "grid-cols-2": detailModal?.kind !== "technical",
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
                            <div className={scoreStyle.getScoreClassName(summary.score, "summary")}>
                                <p className="text-xs font-medium">{summary.label}</p>
                                <p className="mt-1 text-3xl font-semibold">{format.formatScore(summary.score)}</p>
                            </div>
                        ) : null}
                        {sections.map(section => (
                            <section key={section.title ?? "details"} className="space-y-2 mt-4 mb-2">
                                {section.title ? <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">{section.title}</h3> : null}
                                <div className={gridClassName}>
                                    {section.items.map(detail => (
                                        <div key={detail.label} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800">
                                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{detail.label}</p>
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
