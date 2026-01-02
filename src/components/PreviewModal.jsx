import { X, Printer } from 'lucide-react';
import { PrintableLabel } from './PrintableLabel';

export function PreviewModal({ isOpen, onClose, contacts, pageSize, orientation, onPrint }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    {/* Header */}
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Print Preview
                            </h3>
                            <button
                                onClick={onClose}
                                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <span className="sr-only">Close</span>
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                            Settings: {pageSize} - {orientation}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-gray-50 p-6 h-[60vh] overflow-y-auto">
                        <div className="mx-auto bg-white shadow-lg origin-top transform scale-75 sm:scale-100 transition-transform">
                             {/* We render the PrintableLabel here for visualization.
                                Note: The @page styles inside PrintableLabel are media="print", so they won't affect this container's dimensions on screen.
                                The content will just render as a list of cards. */}
                            <PrintableLabel
                                contacts={contacts}
                                pageSize={pageSize}
                                orientation={orientation}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onPrint}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
