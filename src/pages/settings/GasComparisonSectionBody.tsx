import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../hooks/useSettings';
import { Button } from '../../components/Button';

type GasComparisonValues = {
  gasPriceCents: number | undefined;
  comparisonMpg: number | undefined;
  defaultMiPerKwh: number | undefined;
};

function formatGasPrice(cents: number | undefined): string {
  if (cents == null) return '--';
  return `$${(cents / 100).toFixed(2)}/gal`;
}

function formatMpg(mpg: number | undefined): string {
  if (mpg == null) return '--';
  return `${mpg} MPG`;
}

function formatMiPerKwh(miPerKwh: number | undefined): string {
  if (miPerKwh == null) return '--';
  return `${miPerKwh} mi/kWh`;
}

export function GasComparisonSectionBody() {
  const { getSettings } = useSettings();
  const navigate = useNavigate();
  const [values, setValues] = useState<GasComparisonValues>({
    gasPriceCents: undefined,
    comparisonMpg: undefined,
    defaultMiPerKwh: undefined
  });

  useEffect(() => {
    const load = async () => {
      const result = await getSettings();
      if (!result.success || !result.data) return;

      const { gasPriceCents, comparisonMpg, defaultMiPerKwh } = result.data;
      setValues({ gasPriceCents, comparisonMpg, defaultMiPerKwh });
    };

    load();
  }, [getSettings]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-body-secondary">Average Gas Price</span>
        <span className="text-body font-medium">{formatGasPrice(values.gasPriceCents)}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-body-secondary">Target MPG</span>
        <span className="text-body font-medium">{formatMpg(values.comparisonMpg)}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-body-secondary">Default mi/kWh</span>
        <span className="text-body font-medium">{formatMiPerKwh(values.defaultMiPerKwh)}</span>
      </div>
      <p className="text-body-secondary text-xs italic">
        Used as fallback when a vehicle doesn't have battery capacity and range set
      </p>
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => navigate('/settings/gas-comparison/edit')}>
          Update
        </Button>
      </div>
    </div>
  );
}
