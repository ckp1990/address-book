# Address Book Application - User & Setup Guide

Welcome to the Address Book Application! This guide will help you set up and run the software on your computer. This application is designed to be a private, secure place to manage your contacts.

## 1. Prerequisites (What you need first)

Before running the application, you need to install a free tool called **Node.js**. This allows your computer to run the software.

1.  Go to the [official Node.js website](https://nodejs.org/).
2.  Download the **LTS (Long Term Support)** version for your operating system (Windows, macOS, or Linux).
3.  Run the installer and follow the on-screen instructions (clicking "Next" and accepting the defaults is fine).

## 2. Installation Setup

Once Node.js is installed, follow these steps to get the application ready:

1.  **Open the Folder:** Locate the folder where you have this software saved on your computer.
2.  **Open a Terminal/Command Window:**
    *   **Windows:** Right-click inside the folder and select "Open in Terminal" or hold `Shift` + Right-click and select "Open PowerShell window here".
    *   **Mac:** Open the "Terminal" app, type `cd ` (with a space), drag the folder into the terminal window, and press Enter.
3.  **Install Dependencies:**
    *   In the terminal window, type the following command and press Enter:
        ```bash
        npm install
        ```
    *   Wait for the process to finish. You might see some text scrolling by; this is normal.

## 3. Starting the Application

Now you are ready to launch the address book!

1.  In the same terminal window, type:
    ```bash
    npm run dev
    ```
2.  Press Enter. You should see a message saying something like:
    `  ➜  Local:   http://localhost:5173/`
3.  Open your web browser (Chrome, Firefox, Safari, etc.) and type `http://localhost:5173` into the address bar (or hold `Ctrl` and click the link in the terminal).

## 4. Logging In

The application is protected by a login screen. Use the following credentials to sign in.

**Administrator Access (Full Control: Add, Edit, Delete)**
*   **Username:** `admin`
*   **Password:** `Warlord@12`

**Standard User Access (View and Add only)**
*   **Username:** `user`
*   **Password:** `CWS$2025`

> **Note:** There is no "Sign Up" button. You must use one of the accounts above.

## 5. Using the Application

Once logged in, you can manage your contacts:

*   **Add a Contact:** Click the **"New Contact"** button at the top right.
*   **Edit a Contact:** Click the **Pencil icon** on a contact card (Admin only).
*   **Delete a Contact:** Click the **Trash icon** on a contact card (Admin only).
*   **Search:** Use the search bar at the top to find contacts by name or phone number.
*   **Print Labels:**
    1.  Click the "Select" button on contacts you want to print, or "Select All".
    2.  Click the **"Print"** button that appears at the top.
    3.  This will generate a printable view for your contacts.

## 6. Troubleshooting

*   **"command not found" error:** This usually means Node.js wasn't installed correctly. Try restarting your computer after installing Node.js.
*   **Browser says "Unable to connect":** Make sure the terminal window is still open and running the `npm run dev` command. If you closed it, the app will stop.
*   **Data not saving?** In this version, data is saved to your browser's "Local Storage". If you clear your browser history/cache, you might lose your contacts unless a database (Supabase) is connected by a developer.
