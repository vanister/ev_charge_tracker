# EV Charge Tracker

> **Beta** — Live at [evchargetracker.vanister.workers.dev](https://evchargetracker.vanister.workers.dev)

An offline, mobile-optimized, Progressive Web App (PWA) for tracking electric vehicle charging sessions. All data is stored locally on your device using IndexedDB. No internet connection required after installation.

## Features

- **📱 Offline-First**: Works completely without an internet connection
- **🔋 Track Charging Sessions**: Log energy usage, costs, and locations
- **🚗 Multiple Vehicles**: Manage multiple EVs with custom names and icons
- **📍 Location Management**: Track charging at Home, Work, DC Fast Chargers, or custom locations
- **📊 Dashboard & Stats**: View total kWh, average rate, session count, and recent sessions
- **📈 Charts & Analytics**: Bar chart of charge sessions over time (7d / 30d / 90d) with custom tooltips
- **🔍 Filterable Sessions**: Collapsible filter panel with persistent open/closed state
- **💾 Backup & Restore**: Export all data to JSON and restore from backup with version validation
- **⚙️ Preferences**: Configure recent session limit and other per-user settings
- **🌓 Dark Mode**: Full dark/light theme support with smooth transitions
- **🗄️ Local Storage**: All data stays on your device, no cloud sync
- **📲 Install as App**: Install directly from your browser, no app store needed
- **🔔 Auto-Update**: Service worker update notification with one-tap reload

## Technology Stack

- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[React 19](https://react.dev/)** - UI framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Dexie.js](https://dexie.org/)** - IndexedDB wrapper for offline-first storage
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first styling
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[React Router v7](https://reactrouter.com/)** - Client-side routing
- **[Immer](https://immerjs.github.io/immer/)** - Immutable state updates
- **[date-fns](https://date-fns.org/)** - Date utilities
- **[Vite PWA Plugin](https://vite-pwa-org.netlify.app/)** - Service worker generation

## Getting Started

### Prerequisites

- Node.js 20+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/vanister/ev_charge_tracker.git
cd ev_charge_tracker

# Install dependencies
npm ci

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build for Production

```bash
# Build the app
npm run build

# Preview production build locally
npm run preview
```

The production build will be in the `dist/` directory, ready to deploy to any static hosting service.

## Project Structure

```
src/
├── components/       # Reusable UI components (Button, EmptyState, Icon, FormInput, etc.)
├── contexts/         # React context definitions
├── data/             # Database schema, types, constants, repositories
├── helpers/          # Domain helpers (session, stats)
├── hooks/            # Custom React hooks
├── pages/            # Page components
│   ├── dashboard/    # Dashboard, stats cards, recent sessions
│   ├── layout/       # App shell (header, nav, drawer)
│   ├── onboarding/   # 3-step onboarding wizard
│   ├── sessions/     # Session list, form, details
│   ├── settings/     # Settings, locations management
│   ├── vehicles/     # Vehicle list, form, details
│   └── ...
├── providers/        # Context providers
├── types/            # Shared TypeScript types
├── utilities/        # Pure utility functions
└── App.tsx           # Root component and router
```

## Development Status (100% complete — 54/54 core tasks)

### ✅ Completed

- Setup & dependencies
- Database schema with Dexie.js
- Core data hooks (vehicles, sessions, locations, settings, stats, backup, preferences)
- App initialization, routing, and layout shell
- Onboarding flow (3-step wizard)
- Theme system (dark/light/system mode)
- Session logging and management (list, add, edit, delete, filterable with collapsible panel)
- Vehicle management (list, add, edit, delete with safety checks)
- Settings page with location management, preferences, storage info, and backup/restore
- Dashboard page with stats cards, recent sessions, and charge sessions bar chart (Recharts)
- PWA configuration, icons, and persistent storage request
- Service worker update notification
- Export/restore with JSON backup and database version validation
- Build and deploy to static hosting

See [docs/tasks.md](docs/tasks.md) for the complete development roadmap.

## Documentation

- **[Design Outline](docs/design-outline.md)** - High-level design and architecture
- **[Technical Design](docs/technical-design.md)** - Detailed technical specifications
- **[Tasks](docs/tasks.md)** - Development roadmap and task tracking
- **[Color Palette](docs/color-palette.md)** - Theme colors and design tokens

## Contributing

This is a personal project, but suggestions and feedback are welcome! Feel free to open an issue or submit a pull request.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Why This App?

Traditional EV charging tracking apps require:
- App store approvals and fees
- Cloud infrastructure and maintenance
- User accounts and authentication
- Internet connectivity

This PWA approach offers:
- Direct distribution via any web hosting
- Zero backend costs
- No user data collection
- Works 100% offline
- Install directly from browser
- Automatic updates via service worker

Perfect for EV owners who want a simple, private way to track their charging history without the overhead of a traditional app.