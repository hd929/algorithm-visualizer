import { AlgorithmStep } from '../../types/algorithm';
import { DijkstraNode, DijkstraEdge, DijkstraSnapshot, PriorityQueueItem } from '../../types/dijkstra';

const INF = 999;

export function getDefaultDijkstraGraph(): { nodes: DijkstraNode[]; edges: DijkstraEdge[] } {
  const nodes: DijkstraNode[] = [
    { id: 0, x: 80, y: 180, dist: INF, visited: false, parent: null },
    { id: 1, x: 220, y: 90, dist: INF, visited: false, parent: null },
    { id: 2, x: 220, y: 270, dist: INF, visited: false, parent: null },
    { id: 3, x: 380, y: 90, dist: INF, visited: false, parent: null },
    { id: 4, x: 380, y: 270, dist: INF, visited: false, parent: null },
    { id: 5, x: 500, y: 180, dist: INF, visited: false, parent: null },
  ];

  const edges: DijkstraEdge[] = [
    { id: 'e-0-1', u: 0, v: 1, weight: 4, state: 'idle' },
    { id: 'e-0-2', u: 0, v: 2, weight: 2, state: 'idle' },
    { id: 'e-2-1', u: 2, v: 1, weight: 1, state: 'idle' },
    { id: 'e-1-3', u: 1, v: 3, weight: 5, state: 'idle' },
    { id: 'e-2-4', u: 2, v: 4, weight: 8, state: 'idle' },
    { id: 'e-1-4', u: 1, v: 4, weight: 10, state: 'idle' },
    { id: 'e-3-4', u: 3, v: 4, weight: 2, state: 'idle' },
    { id: 'e-3-5', u: 3, v: 5, weight: 6, state: 'idle' },
    { id: 'e-4-5', u: 4, v: 5, weight: 2, state: 'idle' },
  ];

  return { nodes, edges };
}

