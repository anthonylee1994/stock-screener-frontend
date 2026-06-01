const options = [
    {id: "total_score", label: "綜合"},
    {id: "market_cap", label: "市值"},
    {id: "target_price_upside", label: "目標價"},
    {id: "volume", label: "成交量"},
    {id: "fundamental_score", label: "基本面"},
    {id: "technical_score", label: "技術面"},
    {id: "change_percent", label: "升跌幅"},
] as const;

export const mobileSortOptions = {
    options,
};
