import { createClient } from '@supabase/supabase-js';
import { db, ensureAuth } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

/**
 * Migrates all data from a Supabase table to the Firebase 'contacts' collection.
<<<<<<< Updated upstream
 *
=======
 *
>>>>>>> Stashed changes
 * @param {string} supabaseUrl - The Supabase Project URL.
 * @param {string} supabaseKey - The Supabase Anon Key.
 * @param {function} onProgress - Callback function (msg: string) => void for updates.
 * @returns {Promise<{success: boolean, message: string, count: number}>}
 */
export async function migrateData(supabaseUrl, supabaseKey, onProgress) {
    if (!db) {
        throw new Error("Firebase is not configured. Please save Firebase settings first.");
    }
<<<<<<< Updated upstream

=======

>>>>>>> Stashed changes
    try {
        onProgress("Authenticating with Firebase...");
        await ensureAuth();

        onProgress("Connecting to Supabase...");
        const supabase = createClient(supabaseUrl, supabaseKey);

        onProgress("Fetching contacts from Supabase...");
        const { data: contacts, error } = await supabase
            .from('contacts')
            .select('*');

        if (error) throw error;

        if (!contacts || contacts.length === 0) {
            return { success: true, message: "No contacts found in Supabase to migrate.", count: 0 };
        }

        onProgress(`Found ${contacts.length} contacts. Starting import...`);
        let count = 0;

        // Note: We could use batch writes, but for simplicity and error handling in a client-side migration,
        // sequential or parallel promises are safer to implement quickly without hitting batch size limits (500).
        // Given the small data size (1MB), parallel promises are fine.
<<<<<<< Updated upstream

        const promises = contacts.map(async (contact) => {
            // Remove the Supabase ID to let Firebase generate its own,
            // OR keep it if we want to preserve IDs.
=======

        const promises = contacts.map(async (contact) => {
            // Remove the Supabase ID to let Firebase generate its own,
            // OR keep it if we want to preserve IDs.
>>>>>>> Stashed changes
            // Firestore IDs must be strings.
            // Let's strip the ID to avoid conflicts and let Firestore generate a new one,
            // but we preserve all other fields.
            const { id, ...contactData } = contact;
<<<<<<< Updated upstream

=======

>>>>>>> Stashed changes
            // Clean up any null values if necessary, but Firestore handles them.
            await addDoc(collection(db, 'contacts'), contactData);
            count++;
            if (count % 5 === 0) onProgress(`Imported ${count}/${contacts.length}...`);
        });

        await Promise.all(promises);

        return { success: true, message: "Migration completed successfully!", count };

    } catch (err) {
        console.error("Migration failed:", err);
        throw new Error(`Migration failed: ${err.message}`);
    }
}
