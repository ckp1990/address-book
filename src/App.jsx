import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Plus, Search, Loader2, Users, Printer, Settings, Eye, X } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { Layout } from './components/Layout';
import { ContactCard } from './components/ContactCard';
import { ContactForm } from './components/ContactForm';
import { PrintableLabel } from './components/PrintableLabel';
import { SettingsModal } from './components/SettingsModal';
import { PreviewModal } from './components/PreviewModal';
import { UserManagement } from './components/UserManagement';
import { Login } from './components/Login';
import { SetupAdmin } from './components/SetupAdmin';
import { useContacts } from './lib/store';
import { db, auth, signOut, sendEmailVerification } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const PAGE_SIZES = ['A3', 'A4', 'A5', 'Letter', 'Legal'];
const ORIENTATIONS = ['portrait', 'landscape'];

function App() {
  const { contacts, loading: contactsLoading, isDemo, addContact, updateContact, deleteContact } = useContacts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState(new Set());
  const [pageSize, setPageSize] = useState('A5');
  const [orientation, setOrientation] = useState('landscape');

  useEffect(() => {
    if (isDemo) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthLoading(false);
      return;
    }

    const checkSetup = async () => {
      try {
        // Check system/setup document instead of users collection (which is secured)
        const setupDocRef = doc(db, 'system', 'setup');
        const setupDoc = await getDoc(setupDocRef);
        // If system/setup doc exists, setup is done. If not, we need setup.
        // Also fallback: if it doesn't exist, we might be in a legacy state or fresh state.
        // But for this new version, fresh state = no doc.
        setNeedsSetup(!setupDoc.exists());
      } catch (error) {
        console.error("Error checking setup:", error);
        // If we can't read system/setup, likely permission error or network.
        // Assume setup is done to be safe/secure, forcing them to login.
        // If they can't login, they might need to fix rules or manual intervention.
        setNeedsSetup(false);
      }
    };

    checkSetup();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch user role
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUser({ ...currentUser, role: userDoc.data().role });
        } else {
            // Fallback for immediate setup
            setUser({ ...currentUser, role: 'admin' });
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [isDemo]);

  const printComponentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printComponentRef,
    documentTitle: 'Contact-Labels',
    onAfterPrint: () => setIsPreviewOpen(false),
  });

  const filteredContacts = useMemo(() => contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone?.includes(searchQuery)
  ), [contacts, searchQuery]);

  const handleSelect = useCallback((id, isSelected) => {
    setSelectedContactIds(prev => {
      const newSelected = new Set(prev);
      if (isSelected) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      return newSelected;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedContactIds(prev => {
      if (prev.size === filteredContacts.length) {
        return new Set();
      } else {
        return new Set(filteredContacts.map(c => c.id));
      }
    });
  }, [filteredContacts]);

  const handleClearSelection = useCallback(() => {
    setSelectedContactIds(new Set());
  }, []);

  const selectedContacts = useMemo(() => contacts.filter(c => selectedContactIds.has(c.id)), [contacts, selectedContactIds]);

  const handleLogout = useCallback(async () => {
    if (!isDemo) {
      await signOut(auth);
    }
    setUser(null);
  }, [isDemo]);

  if (contactsLoading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (needsSetup && !isDemo && !user) {
    return <SetupAdmin onSetupComplete={() => setNeedsSetup(false)} />;
  }

  if (!user && !isDemo) {
    return <Login />;
  }

  // Check Email Verification
  if (user && !user.emailVerified && !isDemo) {
      return (
          <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
              <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Verification Required</h2>
                  <p className="text-gray-600 mb-6">
                      Please check your email ({user.email}) and click the verification link to access the application.
                  </p>
                  <div className="space-y-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                    >
                        I have verified my email
                    </button>
                    <button
                        onClick={async () => {
                            try {
                                await sendEmailVerification(user);
                                alert("Verification email sent!");
                            } catch (e) {
                                alert(e.message);
                            }
                        }}
                        className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition-colors"
                    >
                        Resend Verification Email
                    </button>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                        Sign Out
                    </button>
                  </div>
              </div>
          </div>
      );
  }

  // In demo mode, we use a fake admin user
  const effectiveUser = isDemo ? { role: 'admin' } : user;
  const canEdit = effectiveUser.role === 'admin';
  const canDelete = effectiveUser.role === 'admin';

  const handleAdd = useCallback(() => {
    setEditingContact(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  }, []);

  const handleSubmit = useCallback(async (data) => {
    if (editingContact) {
      await updateContact(editingContact.id, data);
    } else {
      await addContact(data);
    }
  }, [editingContact, updateContact, addContact]);

  return (
    <Layout
      isDemo={isDemo}
      onLogout={handleLogout}
      onSetupClick={() => setIsSettingsOpen(true)}
      onUserManagementClick={() => setIsUserManagementOpen(true)}
      isAdmin={canEdit} // canEdit is true for admins
    >
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow shadow-sm"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-end">
          {selectedContactIds.size > 0 && (
            <>
              {/* Page Size Dropdown */}
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}
                className="block w-full sm:w-auto pl-3 pr-8 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg shadow-sm"
              >
                {PAGE_SIZES.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>

              {/* Orientation Dropdown */}
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                className="block w-full sm:w-auto pl-3 pr-8 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg shadow-sm capitalize"
              >
                {ORIENTATIONS.map(o => (
                  <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
                ))}
              </select>

              {/* Clear Selection Button */}
              <button
                onClick={handleClearSelection}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                title="Clear Selection"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Preview Button */}
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                <Eye className="mr-2 h-5 w-5" />
                Preview
              </button>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                <Printer className="mr-2 h-5 w-5" />
                Print ({selectedContactIds.size})
              </button>
            </>
          )}
           <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:scale-[1.02]"
          >
            <Plus className="mr-2 h-5 w-5" />
            New Contact
          </button>
        </div>
      </div>

      <div className="flex justify-end mb-4">
          <button
            onClick={handleSelectAll}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {selectedContactIds.size === filteredContacts.length ? 'Deselect All' : 'Select All'}
          </button>
      </div>

      {/* Content Area */}
      {contactsLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : filteredContacts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map(contact => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={handleEdit}
              onDelete={deleteContact}
              canEdit={canEdit}
              canDelete={canDelete}
              onSelect={handleSelect}
              isSelected={selectedContactIds.has(contact.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="mx-auto h-12 w-12 text-gray-300">
            <Users size={48} strokeWidth={1} />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? 'Try adjusting your search terms.' : 'Get started by creating a new contact.'}
          </p>
          {!searchQuery && (
            <div className="mt-6">
              <button
                onClick={handleAdd}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Add Contact
              </button>
            </div>
          )}
        </div>
      )}

      <ContactForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingContact}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <UserManagement
        isOpen={isUserManagementOpen}
        onClose={() => setIsUserManagementOpen(false)}
      />

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        contacts={selectedContacts}
        pageSize={pageSize}
        orientation={orientation}
        onPrint={handlePrint}
      />

      <div style={{ display: 'none' }}>
        <PrintableLabel
          ref={printComponentRef}
          contacts={selectedContacts}
          pageSize={pageSize}
          orientation={orientation}
        />
      </div>
    </Layout>
  );
}

export default App;
