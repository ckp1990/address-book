import { useState } from 'react';
import { Cloud, Database, ArrowRight, Loader2, Info, Check } from 'lucide-react';
import { saveFirebaseConfig, setLocalModeConfig } from '../lib/firebase';
import logo from '../assets/logo.png';

export function Installer() {
    const [mode, setMode] = useState(null); // 'cloud' | 'local'
    const [loading, setLoading] = useState(false);

    // Cloud Form State
    const [apiKey, setApiKey] = useState('');
    const [projectId, setProjectId] = useState('');
    const [appId, setAppId] = useState('');
    const [authDomain, setAuthDomain] = useState('');
    const [storageBucket, setStorageBucket] = useState('');
    const [messagingSenderId, setMessagingSenderId] = useState('');
    const [cloudError, setCloudError] = useState('');

    // Local Form State
    const [username, setUsername] = useState('');
    const [localError, setLocalError] = useState('');

    const handleCloudSubmit = (e) => {
        e.preventDefault();
        setCloudError('');
        setLoading(true);

        try {
            saveFirebaseConfig({
                apiKey,
                projectId,
                appId,
                authDomain,
                storageBucket,
                messagingSenderId
            });
            // Page reloads on success
        } catch (err) {
            setCloudError(err.message);
            setLoading(false);
        }
    };

    const handleLocalSubmit = (e) => {
        e.preventDefault();
        setLocalError('');
        setLoading(true);

        try {
            setLocalModeConfig(username);
            // Page reloads on success
        } catch (err) {
            setLocalError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center">
                    <img src={logo} alt="Address Label Printer" className="mx-auto h-24 w-24 object-contain rounded-2xl shadow-sm" />
                    <h1 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight">
                        Welcome to Address Label Printer
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Please select how you would like to store your data to get started.
                    </p>
                </div>

                {!mode && (
                    <div className="grid md:grid-cols-2 gap-6 mt-10">
                        {/* Cloud Option */}
                        <button
                            onClick={() => setMode('cloud')}
                            className="group relative flex flex-col p-8 bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-blue-500 transition-all hover:shadow-md text-left"
                        >
                            <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4 group-hover:bg-blue-600 transition-colors">
                                <Cloud className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Cloud Database</h3>
                            <p className="text-gray-500 mb-6 flex-grow">
                                Store your data securely in the cloud using Google Firebase.
                                Perfect for accessing your contacts from multiple devices and sharing with a team.
                            </p>
                            <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                                Setup Firebase <ArrowRight className="ml-2 w-4 h-4" />
                            </div>
                        </button>

                        {/* Local Option */}
                        <button
                            onClick={() => setMode('local')}
                            className="group relative flex flex-col p-8 bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-green-500 transition-all hover:shadow-md text-left"
                        >
                            <div className="p-3 bg-green-100 rounded-xl w-fit mb-4 group-hover:bg-green-600 transition-colors">
                                <Database className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Local Database</h3>
                            <p className="text-gray-500 mb-6 flex-grow">
                                Store data privately in your browser's storage.
                                No internet connection required. Data stays on this device only.
                            </p>
                            <div className="flex items-center text-green-600 font-medium group-hover:translate-x-1 transition-transform">
                                Use Local Storage <ArrowRight className="ml-2 w-4 h-4" />
                            </div>
                        </button>
                    </div>
                )}

                {/* Cloud Setup Form */}
                {mode === 'cloud' && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto border border-gray-100">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Cloud className="w-5 h-5 text-blue-600" />
                                Configure Firebase
                            </h3>
                            <button onClick={() => setMode(null)} className="text-sm text-gray-500 hover:text-gray-900">
                                Change Mode
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium">Need help?</p>
                                    <p>Check the <a href="FIREBASE_SETUP.md" target="_blank" className="underline hover:text-blue-900">Setup Guide</a> for instructions on how to get these keys from the Firebase Console.</p>
                                </div>
                            </div>

                            <form onSubmit={handleCloudSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">API Key <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="AIzaTy..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Project ID <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            value={projectId}
                                            onChange={(e) => setProjectId(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="my-app-123"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">App ID <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            value={appId}
                                            onChange={(e) => setAppId(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="1:1234567890:web:..."
                                        />
                                    </div>
                                    <div className="md:col-span-2 pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">Optional Configuration</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Auth Domain</label>
                                        <input
                                            type="text"
                                            value={authDomain}
                                            onChange={(e) => setAuthDomain(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="my-app.firebaseapp.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Storage Bucket</label>
                                        <input
                                            type="text"
                                            value={storageBucket}
                                            onChange={(e) => setStorageBucket(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="my-app.appspot.com"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Messaging Sender ID</label>
                                        <input
                                            type="text"
                                            value={messagingSenderId}
                                            onChange={(e) => setMessagingSenderId(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="1234567890"
                                        />
                                    </div>
                                </div>

                                {cloudError && (
                                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                                        {cloudError}
                                    </div>
                                )}

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Check className="w-5 h-5 mr-2" />}
                                        Save & Connect
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Local Setup Form */}
                {mode === 'local' && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-lg mx-auto border border-gray-100">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Database className="w-5 h-5 text-green-600" />
                                Setup Local User
                            </h3>
                            <button onClick={() => setMode(null)} className="text-sm text-gray-500 hover:text-gray-900">
                                Change Mode
                            </button>
                        </div>
                        <div className="p-8">
                             <div className="mb-6 bg-yellow-50 border border-yellow-100 rounded-lg p-4 flex gap-3">
                                <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-yellow-800">
                                    <p className="font-medium">Important Note</p>
                                    <p>Your data will be stored in this browser only. Clearing browser data will delete your contacts.</p>
                                </div>
                            </div>

                            <form onSubmit={handleLocalSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">This name will be displayed in the app.</p>
                                </div>

                                {localError && (
                                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                                        {localError}
                                    </div>
                                )}

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Check className="w-5 h-5 mr-2" />}
                                        Create Local Profile
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
