# Installation & First Run Guide

This application is a **Progressive Web App (PWA)**. This means it runs in your web browser but can be installed on your device (computer, tablet, or phone) to look and feel like a native application.

## How to Install

### On Computer (Chrome/Edge)
1.  Open the application URL in your browser.
2.  Look for an **Install** icon in the address bar (usually on the right side).
3.  Click the icon and select **Install**.
4.  The app will open in its own window and appear in your desktop/start menu.

### On Mobile (iOS Safari)
1.  Open the application URL in Safari.
2.  Tap the **Share** button (box with an arrow pointing up).
3.  Scroll down and tap **Add to Home Screen**.
4.  Confirm the name and tap **Add**.

### On Mobile (Android Chrome)
1.  Open the application URL in Chrome.
2.  Tap the **Menu** (three dots) icon.
3.  Tap **Install App** or **Add to Home Screen**.

---

## First Run Setup

When you open the application for the first time, you will see a welcome screen with two options:

### Option 1: Cloud Database (Recommended)
**Best for:** Teams, multiple devices, and secure backup.

1.  Select **Cloud Database**.
2.  You will be asked to provide Firebase configuration keys.
    *   See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for instructions on how to get these keys.
3.  Click **Save & Connect**.
4.  The app will reload and ask you to create the first **Admin Account** (Email & Password).
5.  Once created, you can log in and invite other users.

### Option 2: Local Database
**Best for:** Single user, private use, offline access.

1.  Select **Local Database**.
2.  Enter your **Name** (this will be displayed in the app).
3.  Click **Create Local Profile**.
4.  The app will reload and you will be immediately logged in.
5.  **Note:** All data is stored in your browser's "Local Storage". If you clear your browser history/data, your contacts will be lost!

---

## Switching Modes

If you want to switch from Local to Cloud (or vice versa):
1.  Open the application.
2.  Click the **Settings** (Gear icon) in the top navigation bar.
3.  Click **Reset / Change Configuration**.
4.  The app will reset and show the Installation screen again.
