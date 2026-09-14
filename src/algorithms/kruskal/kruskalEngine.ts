import { AlgorithmStep } from '../../types/algorithm';
import { KruskalNode, KruskalEdge, KruskalSnapshot } from '../../types/kruskal';
import { CLUSTER_COLORS } from '../dsu/dsuEngine';

export function getDefaultKruskalGraph(): { nodes: KruskalNode[]; edges: KruskalEdge[] } {
  const nodes: KruskalNode[] = [
    { id: 0, x: 100, y: 100, parent: 0, rank: 0, color: CLUSTER_COLORS[0] },
    { id: 1, x: 260, y: 80, parent: 1, rank: 0, color: CLUSTER_COLORS[1] },
    { id: 2, x: 440, y: 100, parent: 2, rank: 0, color: CLUSTER_COLORS[2] },
    { id: 3, x: 100, y: 260, parent: 3, rank: 0, color: CLUSTER_COLORS[3] },
    { id: 4, x: 260, y: 280, parent: 4, rank: 0, color: CLUSTER_COLORS[4] },
    { id: 5, x: 440, y: 260, parent: 5, rank: 0, color: CLUSTER_COLORS[5] },
  ];

  const edges: KruskalEdge[] = [
    { id: 'e-0-3', u: 0, v: 3, weight: 1, state: 'pending' },
    { id: 'e-3-4', u: 3, v: 4, weight: 2, state: 'pending' },
    { id: 'e-0-1', u: 0, v: 1, weight: 3, state: 'pending' },
    { id: 'e-1-3', u: 1, v: 3, weight: 3, state: 'pending' },
    { id: 'e-1-4', u: 1, v: 4, weight: 4, state: 'pending' },
    { id: 'e-1-2', u: 1, v: 2, weight: 5, state: 'pending' },
    { id: 'e-2-5', u: 2, v: 5, weight: 6, state: 'pending' },
    { id: 'e-4-5', u: 4, v: 5, weight: 7, state: 'pending' },
    { id: 'e-2-4', u: 2, v: 4, weight: 8, state: 'pending' },
  ];

  return { nodes, edges };
}

