import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import type { EvChargTrackerDb } from '../../src/data/data-types';
import type { BackupFile } from '../../src/pages/settings/settings-types';
import { exportBackup, isBackupOverdue, readBackupFile, restoreBackup } from '../../src/utilities/backupUtils';

const BACKUP_FIXTURE = JSON.parse(
  readFileSync(new URL('../__test_data__/backup-v2.json', import.meta.url), 'utf-8')
) as Record<string, unknown>;

const toFile = (data: unknown): File => new File([JSON.stringify(data)], 'backup.json', { type: 'application/json' });

class MockFileReader {
  onload: ((e: unknown) => void) | null = null;
  onerror: ((e: unknown) => void) | null = null;
  result: string | null = null;

  readAsText(file: File): void {
    file.text().then((text) => {
      this.result = text;
      this.onload?.({ target: { result: text } });
    });
  }
}

class ErrorFileReader {
  onload: ((e: unknown) => void) | null = null;
  onerror: ((e: unknown) => void) | null = null;
  result: string | null = null;

  readAsText(_file: File): void {
    this.onerror?.({});
  }
}

const makeDb = (overrides: Record<string, unknown> = {}) => ({
  verno: 3,
  vehicles: {
    toArray: vi.fn().mockResolvedValue([]),
    clear: vi.fn().mockResolvedValue(undefined),
    bulkAdd: vi.fn().mockResolvedValue(undefined)
  },
  sessions: {
    toArray: vi.fn().mockResolvedValue([]),
    clear: vi.fn().mockResolvedValue(undefined),
    bulkAdd: vi.fn().mockResolvedValue(undefined)
  },
  locations: {
    toArray: vi.fn().mockResolvedValue([]),
    clear: vi.fn().mockResolvedValue(undefined),
    bulkAdd: vi.fn().mockResolvedValue(undefined)
  },
  settings: {
    toArray: vi.fn().mockResolvedValue([]),
    clear: vi.fn().mockResolvedValue(undefined),
    bulkAdd: vi.fn().mockResolvedValue(undefined)
  },
  maintenanceRecords: {
    toArray: vi.fn().mockResolvedValue([]),
    clear: vi.fn().mockResolvedValue(undefined),
    bulkAdd: vi.fn().mockResolvedValue(undefined)
  },
  transaction: vi.fn().mockImplementation(async (_mode: string, _tables: unknown, cb: () => Promise<void>) => cb()),
  ...overrides
});

describe('readBackupFile', () => {
  beforeEach(() => {
    vi.stubGlobal('FileReader', MockFileReader);
  });

  it('returns success for a valid backup file', async () => {
    const result = await readBackupFile(toFile(BACKUP_FIXTURE));
    expect(result.success).toBe(true);
  });

  it('returns failure for invalid JSON', async () => {
    const file = new File(['not valid json!!!'], 'backup.json');
    const result = await readBackupFile(file);
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toMatch(/parse/i);
  });

  it('returns failure when FileReader errors', async () => {
    vi.stubGlobal('FileReader', ErrorFileReader);
    const result = await readBackupFile(toFile(BACKUP_FIXTURE));
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toMatch(/read/i);
  });

  it('returns failure for a non-object root', async () => {
    const result = await readBackupFile(toFile(null));
    expect(result.success).toBe(false);
  });

  it('returns failure when fileVersion is missing', async () => {
    const { fileVersion: _fv, ...rest } = BACKUP_FIXTURE;
    const result = await readBackupFile(toFile(rest));
    expect(result.success).toBe(false);
  });

  it('returns failure when dbVersion is missing', async () => {
    const { dbVersion: _dv, ...rest } = BACKUP_FIXTURE;
    const result = await readBackupFile(toFile(rest));
    expect(result.success).toBe(false);
  });

  it('returns failure when timestamp is missing', async () => {
    const { timestamp: _ts, ...rest } = BACKUP_FIXTURE;
    const result = await readBackupFile(toFile(rest));
    expect(result.success).toBe(false);
  });

  it('returns failure when data array is missing', async () => {
    const { data: _d, ...rest } = BACKUP_FIXTURE;
    const result = await readBackupFile(toFile(rest));
    expect(result.success).toBe(false);
  });

  it('returns failure when a required store is missing', async () => {
    const withoutVehicles = {
      ...BACKUP_FIXTURE,
      data: (BACKUP_FIXTURE.data as Record<string, unknown>[]).filter((s) => s.store !== 'vehicles')
    };
    const result = await readBackupFile(toFile(withoutVehicles));
    expect(result.success).toBe(false);
  });

  it('returns failure for an invalid vehicle record', async () => {
    const broken = {
      ...BACKUP_FIXTURE,
      data: (BACKUP_FIXTURE.data as Record<string, unknown>[]).map((s) =>
        s.store === 'vehicles'
          ? {
              store: 'vehicles',
              records: [{ id: 123, make: 'Ford', model: 'Mach-E', year: 2022, icon: '🚗', createdAt: 0, isActive: 1 }]
            }
          : s
      )
    };
    const result = await readBackupFile(toFile(broken));
    expect(result.success).toBe(false);
  });

  it('returns failure for an invalid location record', async () => {
    const broken = {
      ...BACKUP_FIXTURE,
      data: (BACKUP_FIXTURE.data as Record<string, unknown>[]).map((s) =>
        s.store === 'locations' ? { store: 'locations', records: [{ id: 'loc-1', name: 123 }] } : s
      )
    };
    const result = await readBackupFile(toFile(broken));
    expect(result.success).toBe(false);
  });

  it('returns failure for an invalid session record', async () => {
    const broken = {
      ...BACKUP_FIXTURE,
      data: (BACKUP_FIXTURE.data as Record<string, unknown>[]).map((s) =>
        s.store === 'sessions' ? { store: 'sessions', records: [{ id: 'sess-1', energyKwh: 'not-a-number' }] } : s
      )
    };
    const result = await readBackupFile(toFile(broken));
    expect(result.success).toBe(false);
  });

  it('returns failure when settings key is not "app-settings"', async () => {
    const broken = {
      ...BACKUP_FIXTURE,
      data: (BACKUP_FIXTURE.data as Record<string, unknown>[]).map((s) =>
        s.store === 'settings' ? { store: 'settings', records: [{ key: 'wrong-key', onboardingComplete: true }] } : s
      )
    };
    const result = await readBackupFile(toFile(broken));
    expect(result.success).toBe(false);
  });
});

