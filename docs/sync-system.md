˝# High-Level Design: Data Sync System

## 1. Objective
To provide a manual, secure synchronization of the app's IndexedDB state to the user's personal cloud storage (Google Drive/iCloud), ensuring data portability and backup without a centralized backend.

## 2. Technical Stack
 * Local Storage: IndexedDB (Primary Source of Truth).
 * Auth: OAuth 2.0 with PKCE (Proof Key for Code Exchange).
 * Transport: Fetch API (Standard REST calls to Cloud Provider).
 * Serialization: JSON (Structured Clone of IDB stores).

## 3. The Sync Workflow
### Step A: Session Initiation
Since the PWA is "pure offline," the app must first verify it can talk to the cloud.
 * Check Online Status: window.navigator.onLine.
 * Auth Handshake: * If no token exists: Open a popup for OAuth PKCE login.
   * If token exists: Attempt a "silent" refresh using the stored refresh_token.
   * Security Note: Store the refresh_token in a restricted IndexedDB table, never in LocalStorage.

### Step B: The "Diff" Check (Metadata First)
Before moving the entire database, the system performs a lightweight "head" request.
 * Request the metadata for the file app_backup.json from the cloud.
 * Compare the remote_modified_at timestamp with the local_last_sync timestamp stored in IndexedDB.

### Step C: Resolution Logic
| Condition      | Logic                        | Action                                                   |
| -------------- | ---------------------------- | -------------------------------------------------------- |
| No Remote File | Local is the only truth.     | Upload immediately.                                      |
| Local > Remote | Local has newer changes.     | Upload (Overwrite remote).                               |
| Remote > Local | Cloud was updated elsewhere. | Prompt User: "Download from Cloud" or "Overwrite Cloud". |
| Equal          | Everything is current.       | Show "Up to Date" status.                                |

## 4. Data Serialization Strategy
To sync the data, we must convert the multi-table IndexedDB into a single transportable format.
 * Extraction: Iterate through all IndexedDB Object Stores.
 * Wrapping: Create a "Sync Envelope":
   {
  "metadata": {
    "version": "1.0",
    "timestamp": 174123456789,
    "deviceId": "user-chrome-mobile"
  },
  "payload": {
    "settings": [...],
    "tasks": [...],
    "profile": {...}
  }
}

 * Compression: Use the browser's native CompressionStream('gzip') to reduce the JSON size before transmission.

## 5. Security & Safety
 * Provider Scopes: Use the most restrictive scope possible (e.g., drive.appdata for Google Drive). This ensures your app cannot see the user's other files.
 * Atomic Writes: Cloud providers generally handle file updates atomically. The old backup is only replaced once the new upload is 100% complete.
 * Rate Limiting: Since this is a manual trigger, the app should disable the "Sync" button while a process is in flight to prevent duplicate requests.

## 6. Implementation Milestones
 * Auth Module: Implement the PKCE flow and token management.
 * Export/Import Module: Logic to read all IDB stores into a JSON blob and vice-versa.
 * Transport Module: The fetch logic to PUT/GET the file from the cloud provider.
 * UI Feedback: Simple progress indicators (e.g., "Connecting...", "Checking for updates...", "Sync Complete").
