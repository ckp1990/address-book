import { useState, useEffect } from 'react';
import { X, Save, RotateCcw, Database } from 'lucide-react';
import { saveConnectionDetails, clearConnectionDetails, isUsingCustomCredentials } from '../lib/supabase';

export function SettingsModal({ isOpen, onClose }) {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedUrl = localStorage.getItem('custom_supabase_url') || '';
      const storedKey = localStorage.getItem('custom_supabase_key') || '';
      setUrl(storedUrl);
      setKey(storedKey);
      setIsCustom(isUsingCustomCredentials());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (url && key) {
      saveConnectionDetails(url, key);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to disconnect your custom Supabase database?')) {
      clearConnectionDetails();
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
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Database Connection Settings
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-4">
                  Connect your own Supabase project to sync your contacts to the cloud.
                </p>

                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                      Supabase URL
                    </label>
                    <input
                      type="text"
                      id="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://your-project.supabase.co"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="key" className="block text-sm font-medium text-gray-700">
                      Supabase Anon Key
                    </label>
                    <input
                      type="password"
                      id="key"
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      placeholder="your-anon-key"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save & Connect
                    </button>

                    {isCustom && (
                        <button
                        type="button"
                        onClick={handleReset}
                        className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset to Defaults
                        </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
