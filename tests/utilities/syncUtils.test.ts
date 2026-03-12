import { describe, it, expect } from 'vitest';
import { buildSyncFile, parseSyncFile } from '../../src/utilities/syncUtils';
import { BACKUP_FILE_VERSION, SYNC_FILE_VERSION } from '../../src/data/constants';
import type { BackupFile } from '../../src/pages/settings/settings-types';

const VALID_BACKUP: BackupFile = {
  dbVersion: 2,
  fileVersion: BACKUP_FILE_VERSION,
  timestamp: 1700000000000,
  data: [
    { store: 'vehicles', records: [] },
    { store: 'sessions', records: [] },
    { store: 'locations', records: [] },
    { store: 'settings', records: [] }
  ]
};

describe('buildSyncFile', () => {
  it('attaches the provided deviceId', () => {
    const result = buildSyncFile(VALID_BACKUP, 'device-abc');
    expect(result.deviceId).toBe('device-abc');
  });

  it('sets fileVersion to SYNC_FILE_VERSION', () => {
    const result = buildSyncFile(VALID_BACKUP, 'device-abc');
    expect(result.fileVersion).toBe(SYNC_FILE_VERSION);
  });

  it('preserves all original backup fields', () => {
    const result = buildSyncFile(VALID_BACKUP, 'device-abc');
    expect(result.dbVersion).toBe(VALID_BACKUP.dbVersion);
    expect(result.timestamp).toBe(VALID_BACKUP.timestamp);
    expect(result.data).toBe(VALID_BACKUP.data);
  });

  it('does not mutate the original backup', () => {
    buildSyncFile(VALID_BACKUP, 'device-abc');
    expect(VALID_BACKUP.deviceId).toBeUndefined();
  });
});

describe('parseSyncFile', () => {
  it('returns success for a valid sync file', () => {
    const raw = { ...VALID_BACKUP, deviceId: 'device-abc' };
    const result = parseSyncFile(raw);
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.data.deviceId).toBe('device-abc');
  });

  it('returns failure when deviceId is missing', () => {
    const raw = { ...VALID_BACKUP };
    const result = parseSyncFile(raw);
    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }
    expect(result.error).toMatch(/Invalid sync file at "deviceId"/);
  });

  it('returns failure when deviceId is an empty string', () => {
    const raw = { ...VALID_BACKUP, deviceId: '' };
    const result = parseSyncFile(raw);
    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }
    expect(result.error).toMatch(/Invalid sync file at "deviceId"/);
  });

  it('returns failure when required schema fields are missing', () => {
    const raw = { deviceId: 'device-abc' };
    const result = parseSyncFile(raw);
    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }
    expect(result.error).toMatch(/Invalid sync file at/);
  });

  it('returns failure when data array has wrong length', () => {
    const raw = { ...VALID_BACKUP, deviceId: 'device-abc', data: [] };
    const result = parseSyncFile(raw);
    expect(result.success).toBe(false);
  });

  it('returns failure for null input', () => {
    const result = parseSyncFile(null);
    expect(result.success).toBe(false);
  });
});
