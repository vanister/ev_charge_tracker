# Cloud Sync Handoff

Handoff from a design discussion about moving the app from offline-only to offline-first with optional accounts and cross-device sync on Cloudflare. No code has been written yet.

## Next Steps

1. Confirm the Cloudflare plugin (`cloudflare@cloudflare`, from `cloudflare/skills`) loaded in this session with `ListPlugins`. Use its Workers, Durable Objects and Wrangler skills while designing.
2. Decide the auth library (see Open Decisions).
3. Write `docs/cloud-sync-design.md` and, after the user confirms the design, `docs/cloud-sync-tasks.md`, following the Design or Plan Mode rules in `AGENTS.md`.

## Current State of the App

- Offline-only PWA. Dexie (IndexedDB) is the only data store (`src/data/db.ts`, schema version 6).
- Record IDs are already string UUIDs. Records have `createdAt` but no `updatedAt` or `deletedAt`.
- Already deployed as a Cloudflare Worker serving static assets (`wrangler.jsonc`, `nodejs_compat` enabled, `@cloudflare/vite-plugin`).
- Existing sync is whole-file and Google-based:
  - `src/utilities/syncUtils.ts` and `src/data/sync-schema.ts` export/import a full backup plus `deviceId`. Importing replaces the database, so concurrent edits are lost.
  - `src/hooks/useOAuth.ts` does Google OAuth on the client and stores tokens in Dexie `systemConfig`. This should be replaced.

## Agreed Direction

### Architecture

- **Local-first:** Dexie stays the source of truth on each device. The UI keeps reading and writing to IndexedDB, and a background sync engine pushes and pulls changes.
- **Accounts are opt-in:** the app works fully offline without signing in.
- **One Worker:** the existing Worker gains `/api/*` routes alongside the SPA. A Worker is one deployed script with many functions; it scales out automatically.

### Storage

- **D1:** global tables (users, auth sessions).
- **Durable Object per user** (SQLite storage): that user's synced data. Gives per-user isolation and writes applied one at a time.
- **R2:** images and other files, if added later. Only metadata goes in the database.
- All three are durable. D1 and Durable Objects have point-in-time recovery for a limited window (about 30 days paid, 7 days free). Long-term backups mean a scheduled export to R2.
- **Size:** about 1 KB per charging session, so a per-user object stays far below its roughly 10 GB limit.

### Sync Model

- Merge record by record, replacing the whole-file `SyncFile` approach.
- **New Dexie version:** add `updatedAt` and `deletedAt` (soft deletes) to every synced table, plus a local outbox of changed records.
- **Push:** send the outbox; the server stamps each record with an increasing version number.
- **Pull:** fetch everything newer than the last version this device has seen, in cursor-paged batches.
- **Conflicts:** last write wins per record. No CRDTs.
- **First sign-in:** upload the existing local data.
- Device-specific config (theme, `systemConfig`) stays local.
- **Triggers:** app start, coming back online, and an interval. The Background Sync API is a Chromium-only bonus.
- Version the API (`/api/v1/sync`).

### Auth and Sessions

- Server-side Google OAuth with a full-page redirect: `/api/auth/google`, then Google, then `/api/auth/callback`, which sets the cookie and redirects to `/`.
- **Session cookie:** httpOnly, Secure, SameSite=Lax. Long-lived (30 to 90 days) with expiry extended on each sync. No tokens in IndexedDB or localStorage.
- **Client signed-in state:** the client caches a "signed in as" record (user ID, email, name) in Dexie so the UI shows it offline. It refreshes from `/api/me`.
- **Expired session:** a 401 marks the account "needs re-auth". The outbox is kept and a banner asks the user to sign in again.
- **CSRF:** SameSite=Lax plus a required JSON content type or custom header on endpoints that change data.
- **Sign-out:** delete the session on the server, then ask the user whether to keep or wipe local data.
- **Account switching:** tie local data to the user ID, and merge or keep separate databases when a different user signs in.
- The server derives the user ID from the session only. Validate payloads with the existing Zod schemas. Rate-limit the auth and sync endpoints.

### PWA Gotchas

- Add `navigateFallbackDenylist: [/^\/api\//]` to the vite-plugin-pwa config, or the OAuth callback breaks. Never cache `/api/*`.
- iOS installed PWAs have a separate cookie jar and unreliable popups. Use a same-window redirect and test on a real device early.

### Scaling Guardrails (Cheap Now, Defer the Rest)

- Route every Durable Object lookup through one pure function such as `getUserStore(env, userId)`, so the data can be split later by changing one place. Keep it a calculation, not a lookup.
- **Hardest thing to change later:** what one Durable Object represents. If shared tenants (households, fleets) are ever likely, decide user vs tenant before building.
- **Deferred:** sharding a user across objects, directory objects, archiving cold data to R2, Hyperdrive with Postgres.

### Images (If Added)

- Resize and compress to WebP on the device first.
- Upload via presigned URLs into a private R2 bucket. Store the Blob in Dexie for offline use.
- Use a separate upload queue and download lazily.
- Soft-delete the metadata, and have a cron Worker clean up R2.

## Open Decisions

- **Auth library:**
  - **Hand-roll with `arctic`** plus a D1 session table: recommended if Google stays the only provider.
  - **Better Auth:** an open-source library run in the Worker, not a Cloudflare product. Choose it if email/password, passkeys or more providers are likely.
  - Cloudflare Access doesn't fit consumer sign-in.
- **Durable Object scope:** per user (recommended for now) or per tenant.
- **End-to-end encryption:** optional; recovering lost keys is a real UX cost. Leaning toward server-side encryption plus per-user isolation.
- **Sign-out on shared devices:** whether to wipe local data by default.

## Suggested Phases

1. Dexie schema migration (`updatedAt`, `deletedAt`, outbox)
2. Worker API, auth and sign-in UI
3. Durable Object storage with push/pull endpoints
4. Client sync engine and retirement of the old `SyncFile` and `useOAuth` flow
5. Optional: live updates over WebSockets, images in R2
