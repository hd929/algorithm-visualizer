import { AlgorithmStep } from '../../types/algorithm';
import { DSUNode, DSUEdge, DSUSnapshot, DSUOperation } from '../../types/dsu';

export const CLUSTER_COLORS = [
  '#06b6d4', // cyan
  '#a855f7', // purple
  '#10b981', // emerald
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#3b82f6', // blue
  '#ec4899', // pink
  '#84cc16', // lime
  '#14b8a6', // teal
  '#eab308', // yellow
];

export function generateInitialDSUState(nodeCount: number = 7): DSUSnapshot {
  const nodes: DSUNode[] = [];
  const radius = 135;
  const centerX = 260;
  const centerY = 190;

  for (let i = 0; i < nodeCount; i++) {
    const angle = (2 * Math.PI * i) / nodeCount - Math.PI / 2;
    nodes.push({
      id: i,
      parent: i,
      rank: 0,
      size: 1,
      x: Math.round(centerX + radius * Math.cos(angle)),
      y: Math.round(centerY + radius * Math.sin(angle)),
      clusterRoot: i,
      color: CLUSTER_COLORS[i % CLUSTER_COLORS.length],
    });
  }

  return {
    nodes,
    edges: [],
    parent: Array.from({ length: nodeCount }, (_, i) => i),
    rank: new Array(nodeCount).fill(0),
    size: new Array(nodeCount).fill(1),
    activeNodes: [],
    pathHighlighted: [],
    numComponents: nodeCount,
    logMessage: `Khởi tạo ${nodeCount} đỉnh độc lập. Mỗi đỉnh ban đầu là gốc (root) của chính nó.`,
  };
}

