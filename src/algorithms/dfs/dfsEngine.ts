import { AlgorithmStep } from '../../types/algorithm';
import { DFSNode, DFSEdge, DFSSnapshot } from '../../types/dfs';

export function getDefaultDFSGraph(): { nodes: DFSNode[]; edges: DFSEdge[] } {
  const nodes: DFSNode[] = [
    { id: 0, x: 280, y: 70, visited: false, entryTime: 0, exitTime: 0, isBacktracking: false },
    { id: 1, x: 160, y: 170, visited: false, entryTime: 0, exitTime: 0, isBacktracking: false },
    { id: 2, x: 400, y: 170, visited: false, entryTime: 0, exitTime: 0, isBacktracking: false },
    { id: 3, x: 100, y: 280, visited: false, entryTime: 0, exitTime: 0, isBacktracking: false },
    { id: 4, x: 220, y: 280, visited: false, entryTime: 0, exitTime: 0, isBacktracking: false },
    { id: 5, x: 400, y: 280, visited: false, entryTime: 0, exitTime: 0, isBacktracking: false },
  ];

  const edges: DFSEdge[] = [
    { id: 'e-0-1', u: 0, v: 1, state: 'idle' },
    { id: 'e-1-3', u: 1, v: 3, state: 'idle' },
    { id: 'e-3-4', u: 3, v: 4, state: 'idle' },
    { id: 'e-1-4', u: 1, v: 4, state: 'idle' },
    { id: 'e-0-2', u: 0, v: 2, state: 'idle' },
    { id: 'e-2-5', u: 2, v: 5, state: 'idle' },
  ];

  return { nodes, edges };
}