export function recordDijkstraSimulation(
  startNode: number = 0,
  customNodes?: DijkstraNode[],
  customEdges?: DijkstraEdge[]
): AlgorithmStep<DijkstraSnapshot>[] {
  const defaultData = getDefaultDijkstraGraph();
  const rawNodes = customNodes || defaultData.nodes;
  const rawEdges = customEdges || defaultData.edges;

  const steps: AlgorithmStep<DijkstraSnapshot>[] = [];
  let stepIndex = 0;

  const n = rawNodes.length;
  const dist = new Array(n).fill(INF);
  const visited = new Array(n).fill(false);
  const parent = new Array(n).fill(null);

  const nodes = rawNodes.map((node) => ({
    ...node,
    dist: INF,
    visited: false,
    parent: null,
  }));

  const edges: DijkstraEdge[] = rawEdges.map((e) => ({ ...e, state: 'idle' }));

  // Adjacency list
  const adj: { v: number; weight: number; edgeId: string }[][] = Array.from({ length: n }, () => []);
  for (const e of edges) {
    adj[e.u].push({ v: e.v, weight: e.weight, edgeId: e.id });
  }

  let pq: PriorityQueueItem[] = [];

  const cloneSnapshot = (
    currentU: number | null = null,
    activeEdgeId: string | null = null,
    logMsg: string = ''
  ): DijkstraSnapshot => ({
    nodes: nodes.map((nd, idx) => ({
      ...nd,
      dist: dist[idx],
      visited: visited[idx],
      parent: parent[idx],
    })),
    edges: edges.map((ed) => ({ ...ed })),
    pq: [...pq],
    currentNode: currentU,
    activeEdge: activeEdgeId,
    sourceNode: startNode,
    targetNode: n - 1,
    dist: [...dist],
    visited: [...visited],
    logMessage: logMsg,
  });

  // Step 0: Initialization
  dist[startNode] = 0;
  pq.push({ dist: 0, node: startNode });

  steps.push({
    stepIndex: stepIndex++,
    title: `Khởi tạo Dijkstra từ đỉnh nguồn ${startNode}`,
    description: `Khởi tạo khoảng cách dist[${startNode}] = 0, các đỉnh còn lại gán bằng ∞ (vô cực). Đưa đỉnh ${startNode} vào Priority Queue.`,
    detail: 'Hàng đợi ưu tiên Min-Heap sẽ luôn lấy ra đỉnh có khoảng cách tạm thời nhỏ nhất.',
    codeLine: 5,
    actionType: 'INIT',
    variables: {
      source: startNode,
      'dist[source]': 0,
      'pq.size': pq.length,
    },
    dataSnapshot: cloneSnapshot(startNode, null, `Khởi tạo đỉnh nguồn ${startNode} với dist = 0.`),
  });

  // Main Loop
  while (pq.length > 0) {
    // Sort min-heap
    pq.sort((a, b) => a.dist - b.dist);
    const topItem = pq.shift()!;
    const u = topItem.node;
    const d = topItem.dist;

    // Step: Extract min
    steps.push({
      stepIndex: stepIndex++,
      title: `Lấy đỉnh ${u} từ Priority Queue (dist = ${d})`,
      description: `Đỉnh ${u} có khoảng cách nhỏ nhất hiện tại trong hàng đợi ưu tiên (dist = ${d}).`,
      detail: visited[u]
        ? `Đỉnh ${u} đã được chốt trước đó (stale entry), bước này sẽ bỏ qua.`
        : `Đỉnh ${u} được chốt là khoảng cách ngắn nhất tối ưu!`,
      codeLine: 9,
      actionType: 'EXTRACT_MIN',
      variables: {
        currentNode: u,
        dist: d,
        'pq.size': pq.length,
      },
      dataSnapshot: cloneSnapshot(u, null, `Lấy đỉnh ${u} ra khỏi hàng đợi ưu tiên (dist=${d}).`),
    });

    if (d > dist[u]) {
      continue;
    }

    visited[u] = true;

    // Relax outgoing edges
    for (const neighbor of adj[u]) {
      const v = neighbor.v;
      const weight = neighbor.weight;
      const edgeId = neighbor.edgeId;

      // Find edge
      const edgeObj = edges.find((e) => e.id === edgeId);
      if (edgeObj) edgeObj.state = 'exploring';

      // Step: Explore edge
      steps.push({
        stepIndex: stepIndex++,
        title: `Kiểm tra cạnh (${u} ➔ ${v}, trọng số ${weight})`,
        description: `Thử đi từ ${u} sang ${v}. Chi phí mới = dist[${u}] (${dist[u]}) + w (${weight}) = ${dist[u] + weight}.`,
        detail: `So sánh với dist[${v}] hiện tại (${dist[v] === INF ? '∞' : dist[v]}).`,
        codeLine: 14,
        actionType: 'SEARCH_STEP',
        variables: {
          from: u,
          to: v,
          weight,
          'dist[u] + w': dist[u] + weight,
          'current dist[v]': dist[v] === INF ? '∞' : dist[v],
        },
        dataSnapshot: cloneSnapshot(
          u,
          edgeId,
          `Xét cạnh (${u} ➔ ${v}): ${dist[u]} + ${weight} = ${dist[u] + weight} vs ${dist[v] === INF ? '∞' : dist[v]}`
        ),
      });

      if (dist[u] + weight < dist[v]) {
        const oldDist = dist[v];
        dist[v] = dist[u] + weight;
        parent[v] = u;
        pq.push({ dist: dist[v], node: v });

        if (edgeObj) edgeObj.state = 'relaxed';

        steps.push({
          stepIndex: stepIndex++,
          title: `⚡ Thư giãn cạnh (${u} ➔ ${v}): Cập nhật dist[${v}] = ${dist[v]}`,
          description: `Đã tìm thấy đường đi ngắn hơn đến đỉnh ${v}! Khoảng cách giảm từ ${oldDist === INF ? '∞' : oldDist} xuống ${dist[v]}.`,
          detail: `Cập nhật parent[${v}] = ${u}, đồng thời đẩy cặp (${dist[v]}, ${v}) vào Priority Queue.`,
          codeLine: 16,
          actionType: 'RELAX_EDGE',
          variables: {
            relaxedNode: v,
            oldDist: oldDist === INF ? '∞' : oldDist,
            newDist: dist[v],
            parent: u,
          },
          dataSnapshot: cloneSnapshot(
            v,
            edgeId,
            `Thư giãn thành công! dist[${v}] cập nhật thành ${dist[v]}. Đẩy {${dist[v]}, ${v}} vào PQ.`
          ),
        });
      } else {
        if (edgeObj) edgeObj.state = 'idle';
      }
    }
  }

  // Final Step: Shortest path tree highlight
  for (let i = 0; i < n; i++) {
    if (parent[i] !== null) {
      const p = parent[i];
      const edgeTree = edges.find((e) => e.u === p && e.v === i);
      if (edgeTree) edgeTree.state = 'tree';
    }
  }

  steps.push({
    stepIndex: stepIndex++,
    title: '🎉 Hoàn tất thuật toán Dijkstra!',
    description: `Đã tìm được khoảng cách ngắn nhất từ đỉnh nguồn ${startNode} đến tất cả các đỉnh khác trong đồ thị.`,
    detail: `Cây đường đi ngắn nhất (Shortest Path Tree) được làm nổi bật với màu xanh lục phát sáng.`,
    codeLine: 20,
    actionType: 'COMPLETE',
    variables: {
      source: startNode,
      targetDist: dist[n - 1] === INF ? 'Không đến được' : dist[n - 1],
      totalVisited: visited.filter(Boolean).length,
    },
    dataSnapshot: cloneSnapshot(null, null, `Dijkstra hoàn tất. Khoảng cách đến đỉnh đích ${n - 1} là ${dist[n - 1]}.`),
  });

  return steps;
}
