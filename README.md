# EV Charge Tracker

A fully offline Progressive Web App (PWA) for tracking electric vehicle charging sessions. All data is stored locally on your device using IndexedDB—no internet connection required after installation.

## Features

- **📱 Offline-First**: Works completely without an internet connection
- **🔋 Track Charging Sessions**: Log energy usage, costs, and locations
- **🚗 Multiple Vehicles**: Manage multiple EVs with custom names and icons
- **📍 Location Management**: Track charging at Home, Work, DC Fast Chargers, or custom locations
- **📊 Analytics**: View charging history and statistics (coming soon)
- **🌓 Dark Mode**: Full dark/light theme support with smooth transitions
- **💾 Local Storage**: All data stays on your device, no cloud sync
- **📲 Install as App**: Install directly from your browser, no app store needed

## Technology Stack

- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[React 19](https://react.dev/)** - UI framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Dexie.js](https://dexie.org/)** - IndexedDB wrapper with React hooks
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[React Router](https://reactrouter.com/)** - Client-side routing
- **[date-fns](https://date-fns.org/)** - Date utilities
- **[Vite PWA Plugin](https://vite-pwa-org.netlify.app/)** - Service worker generation

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/vanister/ev_charge_tracker.git
cd ev_charge_tracker

# Install dependencies
npm install

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
├── components/       # Reusable UI components
│   ├── Button.tsx
│   ├── Icon.tsx
│   ├── Layout.tsx
│   └── ...
├── contexts/         # React contexts
│   ├── AppInitializationContext.ts
│   ├── DatabaseContext.ts
│   └── ThemeContext.ts
├── data/            # Database and data layer
│   ├── db.ts        # Dexie schema
│   ├── data-types.ts
│   └── constants.ts
├── hooks/           # Custom React hooks
│   ├── useAppInitialization.ts
│   ├── useDatabase.ts
│   ├── useVehicles.ts
│   ├── useSessions.ts
│   ├── useLocations.ts
│   └── useSettings.ts
├── pages/           # Page components
│   ├── Dashboard.tsx
│   ├── ErrorPage.tsx
│   └── onboarding/
├── providers/       # Context providers
│   ├── AppInitializationProvider.tsx
│   ├── DatabaseProvider.tsx
│   └── ThemeProvider.tsx
├── types/           # TypeScript types
├── utilities/       # Utility functions
└── App.tsx          # Main app component
```

## Development Status

### ✅ Completed

- Setup & Dependencies
- Database schema with Dexie.js
- Core data hooks (CRUD operations)
- Onboarding flow (3-step wizard)
- Theme system with dark/light mode
- App initialization & routing structure
- PWA configuration

### 🚧 In Progress

- Dashboard page
- Session logging and management
- Vehicle management UI
- Settings page
- Charts and analytics
- PWA icons and installation prompts

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
