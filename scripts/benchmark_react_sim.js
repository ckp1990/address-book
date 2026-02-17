
import { performance } from 'perf_hooks';

// Simulate a React component render
function simulateRender(contacts, searchQuery, selectedContactIds, useOptimization) {
    const start = performance.now();

    // 1. Filtering contacts (like in App.jsx)
    let filteredContacts;
    if (useOptimization && simulateRender.memoizedFiltered && simulateRender.lastSearch === searchQuery && simulateRender.lastContacts === contacts) {
        filteredContacts = simulateRender.memoizedFiltered;
    } else {
        filteredContacts = contacts.filter(contact =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.phone?.includes(searchQuery)
        );
        if (useOptimization) {
            simulateRender.memoizedFiltered = filteredContacts;
            simulateRender.lastSearch = searchQuery;
            simulateRender.lastContacts = contacts;
        }
    }

    // 2. handleSelect (like in App.jsx)
    let handleSelect;
    if (useOptimization) {
        if (!simulateRender.memoizedHandleSelect) {
            simulateRender.memoizedHandleSelect = (id, isSelected) => { /* ... */ };
        }
        handleSelect = simulateRender.memoizedHandleSelect;
    } else {
        handleSelect = (id, isSelected) => { /* ... */ };
    }

    // 3. Simulating Child Renders (ContactCard)
    let childRenders = 0;
    filteredContacts.forEach(contact => {
        const isSelected = selectedContactIds.has(contact.id);
        const propsChanged = !useOptimization ||
                             simulateRender.lastChildProps?.[contact.id]?.handleSelect !== handleSelect ||
                             simulateRender.lastChildProps?.[contact.id]?.isSelected !== isSelected ||
                             simulateRender.lastChildProps?.[contact.id]?.contact !== contact;

        if (propsChanged) {
            childRenders++;
            // Simulate some work in ContactCard
            let x = 0;
            for(let i=0; i<100; i++) x += i;
        }

        if (useOptimization) {
            if (!simulateRender.lastChildProps) simulateRender.lastChildProps = {};
            simulateRender.lastChildProps[contact.id] = { handleSelect, isSelected, contact };
        }
    });

    const end = performance.now();
    return { time: end - start, childRenders };
}

const contacts = Array.from({ length: 2000 }, (_, i) => ({
    id: i,
    name: `Contact ${i}`,
    phone: `555-010${i}`,
    created_at: new Date().toISOString()
}));

const selectedContactIds = new Set([1, 2, 3]);
const searchQuery = "";

console.log("--- Baseline (No Optimization) ---");
let totalBaselineTime = 0;
for(let i=0; i<10; i++) {
    const { time, childRenders } = simulateRender(contacts, searchQuery, selectedContactIds, false);
    totalBaselineTime += time;
    if (i === 0) console.log(`First render: ${time.toFixed(4)}ms, child renders: ${childRenders}`);
}
console.log(`Average render time (subsequent): ${(totalBaselineTime / 10).toFixed(4)}ms`);

// Reset "memo" for optimized run
simulateRender.memoizedFiltered = null;
simulateRender.memoizedHandleSelect = null;
simulateRender.lastChildProps = null;

console.log("\n--- Optimized (useCallback + React.memo + useMemo) ---");
let totalOptimizedTime = 0;
// First render is always full
const first = simulateRender(contacts, searchQuery, selectedContactIds, true);
console.log(`First render (cold): ${first.time.toFixed(4)}ms, child renders: ${first.childRenders}`);

// Subsequent renders with same props but one selection change
const newSelected = new Set(selectedContactIds);
newSelected.add(10);

for(let i=0; i<10; i++) {
    const { time, childRenders } = simulateRender(contacts, searchQuery, newSelected, true);
    totalOptimizedTime += time;
    if (i === 0) console.log(`Render with 1 selection change: ${time.toFixed(4)}ms, child renders: ${childRenders}`);
}
console.log(`Average optimized render time: ${(totalOptimizedTime / 10).toFixed(4)}ms`);
