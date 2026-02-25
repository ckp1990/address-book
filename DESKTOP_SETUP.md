# Desktop App Setup Guide (Windows)

This guide will help you build and install the **Address Label Printer** as a standalone Windows application (`.exe`). The desktop version includes a local database (`contacts.json`) so you can work offline, and optionally sync with the cloud (Firebase).

---

## 1. Prerequisites

Before you begin, ensure you have the following installed on your computer:

*   **Node.js (LTS Version):** Download from [nodejs.org](https://nodejs.org/). This is required to build the application.
*   **Git:** Download from [git-scm.com](https://git-scm.com/).

---

## 2. Building the Installer (.exe)

Follow these steps to generate the Windows installer file.

1.  **Open a Terminal:** open Command Prompt or PowerShell in the project folder.
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Build the Application:**
    Run the following command. This will compile the code and package it into an installer.
    ```bash
    npm run electron:build
    ```
4.  **Locate the Installer:**
    Once the process finishes (it may take a few minutes), navigate to the `dist-electron` folder inside your project directory.
    *   You will see a file named something like `Address Label Printer Setup 1.0.0.exe`.
    *   This is your installer! You can double-click it to install the app on your computer.

---

## 3. Using the Desktop App

### Local Database (Offline Mode)
By default, the app runs in **Local Mode**.
*   **Data Storage:** All contacts are saved to a file on your computer.
    *   Location: `%APPDATA%\address-label-printer\contacts.json`
*   **Features:** You can Add, Edit, Delete, and Print labels freely.
*   **No Internet Required:** It works completely offline.

### Cloud Sync (Online Mode)
You can connect the app to the cloud to share data with other users or back it up.
1.  Click the **"Setup Firebase"** link in the top banner (or the Settings gear icon).
2.  Enter your **Firebase Configuration Keys** (API Key, Project ID, App ID).
3.  Once connected:
    *   **Admins:** Can Add, Edit, and Delete data (changes sync to everyone).
    *   **Users:** Can View and Add data only (cannot Delete/Edit).
    *   **Offline Support:** The app will still work offline using the last synced data.

---

## 4. Firebase Setup (Optional)

If you want to enable Cloud Sync, you need to create a free Firebase project.

1.  **Go to Firebase Console:**
    *   Visit [console.firebase.google.com](https://console.firebase.google.com/) and log in with your Google account.
2.  **Create a Project:**
    *   Click **"Add project"**.
    *   Name it (e.g., "Address-Printer-App").
    *   Disable Google Analytics (not needed) and click **"Create project"**.
3.  **Register App:**
    *   Click the **Web icon `</>`** to add an app.
    *   Nickname: "Desktop App".
    *   Click **"Register app"**.
    *   **Copy the Config:** You will see a code block with `const firebaseConfig = { ... }`.
    *   **Save these values!** You will need the `apiKey`, `projectId`, and `appId` to enter into the Desktop App settings.
4.  **Enable Database (Firestore):**
    *   Go to **"Build" > "Firestore Database"** in the left menu.
    *   Click **"Create database"**.
    *   Choose a location (e.g., `nam5` for US).
    *   Start in **Test mode** (we will secure it later) or **Production mode**.
    *   **Important:** You must copy the security rules from `FIRESTORE_RULES.txt` in this project and paste them into the "Rules" tab in Firebase Console.
5.  **Enable Authentication:**
    *   Go to **"Build" > "Authentication"**.
    *   Click **"Get started"**.
    *   Select **"Email/Password"** and enable it.
    *   Click **"Save"**.
    *   Go to the **"Users"** tab and click **"Add user"** to create your first Admin account.

**Done!** You can now use the credentials from Step 3 to connect your Desktop App to the cloud.
