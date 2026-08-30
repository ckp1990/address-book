/**
 * Validates a phone number.
 * Allows digits, spaces, hyphens, parentheses, and an optional leading plus.
 * Must be between 7 and 20 characters long and contain at least one digit.
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} - True if valid or empty, false otherwise.
 */
export function validatePhone(phone) {
    if (!phone) return true;
    const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
    return phoneRegex.test(phone) && /\d/.test(phone);
}

/**
 * Validates Firebase configuration fields.
 * @param {Object} config - The Firebase configuration object.
 * @returns {boolean} - True if all present fields are valid.
 */
export function validateFirebaseConfig(config) {
    if (!config) return false;

    const regexes = {
        apiKey: /^[A-Za-z0-9_-]+$/,
        projectId: /^[a-z0-9-]+$/,
        appId: /^1:[0-9]+:web:[a-f0-9]+$/,
        authDomain: /^[a-z0-9.-]+$/,
        storageBucket: /^[a-z0-9.-]+$/,
        messagingSenderId: /^[0-9]+$/
    };

    for (const [key, value] of Object.entries(config)) {
        if (value === undefined || value === null || value === '') continue;
        if (regexes[key] && !regexes[key].test(value)) {
            return false;
        }
    }

    return true;
}
