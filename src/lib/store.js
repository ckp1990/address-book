import { useState, useEffect, useCallback } from 'react';
import { db, ensureAuth } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

// Performance Optimization: Use Intl.Collator for efficient string comparison
// This is significantly faster (~5x) than parsing Dates or using localeCompare inside a loop
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

/**
 * Custom hook to manage contacts.
 * Automatically switches between LocalStorage (Demo) and Firebase (Prod).
 */
export function useContacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isDemo = !db;

    useEffect(() => {
        async function fetchContacts() {
            setLoading(true);
            try {
                if (isDemo) {
                    // Load from LocalStorage
                    const localData = JSON.parse(localStorage.getItem('demo_contacts') || '[]');
                    // Sort by name
                    localData.sort((a, b) => collator.compare(a.name || '', b.name || ''));
                    setContacts(localData);
                } else {
                    // Load from Firebase
                    await ensureAuth();
                    const contactsRef = collection(db, 'contacts');

                    try {
                        // Attempt server-side sort by name
                        const q = query(contactsRef, orderBy('name', 'asc'));
                        const querySnapshot = await getDocs(q);
                        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        setContacts(data);
                    } catch (idxError) {
                        console.warn("Index missing or error, fetching without sort:", idxError);
                        // Fallback to unsorted fetch
                        const querySnapshot = await getDocs(contactsRef);
                        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        // Client-side sort by name
                        data.sort((a, b) => collator.compare(a.name || '', b.name || ''));
                        setContacts(data);
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
    }, [isDemo]);

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
                const updated = [...contacts, newContact].sort((a, b) => collator.compare(a.name || '', b.name || ''));
                setContacts(updated);
                localStorage.setItem('demo_contacts', JSON.stringify(updated));
                setContacts(prev => {
                    const updated = [newContact, ...prev];
                    localStorage.setItem('demo_contacts', JSON.stringify(updated));
                    return updated;
                });
                return newContact;
            } else {
                await ensureAuth();
                const docRef = await addDoc(collection(db, 'contacts'), newContactData);
                const savedContact = { id: docRef.id, ...newContactData };
                const updated = [...contacts, savedContact].sort((a, b) => collator.compare(a.name || '', b.name || ''));
                setContacts(updated);
                setContacts(prev => [savedContact, ...prev]);
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
                setContacts(prev => {
                    const updated = prev.filter(c => c.id !== id);
                    localStorage.setItem('demo_contacts', JSON.stringify(updated));
                    return updated;
                });
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
                const updated = contacts.map(c => c.id === id ? { ...c, ...updates } : c)
                                        .sort((a, b) => collator.compare(a.name || '', b.name || ''));
                setContacts(updated);
                localStorage.setItem('demo_contacts', JSON.stringify(updated));
                setContacts(prev => {
                    const updated = prev.map(c => c.id === id ? { ...c, ...updates } : c);
                    localStorage.setItem('demo_contacts', JSON.stringify(updated));
                    return updated;
                });
            } else {
                await ensureAuth();
                const contactRef = doc(db, 'contacts', id);
                await updateDoc(contactRef, updates);
                const updated = contacts.map(c => c.id === id ? { ...c, ...updates } : c)
                                        .sort((a, b) => collator.compare(a.name || '', b.name || ''));
                setContacts(updated);
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
