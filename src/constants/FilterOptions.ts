import type {MarketCapFilter, OrderFilter, SectorFilter} from "../types/Screener";

export const sectorOptions: readonly {label: string; value: SectorFilter}[] = [
    {label: "全部", value: "All"},
    {label: "科技", value: "Technology"},
    {label: "醫療", value: "Healthcare"},
    {label: "金融", value: "Financial"},
    {label: "非必需消費", value: "Consumer Cyclical"},
    {label: "必需消費", value: "Consumer Defensive"},
    {label: "通訊服務", value: "Communication Services"},
    {label: "工業", value: "Industrials"},
    {label: "能源", value: "Energy"},
    {label: "公用事業", value: "Utilities"},
    {label: "房地產", value: "Real Estate"},
    {label: "原材料", value: "Basic Materials"},
];

export const marketCapOptions: readonly {label: string; value: MarketCapFilter}[] = [
    {label: "中型或以上", value: "+mid"},
    {label: "微型", value: "micro"},
    {label: "小型", value: "small"},
    {label: "中型", value: "mid"},
    {label: "大型", value: "large"},
    {label: "超大型", value: "mega"},
];

export const orderOptions: readonly {label: string; value: OrderFilter}[] = [
    {label: "總分", value: "total_score"},
    {label: "基本面分", value: "fundamental_score"},
    {label: "技術面分", value: "technical_score"},
    {label: "市值", value: "market_cap"},
    {label: "成交量", value: "volume"},
];

export function getSectorLabel(value: SectorFilter): string {
    return sectorOptions.find(option => option.value === value)?.label ?? value;
}

export function getSectorDisplayName(value: string): string {
    return sectorOptions.find(option => option.value === value)?.label ?? value;
}

export function getMarketCapLabel(value: MarketCapFilter): string {
    return marketCapOptions.find(option => option.value === value)?.label ?? value;
}

export function getOrderLabel(value: OrderFilter): string {
    return orderOptions.find(option => option.value === value)?.label ?? value;
}
