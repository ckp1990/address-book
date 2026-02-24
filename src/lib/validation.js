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
