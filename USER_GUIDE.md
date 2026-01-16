# Address Label Printer - User Guide

Welcome to the Address Label Printer! This guide is designed to help you set up and use the application, whether you want to run it on your own computer or host it on the web.

## Table of Contents
1. [Introduction](#1-introduction)
2. [Running Locally (On Your Computer)](#2-running-locally-on-your-computer)
3. [Running on the Web (GitHub Pages)](#3-running-on-the-web-github-pages)
4. [Using the Application](#4-using-the-application)

---

## 1. Introduction
**Address Label Printer** is a simple, secure tool for managing your contacts and printing address labels. You can store names, addresses, and phone numbers, and then easily print them in various label sizes (A4, A5, Letter, etc.).

---

## 2. Running Locally (On Your Computer)
If you want to run the software directly on your laptop or desktop, follow these steps.

### Step 1: Install Node.js
This software requires a tool called **Node.js** to run.
1.  Go to the [official Node.js website](https://nodejs.org/).
2.  Download the **LTS (Long Term Support)** version for your operating system (Windows or macOS).
3.  Run the downloaded installer and follow the instructions (clicking "Next" is usually fine).

### Step 2: Get the Code
1.  Download this software to your computer (usually as a ZIP file) and unzip it.
2.  **Open a Terminal/Command Window:**
    *   **Windows:** Open the folder, hold `Shift` + Right-click in the empty space, and select "Open PowerShell window here" or "Open in Terminal".
    *   **Mac:** Open the "Terminal" app. Type `cd ` (with a space), drag the folder into the terminal window, and press Enter.

### Step 3: Install & Start
In the terminal window you just opened, type these commands one by one:

1.  **Install the dependencies:**
    ```bash
    npm install
    ```
    (Wait for it to finish. It might take a minute.)

2.  **Start the app:**
    ```bash
    npm run dev
    ```

3.  **Open in Browser:**
    You will see a link like `http://localhost:5173`. Open your web browser (Chrome, Safari, etc.) and type that address into the bar.

---

## 3. Running on the Web (GitHub Pages)
You can also host this application on the internet for free using GitHub Pages. This allows you to access it from anywhere.

### Step 1: Get Your Own Copy (Fork)
1.  Log in to your [GitHub account](https://github.com/).
2.  Go to the main page of this repository.
3.  Click the **"Fork"** button at the top right of the page.
4.  Click "Create fork". This creates a copy of the code under your own account.

### Step 2: Enable Deployment
1.  In your new repository, click the **"Actions"** tab at the top.
2.  Look for a workflow on the left (e.g., "Deploy to GitHub Pages").
3.  If you see a generic "I understand my workflows, go ahead and enable them" button, click it.
4.  If needed, click the specific workflow and select **"Run workflow"**.
5.  Wait for the process to show a green checkmark ✅.

### Step 3: Configure GitHub Pages
1.  Go to the **"Settings"** tab of your repository (gear icon).
2.  On the left sidebar, click **"Pages"** (under "Code and automation").
3.  Under **"Build and deployment"**:
    *   Set **Source** to **"Deploy from a branch"**.
    *   Set **Branch** to **`gh-pages`** and folder to **`/(root)`**.
    *   Click **"Save"**.
    *(Note: If `gh-pages` isn't in the list, wait a minute for the previous step to finish and refresh the page.)*

### Step 4: Visit Your Site
After saving, stay on the **"Pages"** settings screen. In a moment, a box will appear at the top saying **"Your site is live at..."**. Click that link to use your app!

---

## 4. Using the Application

### Login
The application is protected. Use these credentials to log in:

*   **Admin (Can Add, Edit, Delete):**
    *   Username: `admin`
    *   Password: `Warlord@12`
*   **User (Can Add & View only):**
    *   Username: `user`
    *   Password: `CWS$2025`

### Managing Contacts
*   **Add:** Click **"New Contact"** at the top right. Fill in the details (Name, Address, City, etc.) and save.
*   **Edit:** (Admin only) Click the **Pencil icon** on any contact card.
*   **Delete:** (Admin only) Click the **Trash icon**.

### Printing Labels
1.  **Select Contacts:** Click the "Select" button on the cards you want to print, or click "Select All".
2.  **Configure:** Use the dropdowns at the top to choose your paper size (e.g., A4, Letter) and orientation (Landscape/Portrait).
3.  **Preview/Print:** Click the **"Print"** button. This will open your computer's print dialog where you can send it to your printer.
