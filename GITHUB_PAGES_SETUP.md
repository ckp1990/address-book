# GitHub Pages Setup Guide

This guide will help you put your Address Book application on the internet for free using GitHub Pages.

## 1. Get Your Own Copy (Fork)

If you haven't already, you need your own copy of this code.

1.  Log in to your [GitHub account](https://github.com/).
2.  Go to the main page of this repository.
3.  Click the **"Fork"** button at the top right of the page.
4.  Click "Create fork". This creates a copy of the code under your own account.

## 2. Trigger the Deployment

The website will update automatically whenever you change code, but we need to start it the first time.

1.  Click on the **"Actions"** tab at the top of your repository.
2.  On the left, you should see a workflow named something like **"Deploy to GitHub Pages"**.
3.  Click on it, and if there is a "Run workflow" button, click it.
4.  Otherwise, if you see a workflow run with a green checkmark ✅, it means it has already finished!
5.  Wait for the process to complete (the spinning circle turns green).

## 3. Enable GitHub Pages

Now we need to tell GitHub where to find your built website.

1.  Go to the **"Settings"** tab of your repository (top menu bar, look for the gear icon).
2.  On the left sidebar menu, look for the **"Pages"** section (under "Code and automation"). Click it.
3.  Under **"Build and deployment"**:
    *   Find the **"Source"** dropdown menu.
    *   Ensure it is set to **"Deploy from a branch"**.
    *   Under **"Branch"**, select **`gh-pages`** and **`/ (root)`**.
    *   *Note: If you don't see `gh-pages` in the list, wait a minute for the step above to finish, or refresh the page.*
    *   Click **"Save"**.

## 4. Visit Your Website

1.  Stay on the **"Pages"** settings page.
2.  At the very top, you will see a message: **"Your site is live at..."** followed by a link.
3.  Click that link to open your Address Book.

## 5. Connect the Database

When you first open your online Address Book, it will be in "Demo Mode" (saving data only to that specific computer/browser).

To connect it to your cloud database:

1.  Follow the [Firebase Setup Guide](./FIREBASE_SETUP.md) to get your configuration details.
2.  On your live website, click the **Settings** (gear icon) button.
3.  Enter your Firebase details (API Key, Project ID, App ID, etc.) and click Save.

Now you can access your contacts from any computer by going to your website and entering those same settings!
