import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import type { EvChargTrackerDb } from '../../src/data/data-types';
import type { BackupFile } from '../../src/pages/settings/settings-types';
import { exportBackup, readBackupFile, restoreBackup } from '../../src/utilities/backupUtils';

const BACKUP_FIXTURE = JSON.parse(
  readFileSync(new URL('../__test_data__/backup-v2.json', import.meta.url), 'utf-8')
) as Record<string, unknown>;

const toFile = (data: unknown): File =>
  new File([JSON.stringify(data)], 'backup.json', { type: 'application/json' });

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
  verno: 2,
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
  transaction: vi.fn().mockImplementation(
    async (_mode: string, _tables: unknown, cb: () => Promise<void>) => cb()
  ),
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
      data: (BACKUP_FIXTURE.data as Record<string, unknown>[]).filter(
        (s) => s.store !== 'vehicles'
      )
    };
    const result = await readBackupFile(toFile(withoutVehicles));
    expect(result.success).toBe(false);
  });

  it('returns failure for an invalid vehicle record', async () => {
    const broken = {
      ...BACKUP_FIXTURE,
      data: (BACKUP_FIXTURE.data as Record<string, unknown>[]).map((s) =>
        s.store === 'vehicles'
          ? { store: 'vehicles', records: [{ id: 123, make: 'Ford', model: 'Mach-E', year: 2022, icon: '🚗', createdAt: 0, isActive: 1 }] }
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
        s.store === 'locations'
          ? { store: 'locations', records: [{ id: 'loc-1', name: 123 }] }
          : s
      )
    };
    const result = await readBackupFile(toFile(broken));
    expect(result.success).toBe(false);
  });

  it('returns failure for an invalid session record', async () => {
    const broken = {
      ...BACKUP_FIXTURE,
      data: (BACKUP_FIXTURE.data as Record<string, unknown>[]).map((s) =>
        s.store === 'sessions'
          ? { store: 'sessions', records: [{ id: 'sess-1', energyKwh: 'not-a-number' }] }
          : s
      )
    };
    const result = await readBackupFile(toFile(broken));
    expect(result.success).toBe(false);
  });

  it('returns failure when settings key is not "app-settings"', async () => {
    const broken = {
      ...BACKUP_FIXTURE,
      data: (BACKUP_FIXTURE.data as Record<string, unknown>[]).map((s) =>
        s.store === 'settings'
          ? { store: 'settings', records: [{ key: 'wrong-key', onboardingComplete: true }] }
          : s
      )
    };
    const result = await readBackupFile(toFile(broken));
    expect(result.success).toBe(false);
  });
});

describe('exportBackup', () => {
  it('returns a BackupFile with the correct shape', async () => {
    const db = makeDb({
      vehicles: {
        toArray: vi.fn().mockResolvedValue([
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
    expect(result.data.data).toHaveLength(4);
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

describe('restoreBackup', () => {
  it('returns failure when backup dbVersion does not match db.verno', async () => {
    // Fixture has dbVersion: 2; db.verno: 1 — mismatch
    const db = makeDb({ verno: 1 });
    const result = await restoreBackup(db as unknown as EvChargTrackerDb, BACKUP_FIXTURE as unknown as BackupFile);
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toMatch(/version/i);
  });

  it('clears all stores and bulk-adds records on version match', async () => {
    const db = makeDb(); // verno: 2 matches fixture dbVersion: 2
    const result = await restoreBackup(db as unknown as EvChargTrackerDb, BACKUP_FIXTURE as unknown as BackupFile);
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

  it('returns failure when the transaction throws', async () => {
    const db = makeDb({
      transaction: vi.fn().mockRejectedValue(new Error('transaction failed'))
    });
    const result = await restoreBackup(db as unknown as EvChargTrackerDb, BACKUP_FIXTURE as unknown as BackupFile);
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toMatch(/transaction failed/);
  });
});
