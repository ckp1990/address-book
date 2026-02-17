# Firebase Setup Guide

To use this application, you need to create a free Firebase project.

## 1. Create a Firebase Project
1.  Go to [console.firebase.google.com](https://console.firebase.google.com/).
2.  Click **"Add project"**.
3.  Give it a name (e.g., "Address Label Printer").
4.  Disable Google Analytics (not needed).
5.  Click **"Create project"**.

## 2. Enable Authentication
1.  In your project dashboard, click **"Build"** -> **"Authentication"** on the left menu.
2.  Click **"Get started"**.
3.  Select the **"Sign-in method"** tab.
4.  Click **"Email/Password"**.
5.  **Enable** the "Email/Password" toggle.
6.  (Optional) **Enable** "Email link (passwordless sign-in)" if you want, but standard is fine.
7.  Click **"Save"**.

## 3. Create Firestore Database
1.  Click **"Build"** -> **"Firestore Database"** on the left menu.
2.  Click **"Create database"**.
3.  Choose a location (closest to you).
4.  Choose **"Start in production mode"**.
5.  Click **"Create"**.

## 4. Set Security Rules
1.  In the Firestore Database section, click the **"Rules"** tab.
2.  Delete the existing code and paste the following rules exactly:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null &&
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Helper function to check if user is authenticated
    function isAuth() {
      return request.auth != null;
    }

    // Contacts: Readable by authenticated users. Writable by admins.
    match /contacts/{contactId} {
      allow read: if isAuth();
      allow create: if isAuth();
      allow update, delete: if isAdmin();
    }

    // Users Collection:
    match /users/{userId} {
      allow read: if isAuth();
      // Allow creation if it's their own document (first run setup or signup)
      allow create: if request.auth != null && request.auth.uid == userId;
      // Only admins can update roles or delete users
      allow update, delete: if isAdmin();
    }

    // Invites Collection:
    match /invites/{inviteId} {
      allow read: if isAuth();
      allow create, update, delete: if isAdmin();
    }
  }
}
```

3.  Click **"Publish"**.

## 5. Get API Credentials
1.  Click the **Gear icon** (Settings) next to "Project Overview" at the top left.
2.  Scroll down to the "Your apps" section.
3.  Click the **Web** icon (`</>`).
4.  Give the app a nickname (e.g., "Web App").
5.  Click **"Register app"**.
6.  You will see a code block with `const firebaseConfig = { ... }`.
7.  Copy the values for `apiKey`, `authDomain`, `projectId`, etc.
8.  You will need to enter these into the **Settings** menu of your running application.

## 6. Configure Firestore Indexes
Firestore requires indexes for certain queries, especially those with multiple filters or sorting.

### Option A: Manual Setup (Firebase Console)
If you are not using the Firebase CLI, you must create these indexes manually:
1.  Go to **"Build"** -> **"Firestore Database"**.
2.  Click the **"Indexes"** tab.
3.  Click **"Composite"** and then **"Create Index"**.
4.  Add the following indexes:
    - **Collection ID**: `invites`
      - Fields: `role` (Ascending), `status` (Ascending)
      - Query scope: Collection
    - **Collection ID**: `invites`
      - Fields: `email` (Ascending), `status` (Ascending)
      - Query scope: Collection
    - **Collection ID**: `contacts`
      - Fields: `created_at` (Descending)
      - Query scope: Collection

### Option B: Firebase CLI
If you have the Firebase CLI installed, you can deploy the included `firestore.indexes.json` file:
1.  Run `firebase login`.
2.  Run `firebase init firestore` (select your project).
3.  Run `firebase deploy --only firestore:indexes`.
