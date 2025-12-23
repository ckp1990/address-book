import { createClient } from '@supabase/supabase-js';

const ENV_URL = import.meta.env.VITE_SUPABASE_URL;
const ENV_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// key names for localStorage
const STORAGE_URL_KEY = 'custom_supabase_url';
const STORAGE_KEY_KEY = 'custom_supabase_key';

/**
 * Creates and returns the Supabase client based on available credentials.
 * Prioritizes LocalStorage (user settings) over Environment Variables (build settings).
 */
function getClient() {
    const localUrl = localStorage.getItem(STORAGE_URL_KEY);
    const localKey = localStorage.getItem(STORAGE_KEY_KEY);

    const url = localUrl || ENV_URL;
    const key = localKey || ENV_KEY;

    if (url && key) {
        try {
            return createClient(url, key);
        } catch (e) {
            console.error("Failed to initialize Supabase client:", e);
            return null;
        }
    }
    return null;
}

// Singleton instance (initialized once per page load)
export const supabase = getClient();

/**
 * Saves connection details and reloads the application to apply changes.
 */
export function saveConnectionDetails(url, key) {
    if (!url || !key) throw new Error("URL and Key are required");
    localStorage.setItem(STORAGE_URL_KEY, url);
    localStorage.setItem(STORAGE_KEY_KEY, key);
    window.location.reload();
}

/**
 * Clears custom connection details and reloads to revert to defaults/demo mode.
 */
export function clearConnectionDetails() {
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_KEY_KEY);
    window.location.reload();
}

/**
 * Helper to check if we are using custom user-provided credentials
 */
export function isUsingCustomCredentials() {
    return !!localStorage.getItem(STORAGE_URL_KEY);
}
