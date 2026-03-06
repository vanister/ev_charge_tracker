# EV Charge Tracker - Implementation Tasks

## Progress Summary

- **Phase 1 - Setup**: ✅ Complete (4/4)
- **Phase 2 - Data Layer**: ✅ Complete (4/4)
- **Phase 3 - Context Providers & Hooks**: ✅ Complete (11/11)
- **Phase 4 - Routing & Pages**: ✅ Complete (9/9)
- **Phase 5 - UI Components**: 🚧 In Progress (1/2)
- **Phase 6 - Tech Debt / Cleanup**: ✅ Complete (6/6)
- **Phase 7 - PWA Features**: ✅ Complete (4/4)
- **Phase 8 - Business Logic & Testing**: 🚧 In Progress (4/5)
- **Phase 9 - User Preferences**: ✅ Complete (5/5)
- **Phase 10 - Export and Restore**: ❌ Not Started (0/4)

**Overall Progress**: 48/56 tasks complete (86%)

---

## TODO

### Phase 5 - UI Components
- [ ] 2. Implement charts with Recharts
  - Create energy usage by location chart and timeline chart for dashboard
  - Recharts is installed but not yet used

### Phase 8 - Business Logic & Testing
- [ ] 4. Test offline functionality
  - Verify all features work without network, test service worker caching

### Phase 10 - Export and Restore
- [ ] 1. Add an export and restore section to the settings page
- [ ] 2. Export the entire dexie stores out into json including 
  - version number 
  - Dexie stores that match the the schema defined in the app
- [ ] 3. Strict restore of matching database version in the app to the backup file
- [ ] 4. Dangerously overwrite the existing dexie db woth the backup file

### Post-MVP
- [ ] 1. Support vehicle image upload
  - Allow users to upload a custom image for their vehicle instead of the default 🚗 emoji
  - Store image reference and display in VehicleItem and other vehicle displays
- [ ] 2. Sync ability using users storage accounts
  - iCloud, Drive, OneDrive, etc.

---

## COMPLETED

### Phase 1 - Setup Phase
- [x] 1. Initialize Vite React TypeScript project
- [x] 2. Install core dependencies
- [x] 3. Set up Tailwind CSS v4
- [x] 4. Install and configure Vite PWA plugin

### Phase 2 - Data Layer
- [x] 1. Create TypeScript types and interfaces
- [x] 2. Set up Dexie database schema
- [x] 3. Create constants file
- [x] 4. Create utility functions

### Phase 3 - Context Providers & Hooks
- [x] 1. Implement DatabaseProvider context
- [x] 2. Implement AppInitializationProvider context
- [x] 3. Implement useDatabase hook
- [x] 4. Implement useAppInitialization hook
- [x] 5. Implement useSettings hook
- [x] 6. Implement useVehicles hook
- [x] 7. Implement useLocations hook
- [x] 8. Implement useSessions hook
- [x] 9. Implement useStats hook
- [x] 10. Implement ThemeProvider and useTheme hook
- [x] 11. Implement useImmerState hook

### Phase 4 - Routing & Pages
- [x] 1. Set up React Router structure
- [x] 2. Create Onboarding flow pages
- [x] 3. Build Layout
- [x] 4. Build SessionsList page
- [x] 5. Build SessionDetails component
- [x] 6. Build VehiclesList page
- [x] 7. Build VehicleDetails component
- [x] 8. Build Settings page
- [x] 9. Build Dashboard page

### Phase 5 - UI Components
- [x] 1. Create reusable UI components

### Phase 6 - Tech Debt / Cleanup
- [x] 1. Organize types
- [x] 2. Use useImmerState hook
- [x] 3. Specific error pages
- [x] 4. Clean up helpers
- [x] 5. Standardize page max-width
- [x] 6. Use async/await

### Phase 7 - PWA Features
- [x] 1. Generate PWA icons
- [x] 2. Configure PWA manifest
- [x] 3. Implement persistent storage request
- [x] 4. Add service worker update notification

### Phase 8 - Business Logic & Testing
- [x] 1. Implement app initialization flow
- [x] 2. Add vehicle deletion safety checks
- [x] 3. Add location deletion safety checks
- [x] 5. Build and deploy to static hosting

### Phase 9 - User Preferences
- [x] 1. Add USER_PREFERENCES_STORAGE_KEY constant
- [x] 2. Create useUserPreferences hook
- [x] 3. Persist last vehicle and location on session save
- [x] 4. Wire recentSessionsLimit preference into useStats
- [x] 5. Add a "Preferences" section to the Settings page