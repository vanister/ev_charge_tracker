import { DEFAULT_GAS_PRICE_CENTS, DEFAULT_COMPARISON_MPG, DEFAULT_MI_PER_KWH } from '../../constants';

export type GasComparisonFormData = {
  gasPriceStr: string;
  comparisonMpgStr: string;
  defaultMiPerKwhStr: string;
};

export const DEFAULT_GAS_COMPARISON_FORM_DATA: GasComparisonFormData = {
  gasPriceStr: (DEFAULT_GAS_PRICE_CENTS / 100).toFixed(2),
  comparisonMpgStr: `${DEFAULT_COMPARISON_MPG}`,
  defaultMiPerKwhStr: `${DEFAULT_MI_PER_KWH}`
};
