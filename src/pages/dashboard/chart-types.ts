export type ChartBarData = {
  dateKey: string;
  label: string;
  [locationId: string]: number | string;
};

export type LocationChartConfig = {
  locationId: string;
  name: string;
  color: string;
};

export type ChartData = {
  bars: ChartBarData[];
  locationConfigs: LocationChartConfig[];
  xAxisInterval: number;
};

export type TooltipEntry = {
  value?: number;
  dataKey?: string;
  fill?: string;
  payload?: Record<string, number | string>;
};

export type ChartTooltipProps = {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
  locationConfigs: LocationChartConfig[];
};
