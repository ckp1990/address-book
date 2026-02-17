# Address Label Printer - User Guide

Welcome to the Address Label Printer! This guide helps you set up and use the application to manage contacts and print address labels.

**For Installation Instructions, please see [INSTALLATION.md](INSTALLATION.md).**

## Table of Contents
1. [Introduction](#1-introduction)
2. [First Time Setup](#2-first-time-setup)
3. [Managing Users (Cloud Mode)](#3-managing-users-cloud-mode)
4. [Using the Application](#4-using-the-application)

---

## 1. Introduction
**Address Label Printer** is a simple, secure tool for managing your contacts and printing address labels. You can store names, addresses, and phone numbers, and then easily print them in various label sizes (A4, A5, Letter, etc.).

The application works in two modes:
*   **Cloud Mode:** Syncs data across devices using Google Firebase. Requires internet.
*   **Local Mode:** Stores data on your specific device. Works offline.

---

## 2. First Time Setup

When you open the application for the first time, you will see a **Welcome Screen**.

### Option A: Cloud Database (Recommended)
Choose this if you want to access your contacts from your phone and computer, or share them with a team.
1.  Click **Cloud Database**.
2.  Enter the Firebase API keys (your administrator can provide these, or see `FIREBASE_SETUP.md` to create your own).
3.  Create an Admin account.

### Option B: Local Database
Choose this for a quick, private address book on a single device.
1.  Click **Local Database**.
2.  Enter your **Name**.
3.  Start using the app immediately.

*Note: You can reset the application and switch modes at any time from the Settings menu.*

---

## 3. Managing Users (Cloud Mode)

*This section applies only if you chose **Cloud Database**.*

The application uses an **Invite-Only** system. New users cannot sign up unless an Administrator invites them.

### Inviting a User (Admin Only)
1.  Log in as an Administrator.
2.  Click the **Users** button (Settings -> Users).
3.  Enter the email address of the person you want to invite.
4.  Select their role:
    *   **User:** Can Add and View contacts.
    *   **Admin:** Can Add, Edit, Delete contacts, and Manage Users.
5.  Click **"Send Invite"**.

### Limits
*   **Admins:** Maximum 3
*   **Users:** Maximum 5

---

## 4. Using the Application

### Adding Contacts
*   Click **"New Contact"** at the top right.
*   Fill in the details (Name, Address, City, etc.).
*   Click **Save**.

### Editing & Deleting
*   **Edit:** Click the **Pencil icon** on any contact card.
*   **Delete:** Click the **Trash icon**.
*   *Note: In Cloud Mode, only Admins can delete contacts.*

### Printing Labels
1.  **Select Contacts:** Click the checkbox on the cards you want to print, or click "Select All".
2.  **Configure:** Use the dropdowns at the top to choose your paper size (e.g., A4, Letter) and orientation (Landscape/Portrait).
3.  **Preview:** Click the **Eye icon** to see how the labels will look.
4.  **Print:** Click the **"Print"** button. This will open your computer's print dialog.

### Settings
Click the **Gear icon** to:
*   Change between Cloud and Local modes (Reset App).
*   View version information.

## Recent Updates

For a list of recent changes and updates to the application, please refer to the [Changelog](CHANGELOG.md).
