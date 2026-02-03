import { useState, useEffect } from 'react';
import { X, Save, RotateCcw, Database } from 'lucide-react';
import { saveFirebaseConfig, clearFirebaseConfig, isFirebaseConfigured } from '../lib/firebase';

export function SettingsModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [projectId, setProjectId] = useState('');
  const [appId, setAppId] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [storageBucket, setStorageBucket] = useState('');
  const [messagingSenderId, setMessagingSenderId] = useState('');

  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setApiKey(localStorage.getItem('firebase_api_key') || '');
      setProjectId(localStorage.getItem('firebase_project_id') || '');
      setAppId(localStorage.getItem('firebase_app_id') || '');
      setAuthDomain(localStorage.getItem('firebase_auth_domain') || '');
      setStorageBucket(localStorage.getItem('firebase_storage_bucket') || '');
      setMessagingSenderId(localStorage.getItem('firebase_messaging_sender_id') || '');

      setIsConfigured(isFirebaseConfigured());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    try {
        saveFirebaseConfig({
            apiKey,
            projectId,
            appId,
            authDomain,
            storageBucket,
            messagingSenderId
        });
    } catch (e) {
        alert(e.message);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to disconnect Firebase and return to Demo Mode?')) {
      clearFirebaseConfig();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Database Settings
              </h3>

              <form onSubmit={handleSave} className="space-y-4">
                <p className="text-sm text-gray-500">
                  Enter your Firebase Project configuration.
                </p>
                <div>
                    <label className="block text-xs font-medium text-gray-700">API Key *</label>
                    <input type="text" required value={apiKey} onChange={e => setApiKey(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700">Project ID *</label>
                    <input type="text" required value={projectId} onChange={e => setProjectId(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700">App ID *</label>
                    <input type="text" required value={appId} onChange={e => setAppId(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 sm:text-sm" />
                </div>
                {/* Optional Fields hidden in details or just shown */}
                <details className="text-xs text-gray-500">
                    <summary className="cursor-pointer mb-2">Advanced (Optional)</summary>
                    <div className="space-y-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700">Auth Domain</label>
                            <input type="text" value={authDomain} onChange={e => setAuthDomain(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Storage Bucket</label>
                            <input type="text" value={storageBucket} onChange={e => setStorageBucket(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Messaging Sender ID</label>
                            <input type="text" value={messagingSenderId} onChange={e => setMessagingSenderId(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 sm:text-sm" />
                        </div>
                    </div>
                </details>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                        <Save className="mr-2 h-4 w-4" /> Save
                    </button>
                    {isConfigured && (
                        <button type="button" onClick={handleReset} className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:text-sm">
                            <RotateCcw className="mr-2 h-4 w-4" /> Reset
                        </button>
                    )}
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
