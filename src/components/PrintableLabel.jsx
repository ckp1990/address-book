import React from 'react';
import { formatAddress } from '../lib/utils';

export const PrintableLabel = React.forwardRef(({ contacts, pageSize = 'A5', orientation = 'landscape' }, ref) => {
    return (
        <div ref={ref} className="p-8 bg-white">
            <style type="text/css" media="print">
                {`
                    @page {
                        size: ${pageSize} ${orientation};
                        margin: 0;
                    }
                    body {
                        -webkit-print-color-adjust: exact;
                    }
                `}
            </style>

            {contacts.map((contact, index) => (
                <div
                    key={contact.id}
                    className="mb-8 border-2 border-gray-800 p-8 rounded-xl break-inside-avoid page-break-after-always"
                    style={{ pageBreakAfter: 'always', width: '100%', height: '100%' }}
                >
                    <div className="flex flex-col gap-2 text-gray-900 font-sans">
                        <h1 className="text-3xl font-bold mb-4 uppercase tracking-wide border-b-2 border-gray-800 pb-2">
                            {contact.name}
                        </h1>

                        <div className="text-xl leading-relaxed space-y-1">
                            <div className="font-medium">
                                {formatAddress(contact.address)}
                            </div>
                            <p>{contact.city}, {contact.state}</p>
                            <p>{contact.country} - <span className="font-bold">{contact.pincode}</span></p>
                        </div>

                        <div className="mt-8 pt-4 border-t border-gray-300">
                            <p className="text-lg font-mono">
                                <span className="font-bold mr-2">PH:</span>
                                {contact.phone}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
});

PrintableLabel.displayName = 'PrintableLabel';