export function recordDFSSimulation(startNode: number = 0): AlgorithmStep<DFSSnapshot>[] {
  const { nodes: initialNodes, edges: initialEdges } = getDefaultDFSGraph();

  const steps: AlgorithmStep<DFSSnapshot>[] = [];
  let stepIndex = 0;

  const n = initialNodes.length;
  const nodes = initialNodes.map((nd) => ({ ...nd }));
  const edges: DFSEdge[] = initialEdges.map((ed) => ({ ...ed, state: 'idle' }));

  // Adjacency list (undirected)
  const adj: { v: number; edgeId: string }[][] = Array.from({ length: n }, () => []);
  for (const e of edges) {
    adj[e.u].push({ v: e.v, edgeId: e.id });
    adj[e.v].push({ v: e.u, edgeId: e.id });
  }

  const callStack: number[] = [];
  const visitedOrder: number[] = [];
  let timer = 0;

  const cloneSnapshot = (
    currentU: number | null,
    msg: string
  ): DFSSnapshot => ({
    nodes: nodes.map((nd) => ({ ...nd })),
    edges: edges.map((ed) => ({ ...ed })),
    callStack: [...callStack],
    currentNode: currentU,
    visitedOrder: [...visitedOrder],
    logMessage: msg,
  });

  // Step 0: Init
  steps.push({
    stepIndex: stepIndex++,
    title: 'Khởi tạo duyệt DFS',
    description: `Chuẩn bị bắt đầu duyệt theo chiều sâu (Depth-First Search) từ đỉnh ${startNode}. Ngăn xếp Call Stack ban đầu rỗng.`,
    detail: 'Thuật toán DFS hoạt động theo nguyên tắc LIFO (Last-In, First-Out), đi sâu hết mức có thể vào từng nhánh trước khi quay lui.',
    codeLine: 1,
    actionType: 'INIT',
    variables: {
      startNode,
      CallStackSize: 0,
      VisitedCount: 0,
    },
    dataSnapshot: cloneSnapshot(null, 'Chuẩn bị gọi hàm dfs(startNode).'),
  });

  // Recursive DFS
  const dfsRecursive = (u: number, parentU: number | null) => {
    nodes[u].visited = true;
    nodes[u].entryTime = ++timer;
    nodes[u].isBacktracking = false;
    callStack.push(u);
    visitedOrder.push(u);

    // Step: Enter node
    steps.push({
      stepIndex: stepIndex++,
      title: `Gọi đệ quy dfs(${u}) ➔ Đẩy vào Call Stack`,
      description: `Thăm đỉnh ${u}. Đánh dấu visited[${u}] = true. Đẩy frame dfs(${u}) vào đỉnh ngăn xếp.`,
      detail: `Độ sâu ngăn xếp hiện tại: ${callStack.length}. Call Stack: [${callStack.join(' ➔ ')}].`,
      codeLine: 2,
      actionType: 'PUSH_STACK',
      variables: {
        currentNode: u,
        recursionDepth: callStack.length,
        'CallStack': `[${callStack.join(' ➔ ')}]`,
      },
      dataSnapshot: cloneSnapshot(u, `Gọi dfs(${u}), đẩy vào Call Stack.`),
    });

    for (const neighbor of adj[u]) {
      const v = neighbor.v;
      const edgeId = neighbor.edgeId;
      const edgeObj = edges.find((e) => e.id === edgeId)!;

      if (v === parentU) continue;

      if (!nodes[v].visited) {
        edgeObj.state = 'tree';

        steps.push({
          stepIndex: stepIndex++,
          title: `Đi sâu qua cạnh Tree Edge (${u} ➔ ${v})`,
          description: `Từ đỉnh ${u}, phát hiện đỉnh lân cận ${v} chưa được thăm. Chuẩn bị gọi đệ quy dfs(${v}).`,
          detail: `Cạnh (${u} - ${v}) trở thành một nhánh trong cây DFS.`,
          codeLine: 6,
          actionType: 'SEARCH_STEP',
          variables: {
            from: u,
            to: v,
            edgeType: 'Tree Edge',
          },
          dataSnapshot: cloneSnapshot(u, `Chuẩn bị đệ quy sâu vào đỉnh ${v}.`),
        });

        dfsRecursive(v, u);
      } else {
        if (edgeObj.state === 'idle') {
          edgeObj.state = 'back';
        }
      }
    }

    // Step: Backtrack
    nodes[u].exitTime = ++timer;
    nodes[u].isBacktracking = true;
    callStack.pop();

    steps.push({
      stepIndex: stepIndex++,
      title: `Quay lui (Backtrack) khỏi dfs(${u}) ➔ Rút khỏi Stack`,
      description: `Đã duyệt xong toàn bộ các nhánh con từ đỉnh ${u}. Rút đỉnh ${u} ra khỏi Call Stack và quay trở về đỉnh cha ${parentU !== null ? parentU : '[Gốc]'}.`,
      detail: `Call Stack còn lại: [${callStack.join(' ➔ ')}].`,
      codeLine: 8,
      actionType: 'POP_STACK',
      variables: {
        backtrackedFrom: u,
        returnTo: parentU !== null ? parentU : 'Hoàn tất',
        remainingStack: `[${callStack.join(' ➔ ')}]`,
      },
      dataSnapshot: cloneSnapshot(parentU, `Hoàn tất nhánh ${u}, quay lui về đỉnh ${parentU !== null ? parentU : 'gốc'}.`),
    });
  };

  dfsRecursive(startNode, null);

  // Final step
  steps.push({
    stepIndex: stepIndex++,
    title: '🎉 Hoàn tất duyệt DFS!',
    description: `Toàn bộ ${visitedOrder.length} đỉnh đã được khám phá theo thứ tự chiều sâu: [${visitedOrder.join(' ➔ ')}].`,
    detail: 'Ngăn xếp Call Stack đã hoàn toàn giải phóng (Stack unwound).',
    codeLine: 8,
    actionType: 'COMPLETE',
    variables: {
      visitedOrder: visitedOrder.join(' ➔ '),
      totalVisited: visitedOrder.length,
      finalStackSize: 0,
    },
    dataSnapshot: cloneSnapshot(null, `Duyệt DFS hoàn tất! Thứ tự: ${visitedOrder.join(' ➔ ')}`),
  });

  return steps;
}
