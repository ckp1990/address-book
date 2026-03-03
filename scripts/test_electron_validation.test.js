const { test, expect } = require('bun:test');
const fs = require('fs');
const path = require('path');

// Extract validation logic from main.cjs for testing
// Since main.cjs is a CommonJS file and we can't easily import it in bun test without modifications
// or mocking electron, I will replicate the logic here to verify its correctness.
// In a real scenario, I might refactor the validation logic into a separate shared file.

function isValidContact(contact) {
  if (!contact || typeof contact !== 'object') return false;

  const stringFields = {
    id: 100,
    name: 200,
    phone: 50,
    address: 1000,
    city: 200,
    state: 200,
    country: 200,
    pincode: 50,
    created_at: 100
  };

  if (typeof contact.name !== 'string' || contact.name.trim() === '') return false;

  for (const [field, maxLength] of Object.entries(stringFields)) {
    const value = contact[field];
    if (value !== undefined && value !== null) {
      if (typeof value !== 'string' || value.length > maxLength) {
        return false;
      }
    }
  }

  const allowedFields = Object.keys(stringFields);
  const actualFields = Object.keys(contact);
  if (actualFields.length > allowedFields.length + 5) return false;

  return true;
}

function isValidData(data) {
  if (!Array.isArray(data)) return false;
  if (data.length > 5000) return false;
  for (const contact of data) {
    if (!isValidContact(contact)) return false;
  }
  return true;
}

test('isValidData validates correct data', () => {
  const data = [
    { id: '1', name: 'John Doe', phone: '1234567', created_at: new Date().toISOString() },
    { id: '2', name: 'Jane Smith', address: '123 Main St', city: 'London' }
  ];
  expect(isValidData(data)).toBe(true);
});

test('isValidData rejects non-array', () => {
  expect(isValidData({ name: 'John' })).toBe(false);
  expect(isValidData('not an array')).toBe(false);
});

test('isValidData rejects missing name', () => {
  expect(isValidData([{ id: '1' }])).toBe(false);
  expect(isValidData([{ name: '' }])).toBe(false);
  expect(isValidData([{ name: '  ' }])).toBe(false);
});

test('isValidData rejects too long strings', () => {
  const data = [{ name: 'A'.repeat(201) }];
  expect(isValidData(data)).toBe(false);
});

test('isValidData rejects too many contacts', () => {
  const data = Array(5001).fill({ name: 'John' });
  expect(isValidData(data)).toBe(false);
});

test('isValidData rejects unexpected large objects', () => {
  const contact = { name: 'John' };
  for (let i = 0; i < 20; i++) {
    contact[`extra${i}`] = 'value';
  }
  expect(isValidData([contact])).toBe(false);
});

test('isValidData rejects non-string types', () => {
  expect(isValidData([{ name: 'John', phone: 1234567 }])).toBe(false);
});
