// Benchmark: Measure cost of filtering contacts by selected IDs
// This script simulates the "Unoptimized" path where filter runs on every render.
// Run with: node scripts/benchmark_selection.js

const NUM_CONTACTS = 2000;
const NUM_SELECTED = 500;
const NUM_ITERATIONS = 10000;

console.log(`\n--- BENCHMARK: Contact Selection Filter ---`);
console.log(`Contacts: ${NUM_CONTACTS}`);
console.log(`Selected: ${NUM_SELECTED}`);
console.log(`Iterations: ${NUM_ITERATIONS}`);

// 1. Generate Data
const contacts = Array.from({ length: NUM_CONTACTS }, (_, i) => ({
  id: `contact-${i}`,
  name: `User ${i}`,
  phone: `555-000-${i}`
}));

const selectedIds = new Set();
// Select random contacts
while (selectedIds.size < NUM_SELECTED) {
  const randomId = `contact-${Math.floor(Math.random() * NUM_CONTACTS)}`;
  selectedIds.add(randomId);
}

// 2. Measure Unoptimized Performance
const start = performance.now();

let resultCount = 0;
for (let i = 0; i < NUM_ITERATIONS; i++) {
  // SIMULATING THE REACT RENDER:
  // const selectedContacts = contacts.filter(c => selectedContactIds.has(c.id));
  const result = contacts.filter(c => selectedIds.has(c.id));
  resultCount += result.length; // Prevent optimization
}

const end = performance.now();
const duration = end - start;
const avgPerRender = duration / NUM_ITERATIONS;

console.log(`Processed ${resultCount} items.`); // Use resultCount to avoid unused var error
console.log(`\nRESULTS:`);
console.log(`Total Time: ${duration.toFixed(2)} ms`);
console.log(`Avg Cost per Render: ${avgPerRender.toFixed(4)} ms`);
console.log(`Throughput: ${(NUM_ITERATIONS / (duration / 1000)).toFixed(2)} ops/sec`);
console.log(`------------------------------------------\n`);
