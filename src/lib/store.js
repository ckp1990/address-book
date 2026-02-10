import { useState, useEffect } from 'react';
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

    async function addContact(contact) {
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
                return newContact;
            } else {
                await ensureAuth();
                const docRef = await addDoc(collection(db, 'contacts'), newContactData);
                const savedContact = { id: docRef.id, ...newContactData };
                const updated = [...contacts, savedContact].sort((a, b) => collator.compare(a.name || '', b.name || ''));
                setContacts(updated);
                return savedContact;
            }
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    async function deleteContact(id) {
        try {
            if (isDemo) {
                const updated = contacts.filter(c => c.id !== id);
                setContacts(updated);
                localStorage.setItem('demo_contacts', JSON.stringify(updated));
            } else {
                await ensureAuth();
                await deleteDoc(doc(db, 'contacts', id));
                setContacts(contacts.filter(c => c.id !== id));
            }
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    async function updateContact(id, updates) {
        try {
            if (isDemo) {
                const updated = contacts.map(c => c.id === id ? { ...c, ...updates } : c)
                                        .sort((a, b) => collator.compare(a.name || '', b.name || ''));
                setContacts(updated);
                localStorage.setItem('demo_contacts', JSON.stringify(updated));
            } else {
                await ensureAuth();
                const contactRef = doc(db, 'contacts', id);
                await updateDoc(contactRef, updates);
                const updated = contacts.map(c => c.id === id ? { ...c, ...updates } : c)
                                        .sort((a, b) => collator.compare(a.name || '', b.name || ''));
                setContacts(updated);
            }
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

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
