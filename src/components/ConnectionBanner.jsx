import { AlertTriangle, Database } from 'lucide-react';

export function ConnectionBanner({ isDemo, onSetupClick }) {
    if (!isDemo) return null;

    return (
        <div className="bg-indigo-50 border-b border-indigo-100 p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                        <Database size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-indigo-900">Demo Mode Active</h3>
                        <p className="text-sm text-indigo-700">
                            Data is saved to your browser (Local Storage). Connect Supabase to save to the cloud.
                        </p>
                    </div>
                </div>
                <button
                    onClick={onSetupClick}
                    className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 underline decoration-indigo-300 underline-offset-2"
                >
                    Setup Supabase &rarr;
                </button>
            </div>
        </div>
    );
}
