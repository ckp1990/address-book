import { useState, useEffect } from 'react';
import { supabase } from './supabase';

/**
 * Custom hook to manage contacts.
 * Automatically switches between LocalStorage (Demo) and Supabase (Prod).
 */
export function useContacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isDemo = !supabase;

    useEffect(() => {
        fetchContacts();
    }, []);

    async function fetchContacts() {
        setLoading(true);
        try {
            if (isDemo) {
                // Load from LocalStorage
                const localData = JSON.parse(localStorage.getItem('demo_contacts') || '[]');
                setContacts(localData);
            } else {
                // Load from Supabase
                const { data, error } = await supabase
                    .from('contacts')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setContacts(data || []);
            }
        } catch (err) {
            console.error('Error fetching contacts:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function addContact(contact) {
        try {
            if (isDemo) {
                const newContact = {
                    id: crypto.randomUUID(),
                    created_at: new Date().toISOString(),
                    ...contact
                };
                const updated = [newContact, ...contacts];
                setContacts(updated);
                localStorage.setItem('demo_contacts', JSON.stringify(updated));
                return newContact;
            } else {
                const { data, error } = await supabase
                    .from('contacts')
                    .insert([contact])
                    .select()
                    .single();

                if (error) throw error;
                setContacts([data, ...contacts]);
                return data;
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
                const { error } = await supabase
                    .from('contacts')
                    .delete()
                    .eq('id', id);
                if (error) throw error;
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
                const { data, error } = await supabase
                    .from('contacts')
                    .update(updates)
                    .eq('id', id)
                    .select()
                    .single();
                if (error) throw error;
                setContacts(contacts.map(c => c.id === id ? data : c));
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
