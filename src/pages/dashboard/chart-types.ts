export type ChartDayData = {
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
  days: ChartDayData[];
  locationConfigs: LocationChartConfig[];
};

export type TooltipEntry = {
  value?: number;
  dataKey?: string;
  fill?: string;
};

export type ChartTooltipProps = {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
  locationConfigs: LocationChartConfig[];
};