export function recordDSUSimulation(
  nodeCount: number,
  operations: DSUOperation[]
): AlgorithmStep<DSUSnapshot>[] {
  const steps: AlgorithmStep<DSUSnapshot>[] = [];
  let stepIndex = 0;

  let currentSnapshot = generateInitialDSUState(nodeCount);

  // Helper to clone snapshot
  const cloneSnapshot = (snap: DSUSnapshot): DSUSnapshot => ({
    ...snap,
    nodes: snap.nodes.map((n) => ({ ...n })),
    edges: snap.edges.map((e) => ({ ...e })),
    parent: [...snap.parent],
    rank: [...snap.rank],
    size: [...snap.size],
    activeNodes: [...snap.activeNodes],
    pathHighlighted: [...snap.pathHighlighted],
  });

  // Step 0: Initialization
  steps.push({
    stepIndex: stepIndex++,
    title: 'Khởi tạo cấu trúc DSU',
    description: `Khởi tạo ${nodeCount} đỉnh độc lập từ 0 đến ${nodeCount - 1}. Ban đầu parent[i] = i, rank = 0, size = 1.`,
    detail: 'Mỗi đỉnh đại diện cho một cụm độc lập có màu sắc riêng biệt.',
    codeLine: 4,
    actionType: 'INIT',
    variables: {
      N: nodeCount,
      Components: nodeCount,
    },
    dataSnapshot: cloneSnapshot(currentSnapshot),
  });

  // Internal recursive Find that records steps
  const findWithRecording = (
    u: number,
    labelPrefix: string = ''
  ): { root: number; path: number[] } => {
    const path: number[] = [u];
    let curr = u;

    // Follow parent pointers to find root
    while (curr !== currentSnapshot.parent[curr]) {
      curr = currentSnapshot.parent[curr];
      path.push(curr);
    }
    const root = curr;

    const snapFind = cloneSnapshot(currentSnapshot);
    snapFind.activeNodes = [u, root];
    snapFind.pathHighlighted = [...path];
    snapFind.logMessage = `${labelPrefix}Tìm gốc của đỉnh ${u}: đi theo parent ${path.join(' ➔ ')}. Gốc là ${root}.`;

    steps.push({
      stepIndex: stepIndex++,
      title: `${labelPrefix}Find(${u}) ➔ Gốc là ${root}`,
      description: `Đang tìm đại diện cụm cho đỉnh ${u}. Đi theo liên kết parent: [${path.join(' ➔ ')}]. Gốc là ${root}.`,
      detail: `parent[${u}] hiện tại = ${currentSnapshot.parent[u]}. Gốc tìm được là đỉnh ${root}.`,
      codeLine: 10,
      actionType: 'FIND_ROOT',
      variables: {
        node: u,
        foundRoot: root,
        pathLength: path.length,
      },
      dataSnapshot: snapFind,
    });

    // Path compression: if path length > 2, point nodes directly to root
    if (path.length > 2) {
      let compressedCount = 0;
      for (let i = 0; i < path.length - 1; i++) {
        const node = path[i];
        if (currentSnapshot.parent[node] !== root) {
          currentSnapshot.parent[node] = root;
          currentSnapshot.nodes[node].parent = root;
          compressedCount++;
        }
      }

      if (compressedCount > 0) {
        const snapCompress = cloneSnapshot(currentSnapshot);
        snapCompress.activeNodes = [u, root];
        snapCompress.pathHighlighted = [u, root];
        snapCompress.logMessage = `⚡ [Path Compression] Nén đường đi: Gán thẳng parent các đỉnh trên đường đi trỏ trực tiếp về gốc ${root}.`;

        steps.push({
          stepIndex: stepIndex++,
          title: `⚡ Path Compression cho Find(${u})`,
          description: `Kỹ thuật nén đường đi (Path Compression): gán trực tiếp parent của các đỉnh trung gian về gốc ${root}.`,
          detail: 'Giúp các lần gọi Find sau này đạt độ phức tạp gần như hằng số O(α(N)).',
          codeLine: 12,
          actionType: 'PATH_COMPRESS',
          variables: {
            node: u,
            root: root,
            compressedNodes: path.slice(0, -1).join(', '),
          },
          dataSnapshot: snapCompress,
        });
      }
    }

    return { root, path };
  };

  // Process each operation
  for (const op of operations) {
    if (op.type === 'FIND') {
      findWithRecording(op.u);
    } else if (op.type === 'UNION' && op.v !== undefined) {
      const u = op.u;
      const v = op.v;

      // Step: Start Union
      const snapStart = cloneSnapshot(currentSnapshot);
      snapStart.activePair = [u, v];
      snapStart.activeNodes = [u, v];
      snapStart.logMessage = `Yêu cầu hợp nhất: unite(${u}, ${v}). Kiểm tra xem hai đỉnh có chung gốc không.`;

      steps.push({
        stepIndex: stepIndex++,
        title: `Bắt đầu unite(${u}, ${v})`,
        description: `Thực hiện phép gộp cụm giữa đỉnh ${u} và đỉnh ${v}. Cần tìm gốc của cả 2 đỉnh.`,
        detail: `Gọi find(${u}) và find(${v}) để lấy đại diện cụm.`,
        codeLine: 14,
        actionType: 'SEARCH_STEP',
        variables: {
          u,
          v,
        },
        dataSnapshot: snapStart,
      });

      // Find root of u
      const { root: rootU } = findWithRecording(u, `[unite ${u},${v}] `);
      // Find root of v
      const { root: rootV } = findWithRecording(v, `[unite ${u},${v}] `);

      // Check if already in same set
      if (rootU === rootV) {
        const snapCycle = cloneSnapshot(currentSnapshot);
        snapCycle.activeNodes = [u, v, rootU];
        snapCycle.rootU = rootU;
        snapCycle.rootV = rootV;
        snapCycle.logMessage = `⚠️ Cùng cụm! root(${u}) = root(${v}) = ${rootU}. Không cần gộp (Tạo thành chu trình - Cycle).`;

        steps.push({
          stepIndex: stepIndex++,
          title: `⚠️ Cùng cụm: Đã liên thông!`,
          description: `Đỉnh ${u} và ${v} đều có cùng gốc ${rootU}. Chúng đã thuộc về cùng một thành phần liên thông.`,
          detail: 'Nếu đây là thuật toán Kruskal, cạnh này sẽ bị bỏ qua vì tạo ra chu trình (Cycle). Trả về false.',
          codeLine: 17,
          actionType: 'CYCLE_DETECTED',
          variables: {
            u,
            v,
            commonRoot: rootU,
            isSameSet: true,
          },
          dataSnapshot: snapCycle,
        });
        continue;
      }

      // Union by rank
      let parentRoot = rootU;
      let childRoot = rootV;

      if (currentSnapshot.rank[rootU] < currentSnapshot.rank[rootV]) {
        parentRoot = rootV;
        childRoot = rootU;
      }

      const snapCompareRank = cloneSnapshot(currentSnapshot);
      snapCompareRank.activeNodes = [rootU, rootV];
      snapCompareRank.rootU = rootU;
      snapCompareRank.rootV = rootV;
      snapCompareRank.logMessage = `So sánh Rank: rank[${rootU}]=${currentSnapshot.rank[rootU]}, rank[${rootV}]=${currentSnapshot.rank[rootV]}. Gốc có rank nhỏ hơn (${childRoot}) sẽ trỏ vào gốc lớn hơn (${parentRoot}).`;

      steps.push({
        stepIndex: stepIndex++,
        title: `So sánh Rank & Hợp nhất Cụm`,
        description: `Cụm của ${childRoot} (rank ${currentSnapshot.rank[childRoot]}) được gán làm con của ${parentRoot} (rank ${currentSnapshot.rank[parentRoot]}).`,
        detail: 'Kỹ thuật Union by Rank giúp giữ độ cao của cây luôn tối ưu O(log N).',
        codeLine: 18,
        actionType: 'UNION_BY_RANK',
        variables: {
          rootU,
          rootV,
          parentRoot,
          childRoot,
        },
        dataSnapshot: snapCompareRank,
      });

      // Apply union
      currentSnapshot.parent[childRoot] = parentRoot;
      currentSnapshot.nodes[childRoot].parent = parentRoot;
      currentSnapshot.size[parentRoot] += currentSnapshot.size[childRoot];

      if (currentSnapshot.rank[parentRoot] === currentSnapshot.rank[childRoot]) {
        currentSnapshot.rank[parentRoot]++;
      }

      // Add visual edge
      currentSnapshot.edges.push({
        id: `e-${u}-${v}`,
        source: u,
        target: v,
        state: 'connected',
      });

      // Update cluster color & clusterRoot for all nodes in the child component
      const targetColor = currentSnapshot.nodes[parentRoot].color;
      for (let i = 0; i < currentSnapshot.nodes.length; i++) {
        // compute root of i
        let r = i;
        while (r !== currentSnapshot.parent[r]) {
          r = currentSnapshot.parent[r];
        }
        if (r === parentRoot) {
          currentSnapshot.nodes[i].clusterRoot = parentRoot;
          currentSnapshot.nodes[i].color = targetColor;
        }
      }

      currentSnapshot.numComponents--;

      const snapMerged = cloneSnapshot(currentSnapshot);
      snapMerged.activeNodes = [u, v, parentRoot, childRoot];
      snapMerged.logMessage = `✅ Hợp nhất thành công! Cạnh (${u}, ${v}) được kết nối. Số cụm liên thông còn lại: ${currentSnapshot.numComponents}.`;

      steps.push({
        stepIndex: stepIndex++,
        title: `✅ Gộp thành công: ${childRoot} ➔ ${parentRoot}`,
        description: `Cạnh (${u}, ${v}) đã liên kết 2 cụm thành 1 cụm thống nhất với màu đại diện mới.`,
        detail: `Số thành phần liên thông giảm từ ${currentSnapshot.numComponents + 1} xuống còn ${currentSnapshot.numComponents}. Size của cụm mới = ${currentSnapshot.size[parentRoot]}.`,
        codeLine: 19,
        actionType: 'UNION_BY_RANK',
        variables: {
          newRoot: parentRoot,
          newRank: currentSnapshot.rank[parentRoot],
          newSize: currentSnapshot.size[parentRoot],
          componentsRemaining: currentSnapshot.numComponents,
        },
        dataSnapshot: snapMerged,
      });
    }
  }

  // Final Step: Complete
  const finalSnap = cloneSnapshot(currentSnapshot);
  finalSnap.activeNodes = [];
  finalSnap.pathHighlighted = [];
  finalSnap.logMessage = `Mô phỏng hoàn tất! Hiện tại đồ thị có ${currentSnapshot.numComponents} thành phần liên thông.`;

  steps.push({
    stepIndex: stepIndex++,
    title: '🎉 Hoàn tất kịch bản DSU',
    description: `Tất cả các thao tác DSU đã hoàn tất. Đồ thị hiện gồm ${currentSnapshot.numComponents} cụm liên thông.`,
    detail: 'Bạn có thể tua lại timeline hoặc nhập testcase/prompt AI khác để tiếp tục mô phỏng!',
    codeLine: 23,
    actionType: 'COMPLETE',
    variables: {
      finalComponents: currentSnapshot.numComponents,
      totalEdges: currentSnapshot.edges.length,
    },
    dataSnapshot: finalSnap,
  });

  return steps;
}
