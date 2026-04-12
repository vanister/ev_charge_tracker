import { describe, it, expect } from 'vitest';
import {
  detectIs24Hour,
  formatDate,
  formatDateTime,
  formatTime,
  getDateGroupKey
} from '../../src/utilities/dateUtils';

// Fixed timestamp: Saturday, April 11, 2026 13:30 local time
const SAMPLE = new Date(2026, 3, 11, 13, 30).getTime();

describe('detectIs24Hour', () => {
  it('returns a boolean matching the runtime default hour cycle', () => {
    const result = detectIs24Hour();
    expect(typeof result).toBe('boolean');
    const resolved = new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions();
    const expected = resolved.hourCycle === 'h23' || resolved.hourCycle === 'h24';
    expect(result).toBe(expected);
  });
});

describe('formatDate', () => {
  it('uses medium pattern by default', () => {
    expect(formatDate(SAMPLE)).toBe('Apr 11, 2026');
  });

  it('honors a custom format string override', () => {
    expect(formatDate(SAMPLE, 'EEEE, MMM dd, yyyy')).toBe('Saturday, Apr 11, 2026');
  });
});

describe('formatDateTime', () => {
  it('renders date with the locale-resolved time pattern', () => {
    // Test environment is Node with default en-US; time pattern resolves to 12-hour.
    // In a 24h locale this would be "Apr 11, 2026 13:30".
    const result = formatDateTime(SAMPLE);
    const is24h = /\d{2}:\d{2}$/.test(result) && !/[AP]M$/.test(result);
    if (is24h) {
      expect(result).toBe('Apr 11, 2026 13:30');
      return;
    }
    expect(result).toBe('Apr 11, 2026 1:30 PM');
  });
});

describe('formatTime', () => {
  it('matches the locale-resolved time pattern', () => {
    const result = formatTime(SAMPLE);
    expect(result === '1:30 PM' || result === '13:30').toBe(true);
  });
});

describe('getDateGroupKey', () => {
  it('produces a stable ISO date key regardless of locale', () => {
    expect(getDateGroupKey(SAMPLE)).toBe('2026-04-11');
  });
});