describe('exportBackup', () => {
  it('returns a BackupFile with all 5 stores including maintenanceRecords', async () => {
    const db = makeDb({
      vehicles: {
        toArray: vi
          .fn()
          .mockResolvedValue([
            { id: 'v1', make: 'Ford', model: 'Mach-E', year: 2022, icon: '🚗', createdAt: 0, isActive: 1 }
          ])
      }
    });
    const result = await exportBackup(db as unknown as EvChargTrackerDb);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(typeof result.data.dbVersion).toBe('number');
    expect(typeof result.data.fileVersion).toBe('number');
    expect(typeof result.data.timestamp).toBe('number');
    expect(Array.isArray(result.data.data)).toBe(true);
    expect(result.data.data).toHaveLength(5);
  });

  it('includes recentSessionsLimit in preferences when provided', async () => {
    const db = makeDb();
    const result = await exportBackup(db as unknown as EvChargTrackerDb, { recentSessionsLimit: 25 });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.preferences).toEqual({ recentSessionsLimit: 25 });
  });

  it('omits preferences when not provided', async () => {
    const db = makeDb();
    const result = await exportBackup(db as unknown as EvChargTrackerDb);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.preferences).toBeUndefined();
  });

  it('returns failure when the db throws', async () => {
    const db = makeDb({
      vehicles: { toArray: vi.fn().mockRejectedValue(new Error('db read error')) }
    });
    const result = await exportBackup(db as unknown as EvChargTrackerDb);
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toMatch(/db read error/);
  });
});

const makeStorage = (initial: Record<string, string> = {}): Storage => {
  const store = { ...initial };
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] ?? null
  } as Storage;
};

