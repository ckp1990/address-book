import { useState, useRef } from 'react';
import { Plus, Search, Loader2, Users, Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { Layout } from './components/Layout';
import { ContactCard } from './components/ContactCard';
import { ContactForm } from './components/ContactForm';
import { PrintableLabel } from './components/PrintableLabel';
import { Login } from './components/Login';
import { useContacts } from './lib/store';

const CREDENTIALS = {
  admin: { password: 'Warlord@12', role: 'admin' },
  user: { password: 'CWS$2025', role: 'user' }
};

function App() {
  const { contacts, loading, isDemo, addContact, updateContact, deleteContact } = useContacts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [selectedContactIds, setSelectedContactIds] = useState(new Set());
  const printComponentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printComponentRef,
    documentTitle: 'Contact-Labels',
  });

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone?.includes(searchQuery)
  );

  const handleSelect = (id, isSelected) => {
    const newSelected = new Set(selectedContactIds);
    if (isSelected) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedContactIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedContactIds.size === filteredContacts.length) {
      setSelectedContactIds(new Set());
    } else {
      setSelectedContactIds(new Set(filteredContacts.map(c => c.id)));
    }
  };

  const selectedContacts = contacts.filter(c => selectedContactIds.has(c.id));

  const handleLogin = (username, password) => {
    const creds = CREDENTIALS[username];
    if (creds && creds.password === password) {
      setUser({ username, role: creds.role });
    } else {
      throw new Error('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const canEdit = user.role === 'admin';
  const canDelete = user.role === 'admin';

  const handleAdd = () => {
    setEditingContact(null);
    setIsFormOpen(true);
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data) => {
    if (editingContact) {
      await updateContact(editingContact.id, data);
    } else {
      await addContact(data);
    }
  };

  return (
    <Layout isDemo={isDemo} onLogout={handleLogout}>
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
        <div className="flex gap-3 w-full sm:w-auto">
          {selectedContactIds.size > 0 && (
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              <Printer className="mr-2 h-5 w-5" />
              Print ({selectedContactIds.size})
            </button>
          )}
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
      {loading ? (
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

      <div style={{ display: 'none' }}>
        <PrintableLabel
          ref={printComponentRef}
          contacts={selectedContacts}
        />
      </div>
    </Layout>
  );
}

export default App;
