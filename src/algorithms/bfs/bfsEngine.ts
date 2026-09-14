import { AlgorithmStep } from '../../types/algorithm';
import { BFSNode, BFSEdge, BFSSnapshot } from '../../types/bfs';

export function getDefaultBFSGraph(): { nodes: BFSNode[]; edges: BFSEdge[] } {
  const nodes: BFSNode[] = [
    { id: 0, x: 80, y: 180, level: 0, visited: false, parent: null },
    { id: 1, x: 220, y: 100, level: -1, visited: false, parent: null },
    { id: 2, x: 220, y: 260, level: -1, visited: false, parent: null },
    { id: 3, x: 370, y: 70, level: -1, visited: false, parent: null },
    { id: 4, x: 370, y: 180, level: -1, visited: false, parent: null },
    { id: 5, x: 370, y: 290, level: -1, visited: false, parent: null },
    { id: 6, x: 500, y: 180, level: -1, visited: false, parent: null },
  ];

  const edges: BFSEdge[] = [
    { id: 'e-0-1', u: 0, v: 1, state: 'idle' },
    { id: 'e-0-2', u: 0, v: 2, state: 'idle' },
    { id: 'e-1-2', u: 1, v: 2, state: 'idle' },
    { id: 'e-1-3', u: 1, v: 3, state: 'idle' },
    { id: 'e-1-4', u: 1, v: 4, state: 'idle' },
    { id: 'e-2-4', u: 2, v: 4, state: 'idle' },
    { id: 'e-2-5', u: 2, v: 5, state: 'idle' },
    { id: 'e-3-6', u: 3, v: 6, state: 'idle' },
    { id: 'e-4-6', u: 4, v: 6, state: 'idle' },
    { id: 'e-5-6', u: 5, v: 6, state: 'idle' },
  ];

  return { nodes, edges };
}

export function recordBFSSimulation(startNode: number = 0): AlgorithmStep<BFSSnapshot>[] {
  const { nodes: initialNodes, edges: initialEdges } = getDefaultBFSGraph();

  const steps: AlgorithmStep<BFSSnapshot>[] = [];
  let stepIndex = 0;

  const n = initialNodes.length;
  const nodes = initialNodes.map((nd) => ({ ...nd }));
  const edges: BFSEdge[] = initialEdges.map((ed) => ({ ...ed, state: 'idle' }));

  // Adjacency list (undirected)
  const adj: { v: number; edgeId: string }[][] = Array.from({ length: n }, () => []);
  for (const e of edges) {
    adj[e.u].push({ v: e.v, edgeId: e.id });
    adj[e.v].push({ v: e.u, edgeId: e.id });
  }

  const queue: number[] = [];
  const visitedOrder: number[] = [];

  const cloneSnapshot = (
    currentU: number | null,
    msg: string
  ): BFSSnapshot => ({
    nodes: nodes.map((nd) => ({ ...nd })),
    edges: edges.map((ed) => ({ ...ed })),
    queue: [...queue],
    currentNode: currentU,
    visitedOrder: [...visitedOrder],
    logMessage: msg,
  });

  // Step 0: Start BFS
  nodes[startNode].visited = true;
  nodes[startNode].level = 0;
  queue.push(startNode);
  visitedOrder.push(startNode);

  steps.push({
    stepIndex: stepIndex++,
    title: `Bắt đầu BFS từ đỉnh ${startNode}`,
    description: `Đánh dấu visited[${startNode}] = true, gán Level = 0, và đẩy đỉnh ${startNode} vào Hàng đợi (Queue).`,
    detail: 'Thuật toán BFS duyệt theo cơ chế FIFO (First-In, First-Out), khám phá các đỉnh theo từng lớp đồng tâm.',
    codeLine: 5,
    actionType: 'ENQUEUE',
    variables: {
      startNode,
      'Queue': `[${queue.join(', ')}]`,
      'Queue.size': queue.length,
      'Visited.count': 1,
    },
    dataSnapshot: cloneSnapshot(startNode, `Đẩy đỉnh nguồn ${startNode} vào hàng đợi.`),
  });

  // BFS Loop
  while (queue.length > 0) {
    const u = queue.shift()!;

    steps.push({
      stepIndex: stepIndex++,
      title: `Lấy đỉnh ${u} ra khỏi Hàng đợi (Queue.pop)`,
      description: `Đỉnh ${u} ở đầu hàng đợi được lấy ra để kiểm tra các đỉnh lân cận kề với nó.`,
      detail: `Đỉnh ${u} thuộc Lớp (Level) ${nodes[u].level}.`,
      codeLine: 9,
      actionType: 'DEQUEUE',
      variables: {
        currentNode: u,
        currentLevel: nodes[u].level,
        'RemainingQueue': `[${queue.join(', ')}]`,
      },
      dataSnapshot: cloneSnapshot(u, `Lấy đỉnh ${u} từ đầu hàng đợi ra xử lý.`),
    });

    for (const neighbor of adj[u]) {
      const v = neighbor.v;
      const edgeId = neighbor.edgeId;
      const edgeObj = edges.find((e) => e.id === edgeId)!;

      if (!nodes[v].visited) {
        nodes[v].visited = true;
        nodes[v].level = nodes[u].level + 1;
        nodes[v].parent = u;
        queue.push(v);
        visitedOrder.push(v);
        edgeObj.state = 'tree';

        steps.push({
          stepIndex: stepIndex++,
          title: `Khám phá đỉnh mới ${v} (Level ${nodes[v].level})`,
          description: `Từ ${u}, phát hiện đỉnh ${v} chưa được thăm. Đánh dấu visited[${v}] = true và đẩy ${v} vào cuối Hàng đợi.`,
          detail: `Cạnh (${u} - ${v}) trở thành Tree Edge trong cây duyệt BFS. Khoảng cách ngắn nhất từ nguồn đến ${v} là ${nodes[v].level} cạnh.`,
          codeLine: 13,
          actionType: 'ENQUEUE',
          variables: {
            from: u,
            to: v,
            level: nodes[v].level,
            parent: u,
            'Queue': `[${queue.join(', ')}]`,
          },
          dataSnapshot: cloneSnapshot(u, `Thăm đỉnh ${v} (Lớp ${nodes[v].level}), đẩy vào hàng đợi.`),
        });
      } else {
        if (edgeObj.state === 'idle') {
          edgeObj.state = 'cross';
        }
      }
    }
  }

  // Final Step: Complete
  steps.push({
    stepIndex: stepIndex++,
    title: '🎉 Hoàn tất duyệt BFS!',
    description: `Toàn bộ ${visitedOrder.length} đỉnh liên thông đã được duyệt theo thứ tự: [${visitedOrder.join(' ➔ ')}].`,
    detail: 'Cây tìm kiếm theo chiều rộng (BFS Spanning Tree) đã xác định khoảng cách ngắn nhất (số cạnh) tới mọi đỉnh.',
    codeLine: 18,
    actionType: 'COMPLETE',
    variables: {
      visitedOrder: visitedOrder.join(' ➔ '),
      totalVisited: visitedOrder.length,
      queueEmpty: true,
    },
    dataSnapshot: cloneSnapshot(null, `Duyệt BFS hoàn tất! Thứ tự duyệt: ${visitedOrder.join(' ➔ ')}`),
  });

  return steps;
}
