/* global process */
const N = 2000;

// Generate dummy data
const contacts = Array.from({ length: N }, (_, i) => ({
    id: String(i),
    created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    name: `Contact ${Math.random().toString(36).substring(7)}`
}));

console.log(`Running benchmark with ${N} items...`);

const ITERATIONS = 100;

// Benchmark Old Sort (Date)
let totalOld = 0;
for (let i = 0; i < ITERATIONS; i++) {
    const copy = [...contacts];
    const start = process.hrtime();
    copy.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const end = process.hrtime(start);
    totalOld += (end[0] * 1000 + end[1] / 1e6);
}
console.log(`Old Sort (Date parsing) average: ${(totalOld / ITERATIONS).toFixed(3)} ms`);


// Benchmark New Sort (Name localeCompare)
let totalNew = 0;
for (let i = 0; i < ITERATIONS; i++) {
    const copy = [...contacts];
    const start = process.hrtime();
    copy.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    const end = process.hrtime(start);
    totalNew += (end[0] * 1000 + end[1] / 1e6);
}
console.log(`New Sort (Name localeCompare) average: ${(totalNew / ITERATIONS).toFixed(3)} ms`);

// Benchmark New Sort (Intl.Collator)
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
let totalCollator = 0;
for (let i = 0; i < ITERATIONS; i++) {
    const copy = [...contacts];
    const start = process.hrtime();
    copy.sort((a, b) => collator.compare(a.name, b.name));
    const end = process.hrtime(start);
    totalCollator += (end[0] * 1000 + end[1] / 1e6);
}
console.log(`New Sort (Intl.Collator) average: ${(totalCollator / ITERATIONS).toFixed(3)} ms`);

// Benchmark Simple String Comparison (ASCII)
let totalSimple = 0;
for (let i = 0; i < ITERATIONS; i++) {
    const copy = [...contacts];
    const start = process.hrtime();
    copy.sort((a, b) => (a.name > b.name ? 1 : -1));
    const end = process.hrtime(start);
    totalSimple += (end[0] * 1000 + end[1] / 1e6);
}
console.log(`New Sort (Simple >) average: ${(totalSimple / ITERATIONS).toFixed(3)} ms`);
