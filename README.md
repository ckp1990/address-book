# Address Label Printer

A modern, web-based address book and label printing application. Manage your contacts and print labels directly from your browser.

## Features

*   **Progressive Web App (PWA):** Installable on desktop and mobile devices. Works offline (Local Mode).
*   **Dual Mode:**
    *   **Cloud Mode:** Syncs data across devices using Google Firebase.
    *   **Local Mode:** Stores data privately on your device.
*   **Printing:** Print labels in various sizes (A4, A5, Letter) and orientations.
*   **User Management:** Invite-only system for team access (Cloud Mode).
*   **Secure:** Role-based access control (Admin/User).

## Quick Start

### 1. Prerequisites
*   Node.js (v18 or higher)
*   npm (comes with Node.js)

### 2. Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 3. Usage
1.  Open your browser to `http://localhost:5173`.
2.  Follow the **Installation Wizard**:
    *   **Cloud Database:** Enter your Firebase API keys.
    *   **Local Database:** Enter your name to start immediately.

For detailed installation instructions, see [INSTALLATION.md](./INSTALLATION.md).

For a user guide, see [USER_GUIDE.md](./USER_GUIDE.md).

## Documentation

*   [Installation Guide](./INSTALLATION.md)
*   [User Guide](./USER_GUIDE.md)
*   [Firebase Setup](./FIREBASE_SETUP.md)
*   [Changelog](./CHANGELOG.md)

## License
MIT
