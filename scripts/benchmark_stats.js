import { performance } from 'perf_hooks';

// Mock latency in milliseconds (e.g., 500ms round-trip)
const LATENCY_MS = 500;

// Mock getCountFromServer
// eslint-disable-next-line no-unused-vars
const mockGetCountFromServer = async (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: () => ({ count: Math.floor(Math.random() * 10) })
      });
    }, LATENCY_MS);
  });
};

// Mock query
const mockQuery = (ref, ...constraints) => {
  return { ref, constraints };
};

// Current Implementation (Sequential)
async function measureSequential() {
  const start = performance.now();

  // Simulate admin query
  const adminQuery = mockQuery({}, 'admin');
  const adminSnapshot = await mockGetCountFromServer(adminQuery);

  // Simulate user query
  const userQuery = mockQuery({}, 'user');
  const userSnapshot = await mockGetCountFromServer(userQuery);

  const end = performance.now();

  return {
    time: end - start,
    stats: {
      admins: adminSnapshot.data().count,
      users: userSnapshot.data().count
    }
  };
}

// Optimized Implementation (Concurrent)
async function measureConcurrent() {
  const start = performance.now();

  const adminQuery = mockQuery({}, 'admin');
  const userQuery = mockQuery({}, 'user');

  const [adminSnapshot, userSnapshot] = await Promise.all([
    mockGetCountFromServer(adminQuery),
    mockGetCountFromServer(userQuery)
  ]);

  const end = performance.now();

  return {
    time: end - start,
    stats: {
      admins: adminSnapshot.data().count,
      users: userSnapshot.data().count
    }
  };
}

async function runBenchmark() {
  console.log('Running benchmark with simulated latency:', LATENCY_MS, 'ms');

  console.log('--- Sequential Execution ---');
  const seqResult = await measureSequential();
  console.log(`Time: ${seqResult.time.toFixed(2)} ms`);

  console.log('--- Concurrent Execution ---');
  const concResult = await measureConcurrent();
  console.log(`Time: ${concResult.time.toFixed(2)} ms`);

  const improvement = seqResult.time - concResult.time;
  const percentImprovement = (improvement / seqResult.time) * 100;

  console.log('----------------------------');
  console.log(`Improvement: ${improvement.toFixed(2)} ms (${percentImprovement.toFixed(2)}%)`);
}

runBenchmark();
