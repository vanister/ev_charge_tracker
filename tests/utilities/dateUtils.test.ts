import { describe, it, expect } from 'vitest';
import {
  detectIs24Hour,
  resolveDatePattern,
  resolveTimePattern,
  formatDate,
  formatDateTime,
  formatTime,
  formatDateGroupHeader,
  getDateGroupKey
} from '../../src/utilities/dateUtils';

// Fixed timestamp: Saturday, April 11, 2026 13:30:45 local time
const SAMPLE = new Date(2026, 3, 11, 13, 30, 45).getTime();

describe('detectIs24Hour', () => {
  it('matches what Intl resolves for the default locale', () => {
    const result = detectIs24Hour();
    const resolved = new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions();
    const expected = resolved.hourCycle === 'h23' || resolved.hourCycle === 'h24';
    expect(result).toBe(expected);
  });
});

describe('resolveDatePattern', () => {
  it('returns medium pattern by default', () => {
    expect(resolveDatePattern()).toBe('MMM dd, yyyy');
    expect(resolveDatePattern('medium')).toBe('MMM dd, yyyy');
  });

  it('returns US short pattern', () => {
    expect(resolveDatePattern('us-short')).toBe('MM/dd/yyyy');
  });

  it('returns EU short pattern', () => {
    expect(resolveDatePattern('eu-short')).toBe('dd/MM/yyyy');
  });

  it('returns ISO pattern', () => {
    expect(resolveDatePattern('iso')).toBe('yyyy-MM-dd');
  });
});

describe('resolveTimePattern', () => {
  it('returns 12-hour pattern', () => {
    expect(resolveTimePattern('12h')).toBe('h:mm a');
  });

  it('returns 24-hour pattern', () => {
    expect(resolveTimePattern('24h')).toBe('HH:mm');
  });

  it('returns 24-hour with seconds pattern', () => {
    expect(resolveTimePattern('24h-seconds')).toBe('HH:mm:ss');
  });

  it('auto falls back to Intl detection', () => {
    const pattern = resolveTimePattern('auto');
    expect(pattern === 'HH:mm' || pattern === 'h:mm a').toBe(true);
  });

  it('undefined falls back to same as auto', () => {
    expect(resolveTimePattern()).toBe(resolveTimePattern('auto'));
  });
});

describe('formatDate', () => {
  it('uses medium pattern by default', () => {
    expect(formatDate(SAMPLE)).toBe('Apr 11, 2026');
  });

  it('respects dateFormat preference', () => {
    expect(formatDate(SAMPLE, { dateFormat: 'iso' })).toBe('2026-04-11');
    expect(formatDate(SAMPLE, { dateFormat: 'us-short' })).toBe('04/11/2026');
    expect(formatDate(SAMPLE, { dateFormat: 'eu-short' })).toBe('11/04/2026');
  });

  it('still accepts a raw format string for backwards compatibility', () => {
    expect(formatDate(SAMPLE, 'EEEE, MMM dd, yyyy')).toBe('Saturday, Apr 11, 2026');
  });
});

describe('formatDateTime', () => {
  it('renders date with explicit 24h time preference', () => {
    expect(formatDateTime(SAMPLE, { timeFormat: '24h', dateFormat: 'medium' })).toBe('Apr 11, 2026 13:30');
  });

  it('renders date with explicit 12h time preference', () => {
    expect(formatDateTime(SAMPLE, { timeFormat: '12h', dateFormat: 'medium' })).toBe('Apr 11, 2026 1:30 PM');
  });

  it('renders combined iso date with 24h-seconds', () => {
    expect(formatDateTime(SAMPLE, { timeFormat: '24h-seconds', dateFormat: 'iso' })).toBe('2026-04-11 13:30:45');
  });
});

describe('formatTime', () => {
  it('renders 12h time', () => {
    expect(formatTime(SAMPLE, { timeFormat: '12h' })).toBe('1:30 PM');
  });

  it('renders 24h time', () => {
    expect(formatTime(SAMPLE, { timeFormat: '24h' })).toBe('13:30');
  });

  it('renders 24h time with seconds', () => {
    expect(formatTime(SAMPLE, { timeFormat: '24h-seconds' })).toBe('13:30:45');
  });
});

describe('formatDateGroupHeader', () => {
  it('prepends weekday to resolved date pattern', () => {
    expect(formatDateGroupHeader(SAMPLE, { dateFormat: 'medium' })).toBe('Saturday, Apr 11, 2026');
  });

  it('uses iso date pattern when configured', () => {
    expect(formatDateGroupHeader(SAMPLE, { dateFormat: 'iso' })).toBe('Saturday, 2026-04-11');
  });
});

describe('getDateGroupKey', () => {
  it('produces a stable ISO date key regardless of preferences', () => {
    expect(getDateGroupKey(SAMPLE)).toBe('2026-04-11');
  });
});
