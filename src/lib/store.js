import { useState, useEffect } from 'react';
import { db, ensureAuth } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

/**
 * Custom hook to manage contacts.
 * Automatically switches between LocalStorage (Demo) and Firebase (Prod).
 */
export function useContacts(userId) {
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
                    setContacts(localData);
                } else {
                    // Load from Firebase
                    const user = await ensureAuth();
                    if (!user) {
                        setContacts([]);
                        setLoading(false);
                        return;
                    }
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
    }, [isDemo, userId]);

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
                const updated = [newContact, ...contacts];
                setContacts(updated);
                localStorage.setItem('demo_contacts', JSON.stringify(updated));
                return newContact;
            } else {
                await ensureAuth();
                const docRef = await addDoc(collection(db, 'contacts'), newContactData);
                const savedContact = { id: docRef.id, ...newContactData };
                setContacts([savedContact, ...contacts]);
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
                const updated = contacts.map(c => c.id === id ? { ...c, ...updates } : c);
                setContacts(updated);
                localStorage.setItem('demo_contacts', JSON.stringify(updated));
            } else {
                await ensureAuth();
                const contactRef = doc(db, 'contacts', id);
                await updateDoc(contactRef, updates);
                setContacts(contacts.map(c => c.id === id ? { ...c, ...updates } : c));
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
