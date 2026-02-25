import { useState, useEffect, useCallback } from 'react';
import { db, ensureAuth } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { StorageAdapter } from './storage-adapter';

/**
 * Custom hook to manage contacts.
 * Automatically switches between LocalStorage/FileStorage (Local Mode) and Firebase (Cloud Mode).
 */
export function useContacts(userId) {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isDemo = !db;

    // Persist contacts to local storage/file whenever they change (local mirror)
    useEffect(() => {
        if (!loading) {
            StorageAdapter.save('demo_contacts', contacts);
        }
    }, [contacts, loading]);

    useEffect(() => {
        async function fetchContacts() {
            setLoading(true);
            try {
                // Always attempt to load from local storage/file first (offline/cache)
                const localData = await StorageAdapter.load('demo_contacts');
                if (localData && Array.isArray(localData)) {
                    setContacts(localData);
                }

                if (isDemo) {
                    // In Local Mode, we are done (data loaded from local storage)
                } else {
                    // In Cloud Mode, attempt to sync with Firebase
                    const user = await ensureAuth();
                    if (!user) {
                        // If not authenticated in Cloud Mode, clear contacts for security
                        setContacts([]);
                        setLoading(false);
                        return;
                    }
                    const contactsRef = collection(db, 'contacts');

                    try {
                        let data = [];
                        try {
                            const q = query(contactsRef, orderBy('created_at', 'desc'));
                            const querySnapshot = await getDocs(q);
                            data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        } catch (idxError) {
                            console.warn("Index missing or error, fetching without sort:", idxError);
                            const querySnapshot = await getDocs(contactsRef);
                            data = querySnapshot.docs
                                .map(doc => {
                                    const d = doc.data();
                                    return {
                                        id: doc.id,
                                        ...d,
                                        _sortTime: new Date(d.created_at).getTime()
                                    };
                                })
                                .sort((a, b) => b._sortTime - a._sortTime)
                                .map(({ _sortTime, ...rest }) => rest);
                        }

                        // Update state with cloud data
                        setContacts(data);
                        // Sync cloud data to local storage/file
                        await StorageAdapter.save('demo_contacts', data);

                    } catch (firestoreError) {
                        console.error("Firestore fetch failed, using local cache:", firestoreError);
                        // If Firestore fails (e.g. offline), we keep the local data we loaded earlier
                        // Optionally set an error to inform the user
                        // setError("Offline mode: Using cached data.");
                    }
                }
            } catch (err) {
                console.error('Error fetching contacts:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchContacts();
    }, [isDemo, userId]);

    const addContact = useCallback(async (contact) => {
        try {
            const newContactData = {
                ...contact,
                created_at: new Date().toISOString()
            };

            if (isDemo) {
                const newContact = {
                    id: crypto.randomUUID(),
                    ...newContactData
                };
                setContacts(prev => [newContact, ...prev]);
                // Persistence handled by useEffect
                return newContact;
            } else {
                await ensureAuth();
                const docRef = await addDoc(collection(db, 'contacts'), newContactData);
                const savedContact = { id: docRef.id, ...newContactData };
                setContacts(prev => [savedContact, ...prev]);
                // Persistence handled by useEffect
                return savedContact;
            }
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [isDemo]);

    const deleteContact = useCallback(async (id) => {
        try {
            if (isDemo) {
                setContacts(prev => prev.filter(c => c.id !== id));
            } else {
                await ensureAuth();
                await deleteDoc(doc(db, 'contacts', id));
                setContacts(prev => prev.filter(c => c.id !== id));
            }
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [isDemo]);

    const updateContact = useCallback(async (id, updates) => {
        try {
            if (isDemo) {
                setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
            } else {
                await ensureAuth();
                const contactRef = doc(db, 'contacts', id);
                await updateDoc(contactRef, updates);
                setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
            }
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [isDemo]);

    return {
        contacts,
        loading,
        error,
        addContact,
        deleteContact,
        updateContact,
        isDemo
    };
}
