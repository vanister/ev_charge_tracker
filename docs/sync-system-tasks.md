📋 Phase 1: Data Sync Implementation Checklist
🔐 1. Auth Module (PKCE Flow)
Goal: Securely obtain an access token without a backend.
 * [ ] Generate PKCE Pair: Implement utility to create a random code_verifier and a SHA-256 code_challenge.
 * [ ] Authorization Request: Construct the URL to redirect the user to the provider (Google/Apple) login.
 * [ ] Callback Handler: Create a listener (or a specific route) to capture the code from the URL after redirect.
 * [ ] Token Exchange: Exchange the code + code_verifier for an access_token and refresh_token.
 * [ ] Token Storage: Securely save the refresh_token in a dedicated IndexedDB table (e.g., system_config).
💾 2. Export/Import Module
Goal: Translate your local database into a transportable format.
 * [ ] IDB Reader: Write a function to iterate through all Object Stores and pull data into a single object.
 * [ ] Schema Versioning: Add a version and lastUpdated key to the export object.
 * [ ] Data Compression: (Optional but recommended) Implement CompressionStream to Gzip the JSON string.
 * [ ] IDB Writer: Write the "Restore" function that clears local stores and populates them from a sync file.
🚀 3. Transport Module
Goal: Handle the actual communication with the Cloud API.
 * [ ] Connectivity Guard: Logic to check navigator.onLine before attempting any network calls.
 * [ ] Metadata Fetcher: Fetch only the file headers from the cloud to check the remote timestamp.
 * [ ] Upload Logic: Implement the PUT/POST request to save the data blob to the appDataFolder.
 * [ ] Download Logic: Implement the GET request to pull the sync file when the remote version is newer.
🖥️ 4. UI & Orchestration
Goal: Manage the user experience and conflict resolution.
 * [ ] Sync Trigger: Add the "Sync Now" button and disable it during active processes.
 * [ ] Conflict Resolver UI: Create a simple modal/alert for when the Cloud data is newer than Local data.
 * [ ] Progress Indicators: Implement "Toast" notifications or a status bar (e.g., “Syncing...”, “Success!”, “Offline”).
 * [ ] Last Sync Label: Display the "Last synced at [Time]" text in your settings or profile view.
