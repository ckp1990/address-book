
import { performance } from 'perf_hooks';

const generateData = (count) => {
    const data = [];
    const baseDate = new Date();
    for (let i = 0; i < count; i++) {
        const date = new Date(baseDate.getTime() - Math.floor(Math.random() * 31536000000));
        data.push({
            id: `id-${i}`,
            data: () => ({
                name: `Contact ${i}`,
                created_at: date.toISOString(),
                other_field: 'some data'
            })
        });
    }
    return data;
};

const runBenchmark = (count, iterations = 100) => {
    console.log(`\nRunning benchmark (N=${count}, ${iterations} iterations)`);

    const datasets = [];
    for(let i=0; i<iterations; i++) {
        datasets.push(generateData(count));
    }

    // --- Current Implementation ---
    const startCurrent = performance.now();
    for(let i=0; i<iterations; i++) {
        const docs = datasets[i];
        const data = docs
            .map(doc => {
                const d = doc.data();
                return {
                    id: doc.id,
                    ...d,
                    _sortTime: new Date(d.created_at).getTime()
                };
            })
            .sort((a, b) => b._sortTime - a._sortTime)
            .map(({ _sortTime, ...rest }) => rest);
    }
    const endCurrent = performance.now();
    const avgCurrent = (endCurrent - startCurrent) / iterations;

    // --- Optimization 1: Map-Sort (String comparison) ---
    const startOpt1 = performance.now();
    for(let i=0; i<iterations; i++) {
        const docs = datasets[i];
        const data = docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => {
                if (a.created_at < b.created_at) return 1;
                if (a.created_at > b.created_at) return -1;
                return 0;
            });
    }
    const endOpt1 = performance.now();
    const avgOpt1 = (endOpt1 - startOpt1) / iterations;

    // --- Optimization 2: Map-Sort (new Date inside sort) ---
    const startOpt2 = performance.now();
    for(let i=0; i<iterations; i++) {
        const docs = datasets[i];
        const data = docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    const endOpt2 = performance.now();
    const avgOpt2 = (endOpt2 - startOpt2) / iterations;

    console.log(`Current (Map-Sort-Map): ${avgCurrent.toFixed(4)} ms`);
    console.log(`Opt 1 (Map-Sort String): ${avgOpt1.toFixed(4)} ms`);
    console.log(`Opt 2 (Map-Sort Date): ${avgOpt2.toFixed(4)} ms`);

    console.log(`Speedup Opt 1: ${(avgCurrent / avgOpt1).toFixed(2)}x`);
    console.log(`Speedup Opt 2: ${(avgCurrent / avgOpt2).toFixed(2)}x`);
};

runBenchmark(2000, 50);
runBenchmark(5000, 20);