describe('restoreBackup', () => {
  it('returns failure when backup dbVersion is newer than db.verno', async () => {
    // Fixture has dbVersion: 2; db.verno: 1 — backup is newer, should fail
    const db = makeDb({ verno: 1 });
    const result = await restoreBackup(db as unknown as EvChargTrackerDb, BACKUP_FIXTURE as unknown as BackupFile, makeStorage());
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toMatch(/newer version/i);
  });

  it('clears all stores and bulk-adds records when versions match', async () => {
    const db = makeDb({ verno: 2 }); // matches fixture dbVersion: 2
    const result = await restoreBackup(db as unknown as EvChargTrackerDb, BACKUP_FIXTURE as unknown as BackupFile, makeStorage());
    expect(result.success).toBe(true);
    expect(db.vehicles.clear).toHaveBeenCalled();
    expect(db.sessions.clear).toHaveBeenCalled();
    expect(db.locations.clear).toHaveBeenCalled();
    expect(db.settings.clear).toHaveBeenCalled();
    expect(db.vehicles.bulkAdd).toHaveBeenCalled();
    expect(db.sessions.bulkAdd).toHaveBeenCalled();
    expect(db.locations.bulkAdd).toHaveBeenCalled();
    expect(db.settings.bulkAdd).toHaveBeenCalled();
  });

  it('succeeds restoring an older backup into a newer db version', async () => {
    // v2 fixture into v3 db — maintenanceRecords missing from backup, restored as empty
    const db = makeDb(); // verno: 3
    const result = await restoreBackup(db as unknown as EvChargTrackerDb, BACKUP_FIXTURE as unknown as BackupFile, makeStorage());
    expect(result.success).toBe(true);
    expect(db.maintenanceRecords.clear).toHaveBeenCalled();
    expect(db.maintenanceRecords.bulkAdd).toHaveBeenCalledWith([]);
  });

  it('returns failure when the transaction throws', async () => {
    const db = makeDb({
      transaction: vi.fn().mockRejectedValue(new Error('transaction failed'))
    });
    const result = await restoreBackup(db as unknown as EvChargTrackerDb, BACKUP_FIXTURE as unknown as BackupFile, makeStorage());
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toMatch(/transaction failed/);
  });

  it('writes recentSessionsLimit to storage when backup includes preferences', async () => {
    const db = makeDb({ verno: 2 });
    const storage = makeStorage();
    const backup = { ...BACKUP_FIXTURE, preferences: { recentSessionsLimit: 25 } } as unknown as BackupFile;
    const result = await restoreBackup(db as unknown as EvChargTrackerDb, backup, storage);
    expect(result.success).toBe(true);
    const stored = JSON.parse(storage.getItem('ev-charge-tracker-preferences') ?? '{}');
    expect(stored.recentSessionsLimit).toBe(25);
  });

  it('does not modify storage when backup has no preferences', async () => {
    const db = makeDb({ verno: 2 });
    const storage = makeStorage({ 'ev-charge-tracker-preferences': JSON.stringify({ recentSessionsLimit: 50 }) });
    const result = await restoreBackup(db as unknown as EvChargTrackerDb, BACKUP_FIXTURE as unknown as BackupFile, storage);
    expect(result.success).toBe(true);
    const stored = JSON.parse(storage.getItem('ev-charge-tracker-preferences') ?? '{}');
    expect(stored.recentSessionsLimit).toBe(50);
  });
});

describe('isBackupOverdue', () => {
  const DAY_MS = 86_400_000;
  const now = 1_000_000_000_000;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true when no backup has ever occurred (reference time is epoch 0)', () => {
    // referenceTime = 0; now - 0 >> any interval
    expect(isBackupOverdue(undefined, undefined, '3d', undefined)).toBe(true);
  });

  it('returns true when configured interval has elapsed with no backup', () => {
    const lastBackupAt = now - 4 * DAY_MS;
    expect(isBackupOverdue(lastBackupAt, undefined, '3d', undefined)).toBe(true);
  });

  it('returns false when configured interval has not elapsed', () => {
    const lastBackupAt = now - 2 * DAY_MS;
    expect(isBackupOverdue(lastBackupAt, undefined, '3d', undefined)).toBe(false);
  });

  it('returns true after 1 day once a notification was pushed and user has not backed up', () => {
    const lastNotificationPushedAt = now - DAY_MS;
    expect(isBackupOverdue(undefined, undefined, '7d', lastNotificationPushedAt)).toBe(true);
  });

  it('returns false before 1 day has passed since notification push', () => {
    const lastNotificationPushedAt = now - DAY_MS / 2;
    expect(isBackupOverdue(undefined, undefined, '7d', lastNotificationPushedAt)).toBe(false);
  });

  it('reverts to configured interval once user backs up after a notification', () => {
    const lastNotificationPushedAt = now - 2 * DAY_MS;
    // backup happened after the notification — daily mode should not apply
    const lastBackupAt = now - DAY_MS / 2;
    // 7d interval has not elapsed since backup, so should be false
    expect(isBackupOverdue(lastBackupAt, undefined, '7d', lastNotificationPushedAt)).toBe(false);
  });

  it('returns true when configured interval elapses after backup resets the cycle', () => {
    const lastNotificationPushedAt = now - 10 * DAY_MS;
    // backup happened after the notification
    const lastBackupAt = now - 8 * DAY_MS;
    // 7d interval has elapsed since backup
    expect(isBackupOverdue(lastBackupAt, undefined, '7d', lastNotificationPushedAt)).toBe(true);
  });

  it('dismissedAt snoozes daily reminder in escalation mode', () => {
    const lastNotificationPushedAt = now - 2 * DAY_MS;
    // user dismissed 12 hours ago — less than 1 day, so not overdue yet
    const dismissedAt = now - DAY_MS / 2;
    expect(isBackupOverdue(undefined, dismissedAt, '7d', lastNotificationPushedAt)).toBe(false);
  });

  it('dismissedAt snooze expires after 1 day in escalation mode', () => {
    const lastNotificationPushedAt = now - 3 * DAY_MS;
    // user dismissed more than 1 day ago
    const dismissedAt = now - DAY_MS - 1;
    expect(isBackupOverdue(undefined, dismissedAt, '7d', lastNotificationPushedAt)).toBe(true);
  });
});
