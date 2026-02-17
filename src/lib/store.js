import { useState, useEffect, useCallback } from 'react';
import { db, ensureAuth } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

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
        if (isDemo && !loading) {
            localStorage.setItem('demo_contacts', JSON.stringify(contacts));
        }
    }, [contacts, isDemo, loading]);

    useEffect(() => {
        async function fetchContacts() {
            setLoading(true);
            try {
                if (isDemo) {
                    // Load from LocalStorage
                    const localData = JSON.parse(localStorage.getItem('demo_contacts') || '[]');
                    setContacts(localData);
                } else {
                    // Load from Firebase
                    await ensureAuth();
                    const contactsRef = collection(db, 'contacts');

                    try {
                        const q = query(contactsRef, orderBy('created_at', 'desc'));
                        const querySnapshot = await getDocs(q);
                        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        setContacts(data);
                    } catch (idxError) {
                        console.warn("Index missing or error, fetching without sort:", idxError);
                        // Fallback to unsorted fetch
                        const querySnapshot = await getDocs(contactsRef);
                        // Client-side sort with Schwartzian transform for performance
                        const data = querySnapshot.docs
                            .map(doc => {
                                const d = doc.data();
                                return {
                                    id: doc.id,
                                    ...d,
                                    _sortTime: new Date(d.created_at).getTime()
                                };
                            })
                            .sort((a, b) => b._sortTime - a._sortTime)
                            // eslint-disable-next-line no-unused-vars
                            .map(({ _sortTime, ...rest }) => rest);
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
                setContacts(prev => [newContact, ...prev]);
                return newContact;
            } else {
                await ensureAuth();
                const docRef = await addDoc(collection(db, 'contacts'), newContactData);
                const savedContact = { id: docRef.id, ...newContactData };
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
