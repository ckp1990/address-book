/**
 * Simple XOR-based obfuscation for client-side storage.
 * NOTE: This is NOT strong encryption. It is intended to prevent
 * sensitive keys from being stored in plaintext in LocalStorage,
 * providing a basic layer of protection against casual inspection.
 */

const SALT = 'address-label-printer-salt';

/**
 * Obfuscates a string using XOR and Base64.
 * @param {string} text - The text to obfuscate.
 * @returns {string} - The obfuscated string.
 */
export function obfuscate(text) {
    if (!text) return '';

    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ SALT.charCodeAt(i % SALT.length));
    }

    // Use btoa for Base64 encoding (available in browsers and Bun)
    return btoa(result);
}

/**
 * Deobfuscates a string that was obfuscated with the above function.
 * @param {string} encodedText - The obfuscated string.
 * @returns {string} - The original text.
 */
export function deobfuscate(encodedText) {
    if (!encodedText) return '';

    try {
        // Use atob for Base64 decoding
        const text = atob(encodedText);
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ SALT.charCodeAt(i % SALT.length));
        }
        return result;
    } catch (e) {
        console.error("Deobfuscation failed:", e);
        return '';
    }
}