export function recordKruskalSimulation(): AlgorithmStep<KruskalSnapshot>[] {
  const { nodes: initialNodes, edges: initialEdges } = getDefaultKruskalGraph();

  const steps: AlgorithmStep<KruskalSnapshot>[] = [];
  let stepIndex = 0;

  const n = initialNodes.length;
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);

  const nodes = initialNodes.map((nd) => ({ ...nd }));
  const edges: KruskalEdge[] = initialEdges.map((ed) => ({ ...ed, state: 'pending' }));

  // 1. Sort edges by weight
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

  const findRoot = (i: number): number => {
    let curr = i;
    while (curr !== parent[curr]) {
      curr = parent[curr];
    }
    return curr;
  };

  const cloneSnapshot = (
    edgeIdx: number,
    mstList: KruskalEdge[],
    totalW: number,
    numComp: number,
    msg: string
  ): KruskalSnapshot => ({
    nodes: nodes.map((nd, idx) => ({
      ...nd,
      parent: parent[idx],
      rank: rank[idx],
      color: nodes[findRoot(idx)].color,
    })),
    edges: edges.map((e) => ({ ...e })),
    sortedEdges: sortedEdges.map((e) => ({ ...e })),
    currentEdgeIndex: edgeIdx,
    mstEdges: mstList.map((e) => ({ ...e })),
    mstTotalWeight: totalW,
    numComponents: numComp,
    logMessage: msg,
  });

  const mstEdges: KruskalEdge[] = [];
  let mstWeight = 0;
  let components = n;

  // Step 0: Initialization and edge sorting
  steps.push({
    stepIndex: stepIndex++,
    title: 'Khởi tạo & Sắp xếp Cạnh theo Trọng số',
    description: `Sắp xếp toàn bộ ${edges.length} cạnh theo thứ tự trọng số tăng dần. Khởi tạo DSU với ${n} cụm độc lập.`,
    detail: 'Thuật toán Kruskal áp dụng chiến lược tham lam (Greedy): luôn ưu tiên cạnh có chi phí nhỏ nhất trước.',
    codeLine: 8,
    actionType: 'INIT',
    variables: {
      TotalEdges: edges.length,
      MSTEdges: 0,
      MSTWeight: 0,
      Components: components,
    },
    dataSnapshot: cloneSnapshot(
      -1,
      mstEdges,
      mstWeight,
      components,
      `Đã sắp xếp ${edges.length} cạnh theo trọng số tăng dần.`
    ),
  });

  // Step 1..k: Iterate sorted edges
  for (let i = 0; i < sortedEdges.length; i++) {
    const curEdge = sortedEdges[i];
    const originalEdge = edges.find((e) => e.id === curEdge.id)!;
    curEdge.state = 'checking';
    originalEdge.state = 'checking';

    const rootU = findRoot(curEdge.u);
    const rootV = findRoot(curEdge.v);

    // Step: Inspect current edge
    steps.push({
      stepIndex: stepIndex++,
      title: `Xét cạnh (${curEdge.u} - ${curEdge.v}, w = ${curEdge.weight})`,
      description: `Cạnh tiếp theo có trọng số nhỏ nhất là (${curEdge.u}, ${curEdge.v}) với weight = ${curEdge.weight}.`,
      detail: `Kiểm tra DSU: root(${curEdge.u}) = ${rootU}, root(${curEdge.v}) = ${rootV}.`,
      codeLine: 16,
      actionType: 'SEARCH_STEP',
      variables: {
        currentEdge: `(${curEdge.u} - ${curEdge.v})`,
        weight: curEdge.weight,
        rootU,
        rootV,
        isSameSet: rootU === rootV,
      },
      dataSnapshot: cloneSnapshot(
        i,
        mstEdges,
        mstWeight,
        components,
        `Kiểm tra cạnh (${curEdge.u}, ${curEdge.v}): rootU = ${rootU}, rootV = ${rootV}`
      ),
    });

    if (rootU !== rootV) {
      // Unite
      if (rank[rootU] < rank[rootV]) {
        parent[rootU] = rootV;
      } else {
        parent[rootV] = rootU;
        if (rank[rootU] === rank[rootV]) rank[rootU]++;
      }

      curEdge.state = 'accepted';
      originalEdge.state = 'accepted';
      mstEdges.push(curEdge);
      mstWeight += curEdge.weight;
      components--;

      steps.push({
        stepIndex: stepIndex++,
        title: `✅ Chấp nhận cạnh (${curEdge.u} - ${curEdge.v}) vào MST!`,
        description: `Vì rootU (${rootU}) ≠ rootV (${rootV}), cạnh này không tạo chu trình. Thêm vào cây khung nhỏ nhất.`,
        detail: `Tổng trọng số MST tăng lên ${mstWeight}. Số cạnh MST: ${mstEdges.length}/${n - 1}.`,
        codeLine: 17,
        actionType: 'ADD_TO_MST',
        variables: {
          addedEdge: `(${curEdge.u} - ${curEdge.v})`,
          weight: curEdge.weight,
          mstTotalWeight: mstWeight,
          edgesCount: `${mstEdges.length} / ${n - 1}`,
        },
        dataSnapshot: cloneSnapshot(
          i,
          mstEdges,
          mstWeight,
          components,
          `✅ Chấp nhận cạnh (${curEdge.u}, ${curEdge.v}). Tổng trọng số MST = ${mstWeight}`
        ),
      });

      if (mstEdges.length === n - 1) {
        break; // MST completed!
      }
    } else {
      // Reject cycle
      curEdge.state = 'rejected';
      originalEdge.state = 'rejected';

      steps.push({
        stepIndex: stepIndex++,
        title: `⚠️ Từ chối cạnh (${curEdge.u} - ${curEdge.v}): Tạo chu trình!`,
        description: `Hai đỉnh ${curEdge.u} và ${curEdge.v} đã có cùng gốc đại diện (${rootU}). Việc thêm cạnh này sẽ tạo ra chu trình (Cycle).`,
        detail: 'Cạnh bị loại bỏ để đảm bảo cấu trúc hình thành là một Cây (Tree - đồ thị liên thông không chu trình).',
        codeLine: 21,
        actionType: 'REJECT_CYCLE',
        variables: {
          rejectedEdge: `(${curEdge.u} - ${curEdge.v})`,
          weight: curEdge.weight,
          commonRoot: rootU,
          status: 'Loại bỏ (Cycle)',
        },
        dataSnapshot: cloneSnapshot(
          i,
          mstEdges,
          mstWeight,
          components,
          `⚠️ Cạnh (${curEdge.u}, ${curEdge.v}) bị loại vì cùng cụm ${rootU}.`
        ),
      });
    }
  }

  // Final Step: Complete
  steps.push({
    stepIndex: stepIndex++,
    title: '🎉 Hoàn tất Cây Khung Nhỏ Nhất (MST)!',
    description: `Đã chọn đủ ${n - 1} cạnh liên thông tất cả các đỉnh với tổng chi phí nhỏ nhất có thể = ${mstWeight}.`,
    detail: 'Thuật toán Kruskal hoàn tất với độ phức tạp tối ưu O(E log E) nhờ kết hợp DSU và sắp xếp cạnh.',
    codeLine: 23,
    actionType: 'COMPLETE',
    variables: {
      finalMSTEdges: mstEdges.length,
      minSpanningWeight: mstWeight,
      connectedComponents: components,
    },
    dataSnapshot: cloneSnapshot(
      sortedEdges.length,
      mstEdges,
      mstWeight,
      components,
      `🎉 Cây khung nhỏ nhất hoàn tất! Tổng trọng số tối ưu = ${mstWeight}.`
    ),
  });

  return steps;
}
