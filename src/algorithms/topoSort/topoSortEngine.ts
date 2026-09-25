import { AlgorithmStep } from '../../types/algorithm';
import { TopoEdge, TopoNode, TopoSortSnapshot } from '../../types/topoSort';

export const DEFAULT_TOPO_NODES: TopoNode[] = [
  { id: 5, label: '5', inDegree: 0, x: 100, y: 90 },
  { id: 4, label: '4', inDegree: 0, x: 100, y: 250 },
  { id: 2, label: '2', inDegree: 1, x: 270, y: 80 },
  { id: 0, label: '0', inDegree: 2, x: 270, y: 190 },
  { id: 3, label: '3', inDegree: 1, x: 440, y: 90 },
  { id: 1, label: '1', inDegree: 2, x: 440, y: 240 },
];

export const DEFAULT_TOPO_EDGES: TopoEdge[] = [
  { from: 5, to: 2 },
  { from: 5, to: 0 },
  { from: 4, to: 0 },
  { from: 4, to: 1 },
  { from: 2, to: 3 },
  { from: 3, to: 1 },
];

export function recordTopoSortSimulation(): AlgorithmStep<TopoSortSnapshot>[] {
  const steps: AlgorithmStep<TopoSortSnapshot>[] = [];
  const V = DEFAULT_TOPO_NODES.length;

  // Calculate real in-degrees
  const inDegreeMap: Record<number, number> = {};
  for (const n of DEFAULT_TOPO_NODES) {
    inDegreeMap[n.id] = 0;
  }
  for (const e of DEFAULT_TOPO_EDGES) {
    inDegreeMap[e.to] = (inDegreeMap[e.to] || 0) + 1;
  }

  const nodes = DEFAULT_TOPO_NODES.map((n) => ({
    ...n,
    inDegree: inDegreeMap[n.id],
  }));

  const edges: TopoEdge[] = DEFAULT_TOPO_EDGES.map((e) => ({ ...e }));
  const queue: number[] = [];
  const topoOrder: number[] = [];

  const getSnapshot = (
    phase: TopoSortSnapshot['phase'],
    currentNode: number | null = null
  ): TopoSortSnapshot => ({
    nodes: nodes.map((n) => ({ ...n })),
    edges: edges.map((e) => ({ ...e })),
    queue: [...queue],
    topoOrder: [...topoOrder],
    currentNode,
    phase,
  });

  // Step 0: Init & Calculate in-degree
  steps.push({
    stepIndex: steps.length,
    title: 'Khởi tạo Đồ Thị Có Hướng (DAG) & Tính Bán Bậc Vào (In-Degree)',
    description: `Đồ thị có ${V} đỉnh và ${edges.length} cạnh có hướng. Bán bậc vào (in-degree) là số cạnh trỏ vào đỉnh đó: [5: 0, 4: 0, 2: 1, 0: 2, 3: 1, 1: 2].`,
    detail: `Các đỉnh có In-Degree = 0 là các đỉnh độc lập, không phụ thuộc đỉnh nào khác.`,
    codeLine: 8,
    actionType: 'INIT',
    variables: {
      'Số đỉnh V': V,
      'Số cạnh E': edges.length,
      'In-Degrees': '5:0, 4:0, 2:1, 0:2, 3:1, 1:2',
    },
    dataSnapshot: getSnapshot('CALC_INDEGREE'),
  });

  // Enqueue initial zero in-degree nodes
  for (const n of nodes) {
    if (n.inDegree === 0) {
      queue.push(n.id);
      steps.push({
        stepIndex: steps.length,
        title: `Đưa Đỉnh [${n.id}] vào Hàng Đợi (In-Degree = 0)`,
        description: `Đỉnh [${n.id}] không có bất kỳ cạnh trỏ vào nào (in-degree = 0). Đưa đỉnh [${n.id}] vào Hàng đợi Queue để chuẩn bị xử lý.`,
        detail: `Enqueue [${n.id}]. Queue hiện tại: [${queue.join(', ')}]`,
        codeLine: 18,
        actionType: 'ENQUEUE',
        variables: {
          'Đỉnh vào Queue': n.id,
          'Queue': queue.join(', '),
        },
        dataSnapshot: getSnapshot('ENQUEUE_ZEROS', n.id),
      });
    }
  }

  // Process Queue
  while (queue.length > 0) {
    const u = queue.shift()!;
    topoOrder.push(u);

    steps.push({
      stepIndex: steps.length,
      title: `Dequeue: Lấy Đỉnh [${u}] ra khỏi Hàng Đợi ➔ Thêm Vào Thứ Tự Tô-pô`,
      description: `Đỉnh [${u}] được chọn và ghi nhận vào danh sách thứ tự Tô-pô (Topo Order: [${topoOrder.join(' ➔ ')}]).`,
      detail: `Lấy đỉnh [${u}] ra khỏi Queue.`,
      codeLine: 26,
      actionType: 'OUTPUT_ORDER',
      variables: {
        'Đỉnh đang xét': u,
        'Topo Order': topoOrder.join(' ➔ '),
        'Queue còn lại': queue.length ? queue.join(', ') : 'Rỗng',
      },
      dataSnapshot: getSnapshot('PROCESS_NODE', u),
    });

    // Check outgoing edges from u
    const outgoing = edges.filter((e) => e.from === u && !e.removed);

    for (const edge of outgoing) {
      edge.active = true;
      const vNode = nodes.find((n) => n.id === edge.to)!;
      vNode.inDegree--;
      edge.removed = true;

      const reachedZero = vNode.inDegree === 0;
      if (reachedZero) {
        queue.push(vNode.id);
      }

      steps.push({
        stepIndex: steps.length,
        title: `Gỡ Cạnh (${u} ➔ ${edge.to}): Giảm In-Degree đỉnh [${edge.to}] còn ${vNode.inDegree}`,
        description: `Loại bỏ ràng buộc từ [${u}] đến [${edge.to}]. Bán bậc vào của [${edge.to}] giảm xuống còn ${vNode.inDegree}.${reachedZero ? ` In-Degree đã bằng 0 ➔ ĐƯA [${edge.to}] VÀO QUEUE!` : ''}`,
        detail: `Cạnh ${u} ➔ ${edge.to} đã gỡ. In-degree(${edge.to}) = ${vNode.inDegree}.`,
        codeLine: 31,
        actionType: reachedZero ? 'ENQUEUE' : 'REDUCE_INDEGREE',
        variables: {
          'Cạnh gỡ bỏ': `${u} ➔ ${edge.to}`,
          [`In-Degree đỉnh ${edge.to}`]: vNode.inDegree,
          'Queue': queue.join(', '),
        },
        dataSnapshot: getSnapshot('REDUCE_NEIGHBORS', u),
      });

      edge.active = false;
    }
  }

  // Complete
  steps.push({
    stepIndex: steps.length,
    title: 'Hoàn Tất Thuật Toán Sắp Xếp Tô-pô (Kahn Complete)',
    description: `Tất cả ${topoOrder.length}/${V} đỉnh đã được sắp xếp thành công theo thứ tự topo không vi phạm ràng buộc có hướng nào. Kết quả: [${topoOrder.join(' ➔ ')}].`,
    detail: `Đồ thị là DAG hợp lệ (không chứa chu trình). Độ phức tạp: O(V + E).`,
    codeLine: 38,
    actionType: 'COMPLETE',
    variables: {
      'Thứ tự Tô-pô Hoàn Chỉnh': topoOrder.join(' ➔ '),
      'Số đỉnh đã duyệt': `${topoOrder.length}/${V}`,
    },
    dataSnapshot: getSnapshot('COMPLETE', null),
  });

  return steps;
}
