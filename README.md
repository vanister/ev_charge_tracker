# EV Charge Tracker

An offline, mobile-optimized Progressive Web App for tracking electric vehicle charging sessions. All data is stored locally on your device using IndexedDB. No internet connection required after installation.

**Live app**: [EV Charge Tracker](https://evchargetracker.vanister.workers.dev)

Sample restorable dataset: [sample-v5-restorable-backup.json](./data/sample-v5-restorable-backup.json)

## Features

- Offline-first -- works completely without an internet connection
- Track charging sessions with energy usage, costs, and locations
- Manage multiple vehicles with custom names and icons
- Maintenance record tracking per vehicle
- Dashboard with stats, charts, and gas cost comparison
- Filterable session list with persistent filter state
- Backup and restore data to JSON with configurable reminders
- Dark/light/system theme support
- Installable as a standalone app from the browser
- Auto-update notification via service worker

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) + [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [Dexie.js](https://dexie.org/) (IndexedDB)
- [Zod](https://zod.dev/) (schema validation)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) (deployment)

## Getting Started

### Prerequisites

- Node.js 20+ and npm

### Development

```bash
git clone https://github.com/vanister/ev_charge_tracker.git
cd ev_charge_tracker
npm ci
npm run dev
```

### Build and Deploy

```bash
npm run build
npm run preview   # local preview (requires Wrangler)
npm run deploy    # deploy to Cloudflare Workers
```

## Documentation

See the [docs/](docs/) directory for detailed design and architecture information:

- [Design Outline](docs/design-outline.md) -- high-level design, data model, and app flow
- [Technical Architecture](docs/technical-design.md) -- detailed technical specifications
- [Architecture Contracts](architecture.md) -- shared contracts, patterns, and hook APIs
- [Color Palette](docs/color-palette.md) -- theme colors and design tokens
- [Gas Comparison Design](docs/gas-comparison-design.md) -- gas cost comparison feature

## Contributing

This is a personal project, but suggestions and feedback are welcome. Feel free to open an issue or submit a pull request.

## License

MIT License -- see [LICENSE](LICENSE) file for details.
