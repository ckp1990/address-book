# Installation & Setup Guide

This guide will help you install and run the Address Book application.

The application has two modes:
1.  **Local Mode:** Runs on a single computer. Data is stored on that computer only. No internet or database setup required.
2.  **Cloud Mode:** Connects to a Firebase database. Allows multiple users and computers to share the same data.

---

## Step 1: Get the Code

First, you need to get the software onto your computer.

### Prerequisites
*   **Node.js**: Download and install the LTS version from [nodejs.org](https://nodejs.org/).

### Installation
1.  **Download/Clone:**
    *   If you are a developer: `git clone <repository-url>`
    *   If you are an end-user: Download the "Source Code" ZIP file from the release page and extract it.
2.  **Open Terminal:**
    *   Navigate to the extracted folder.
    *   Right-click inside the folder -> "Open in Terminal".
3.  **Install Dependencies:**
    Run this command:
    ```bash
    npm install
    ```

---

## Step 2: Choose Your Mode

### Option A: Local Mode (Simplest)
**Best for:** Single user, private data, no setup hassle.

1.  **Start the App:**
    ```bash
    npm run dev
    ```
2.  **Open Browser:** Go to `http://localhost:5173`.
3.  **Done!** You can start adding contacts immediately. Data is saved to your browser.
    *   *Note: If you clear your browser data, you will lose your contacts.*

### Option B: Cloud Mode (Multi-User)
**Best for:** Teams, multiple devices, permanent cloud storage.

To use Cloud Mode, you need to create a free Firebase project and connect it to the app.

1.  **Create Database:**
    Follow the detailed instructions in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) to:
    *   Create a Firebase Project.
    *   Enable Authentication.
    *   Create Firestore Database.
    *   **Important:** Set the Security Rules as described in the guide.

2.  **Deploy (Optional but Recommended):**
    If you want your team to access the app from anywhere, deploy it to the web using GitHub Pages.
    *   Follow [GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md).

3.  **Connect the App:**
    *   Open your app (either `localhost:5173` or your deployed website).
    *   Click the **Settings (Gear Icon)** button in the top menu.
    *   Enter the Firebase Configuration values you got from Step 1.
    *   Click **Save**. The page will reload.

---

## Step 3: First Run (Cloud Mode Only)

If you chose **Cloud Mode**, you need to set up the first Administrator account.

1.  After connecting the database, the app will show a **"First Time Setup"** screen.
2.  Create an Admin account (Email and Password).
3.  **Check your Email:** A verification link will be sent to you. You **must** verify your email before you can manage contacts.
4.  Once verified, refresh the page and log in.

### Adding More Users
*   As an Admin, go to **User Management** (User Icon) to invite team members.
*   Team members will receive an invite code/link logic (handled internally) or simply be allowed to sign up if their email matches a pending invite.

---

## Summary Checklist

- [ ] Install Node.js
- [ ] Download Code & Run `npm install`
- [ ] **Decide:** Local or Cloud?
    - [ ] *Local:* Run `npm run dev` and enjoy.
    - [ ] *Cloud:* Setup Firebase -> Deploy -> Connect App -> Verify Email.
