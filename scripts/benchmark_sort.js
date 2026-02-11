
import { performance } from 'perf_hooks';

const generateData = (count) => {
    const data = [];
    const baseDate = new Date();
    for (let i = 0; i < count; i++) {
        // Random date within the last year
        const date = new Date(baseDate.getTime() - Math.floor(Math.random() * 31536000000));
        data.push({
            id: `id-${i}`,
            name: `Contact ${i}`,
            created_at: date.toISOString(),
            other_field: 'some data'
        });
    }
    return data;
};

const runBenchmark = (label, count, iterations = 100) => {
    console.log(`\nRunning benchmark: ${label} (N=${count}, ${iterations} iterations)`);

    // Generate fresh data for each run to avoid side effects if sorting in place
    // Actually, sort sorts in place, so we must clone data for each iteration.
    const datasets = [];
    for(let i=0; i<iterations; i++) {
        datasets.push(generateData(count));
    }

    // --- Baseline: Direct Sort ---
    const startBaseline = performance.now();
    for(let i=0; i<iterations; i++) {
        const data = [...datasets[i]]; // shallow copy to sort
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    const endBaseline = performance.now();
    const avgBaseline = (endBaseline - startBaseline) / iterations;

    // --- Optimized: Schwartzian Transform (Map -> Sort -> Map) ---
    // This mimics:
    // const mapped = data.map((d, i) => ({ index: i, value: new Date(d.created_at).getTime() }));
    // mapped.sort((a, b) => b.value - a.value);
    // const result = mapped.map(el => data[el.index]);

    // But since we have the object, we can attach it directly to avoid index lookup:
    // const mapped = data.map(d => ({ item: d, time: new Date(d.created_at).getTime() }));
    // mapped.sort((a, b) => b.time - a.time);
    // const result = mapped.map(m => m.item);

    const startSchwartzian = performance.now();
    for(let i=0; i<iterations; i++) {
        const data = datasets[i]; // No need to copy yet, map creates new array
        const mapped = data.map(d => ({ item: d, time: new Date(d.created_at).getTime() }));
        mapped.sort((a, b) => b.time - a.time);
        // eslint-disable-next-line no-unused-vars
        const result = mapped.map(m => m.item);
    }
    const endSchwartzian = performance.now();
    const avgSchwartzian = (endSchwartzian - startSchwartzian) / iterations;

    // --- Optimized: Pre-calculate & Keep (Assume we can modify objects or create new ones with prop) ---
    // In the real code, we do: querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // So we can just add the timestamp there.
    // Here we simulate that by mapping the source data to a new structure with _ts.

    const startPreCalc = performance.now();
    for(let i=0; i<iterations; i++) {
        const data = datasets[i];
        // Simulate the initial map from firestore
        const withTs = data.map(d => ({ ...d, _ts: new Date(d.created_at).getTime() }));
        withTs.sort((a, b) => b._ts - a._ts);
        // If we keep _ts, we are done.
    }
    const endPreCalc = performance.now();
    const avgPreCalc = (endPreCalc - startPreCalc) / iterations;

    console.log(`Baseline (Direct Sort): ${avgBaseline.toFixed(4)} ms`);
    console.log(`Schwartzian (Map-Sort-Map): ${avgSchwartzian.toFixed(4)} ms`);
    console.log(`Pre-calc & Keep (Map-Sort): ${avgPreCalc.toFixed(4)} ms`);

    const speedupSchwartzian = avgBaseline / avgSchwartzian;
    const speedupPreCalc = avgBaseline / avgPreCalc;

    console.log(`Speedup (Schwartzian): ${speedupSchwartzian.toFixed(2)}x`);
    console.log(`Speedup (Pre-calc): ${speedupPreCalc.toFixed(2)}x`);
};

runBenchmark("Small Dataset", 2000, 50);
runBenchmark("Large Dataset", 10000, 20);
