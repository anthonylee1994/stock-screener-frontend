import React from "react";
import type {Key} from "@heroui/react";
import {Header, Label, ListBox, Select} from "@heroui/react";

interface Props {
    label: string;
    options: readonly {label: string; value: string}[];
    placeholder: string;
    value: string;
    onChange: (value: Key | null) => void;
}

export const FilterSelect = React.memo<Props>(({label, options, placeholder, value, onChange}) => {
    return (
        <Select className="text-neutral-950 dark:text-neutral-100" placeholder={placeholder} value={value} onChange={onChange}>
            <Label className="sr-only">{label}</Label>
            <Select.Trigger className="h-10 rounded-4xl border-neutral-200 bg-neutral-100 text-sm font-medium text-neutral-950 shadow-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                <Select.Value />
                <Select.Indicator />
            </Select.Trigger>
            <Select.Popover className="border border-neutral-200 bg-white text-neutral-950 shadow-xl dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                <ListBox className="bg-white p-2 text-neutral-950 dark:bg-neutral-900 dark:text-neutral-100">
                    <ListBox.Section>
                        <Header>{label}</Header>
                        {options.map(option => (
                            <ListBox.Item
                                key={option.value}
                                className="cursor-pointer rounded-2xl px-3 py-2 text-sm text-neutral-950 outline-none hover:bg-natural-50 data-focused:bg-natural-50 data-selected:bg-natural-100 dark:text-neutral-100 dark:hover:bg-natural-400/10 dark:data-focused:bg-natural-400/10 dark:data-selected:bg-natural-400/20"
                                id={option.value}
                                textValue={option.label}
                            >
                                <span className="font-medium text-neutral-950 dark:text-neutral-100">{option.label}</span>
                            </ListBox.Item>
                        ))}
                    </ListBox.Section>
                </ListBox>
            </Select.Popover>
        </Select>
    );
});
