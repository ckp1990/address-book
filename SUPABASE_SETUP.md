# Supabase Setup Guide

This guide will help you create a free cloud database for your Address Book application using Supabase.

## 1. Create an Account

1.  Go to [https://supabase.com/](https://supabase.com/).
2.  Click the green **"Start your project"** button.
3.  Sign up using your GitHub account (or create one if you don't have it).

## 2. Create a New Project

1.  Once logged in, click **"New project"**.
2.  Select your Organization (usually your username).
3.  Fill in the details:
    *   **Name:** `Address Book` (or anything you like).
    *   **Database Password:** Create a strong password and **save it somewhere safe**.
    *   **Region:** Select a region close to you (e.g., "West US", "Central EU").
4.  Click **"Create new project"**.
5.  Wait a minute or two for the project to be set up.

## 3. Set Up the Database Table

We need to create a place to store your contacts. We will use a small piece of code (SQL) to do this automatically.

1.  On the left sidebar menu, look for the **SQL Editor** icon (it looks like a terminal/console `>_`).
2.  Click **"New query"** (or a blank page).
3.  Copy and paste the following code into the big text box:

```sql
-- Create the contacts table
create table contacts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  phone text,
  address text,
  city text,
  state text,
  country text,
  pincode text
);

-- Enable Row Level Security (Security Policy)
alter table contacts enable row level security;

-- Create a policy that allows anyone to do anything (FOR PERSONAL USE ONLY)
-- Warning: This means anyone with your API key can edit your data.
-- Since this is a personal address book, this is usually fine for a start.
create policy "Public Access" on contacts
for all
using (true)
with check (true);
```

4.  Click the green **"Run"** button at the bottom right of the text box.
5.  You should see a message saying "Success" in the results area.

## 4. Get Your Connection Details

To connect your Address Book app to this new database, you need two pieces of information: the **URL** and the **Key**.

1.  On the left sidebar, click the **Settings** icon (it looks like a gear ⚙️) at the very bottom.
2.  Click on **"API"** in the list.
3.  Look for the box labeled **"Project URL"**.
    *   Copy the URL (e.g., `https://xyzxyzxyz.supabase.co`).
4.  Look for the box labeled **"Project API keys"**.
    *   Find the one named `anon` `public`.
    *   Copy that long string of characters.

## 5. Connect to the App

1.  Open your Address Book application.
2.  Click the **Settings** (gear icon) button at the top right, or click "Setup Supabase" in the blue banner.
3.  Paste your **URL** and **Anon Key** into the boxes.
4.  Click **"Save & Connect"**.

Congratulations! Your contacts will now be saved to the cloud.
