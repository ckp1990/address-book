import { ConnectionBanner } from './ConnectionBanner';
import { LogOut } from 'lucide-react';

export function Layout({ children, isDemo, onLogout }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <ConnectionBanner isDemo={isDemo} />
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Address Book</h1>
                    </div>
                    {onLogout && (
                        <button
                            onClick={onLogout}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <LogOut className="h-5 w-5 mr-2" />
                            Sign out
                        </button>
                    )}
                </div>
            </header>
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
            </main>
            <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Address Book App. Built with React & Supabase.</p>
                </div>
            </footer>
        </div>
    );
}
