import React from 'react';

/**
 * Formats an address string by breaking lines after every comma.
 * The comma is preserved at the end of the line.
 * @param {string} address - The address string to format.
 * @returns {React.ReactNode} - The formatted address as React nodes.
 */
export function formatAddress(address) {
    if (!address) return null;

    // Split by comma.
    // We want to keep the comma attached to the preceding segment.
    // A simple split(',') removes commas.
    // We can split, then re-add commas to all but the last segment if we want precise control.

    const parts = address.split(',');

    return (
        <>
            {parts.map((part, index) => {
                const isLast = index === parts.length - 1;
                const text = part.trim();

                // If text is empty (e.g. trailing comma or double comma), render nothing or simple break?
                // Let's assume we render empty lines if they exist, or just the text.
                // Request says "print words in next line after comma".

                if (!text && !isLast) return <br key={index} />; // Handle empty segments if needed

                return (
                    <span key={index} className="block">
                        {text}{!isLast && ','}
                    </span>
                );
            })}
        </>
    );
}
