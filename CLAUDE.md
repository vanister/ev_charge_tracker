# EV Charge Tracker

Vite + TypeScript + React 19 PWA for tracking EV charging sessions.
Mobile-focused, fully offline with IndexedDB via Dexie.js. Deployed to Cloudflare via Wrangler.

## Docs
- [Design outline](./docs/design-outline.md)
- [Technical architecture](./docs/technical-design.md)
- [Outstanding tasks](./docs/tasks.md)

## Stack
- React 19, TypeScript, Vite, Tailwind CSS, clsx
- Dexie.js (IndexedDB), date-fns, Cloudflare/Wrangler

## Key Conventions
- Use `/refactor` to clean up code to project standards
- Use `/review` before considering anything done
- Return `Result<T>` instead of throwing exceptions
- No default exports, no barrel files