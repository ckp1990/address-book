# Firebase Setup Guide

Since Supabase is being replaced, we are switching to **Firebase** (by Google) to store and sync your contacts across devices. It is free and reliable.

Follow these steps to set up your own database.

## Step 1: Create a Firebase Project
1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/) and log in with your Google account.
2. Click **"Create a project"**.
3. Name it `Address Book` (or anything you like).
4. Disable "Google Analytics" (it's not needed for this) and click **"Create project"**.

## Step 2: Enable Database (Firestore)
1. Once your project is ready, click on **"Build"** -> **"Firestore Database"** in the left menu.
2. Click **"Create database"**.
3. Choose a location (e.g., `nam5 (us-central)` or whatever is close to you).
4. **Important:** When asked about security rules, choose **"Start in test mode"** OR **"Start in production mode"**. We will fix the rules in the next step anyway. Click **Create**.

## Step 3: Enable Authentication
1. Click on **"Build"** -> **"Authentication"** in the left menu.
2. Click **"Get started"**.
3. Click on the **"Sign-in method"** tab (or "Native providers").
4. Select **"Anonymous"**.
5. Toggle it to **Enable** and click **Save**.
*This allows the app to securely connect without requiring you to log in with Google every time.*

## Step 4: Set Security Rules
1. In the Firestore Database tab, click on the **"Rules"** tab.
2. Replace the existing code with the following (copy and paste):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // Allows anyone signed in (even anonymously) to read/write.
      allow read, write: if request.auth != null;
    }
  }
}
```
3. Click **"Publish"**.

*Note: The application automatically signs you in anonymously to satisfy this rule.*

## Step 5: Get Your Configuration Keys
1. Click the **Gear icon (Settings)** next to "Project Overview" in the top-left menu.
2. Choose **"Project settings"**.
3. Scroll down to the **"Your apps"** section.
4. Click the **`</>` (Web)** icon.
5. Enter an App nickname (e.g., "AddressBook") and click **"Register app"**.
6. You will see a code snippet with `firebaseConfig`. You need the values inside it.

## Step 6: Connect the App
1. Open your Address Book app.
2. Click the **Settings (Gear)** icon in the top right.
3. Copy and paste the values from Firebase into the app:
   - **API Key**: `apiKey`
   - **Project ID**: `projectId`
   - **App ID**: `appId`
   - *(Optional)* Auth Domain, Storage Bucket, Messaging Sender ID (if you want, but the first 3 are the most important).
4. Click **"Save"**. The app will reload and connect!

## Step 7: Migrate Your Data
If you have data in Supabase that you want to keep:
1. Open **Settings** again.
2. Click the **"Migration Tool"** tab.
3. Enter your old Supabase URL and Key (they might be auto-filled).
4. Click **"Start Migration"**.
5. Wait for the "Done!" message. Your contacts are now in Firebase!
