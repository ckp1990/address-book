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

    const parts = address
        .split(',')
        .map((part) => part.trim())
        .filter((part) => part !== '');

    if (parts.length === 0) return null;

    return (
        <>
            {parts.map((part, index) => {
                const isLast = index === parts.length - 1;

                return (
                    <span key={index} className="block">
                        {part}{!isLast && ','}
                    </span>
                );
            })}
        </>
    );
}
