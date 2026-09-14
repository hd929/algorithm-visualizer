import { AlgorithmStep } from '../../types/algorithm';
import { BSTNode, BSTSnapshot } from '../../types/bst';

export function recordBSTSimulation(
  values: number[] = [45, 25, 65, 15, 35, 55, 75, 30]
): AlgorithmStep<BSTSnapshot>[] {
  const steps: AlgorithmStep<BSTSnapshot>[] = [];
  let stepIndex = 0;

  const nodes: BSTNode[] = [];
  let rootId: number | null = null;
  const inorderList: number[] = [];

  const cloneSnapshot = (
    insertVal: number | null,
    compNodeId: number | null,
    msg: string
  ): BSTSnapshot => ({
    nodes: nodes.map((n) => ({ ...n })),
    rootId,
    insertingVal: insertVal,
    comparingNodeId: compNodeId,
    inorderList: [...inorderList],
    logMessage: msg,
  });

  // Step 0: Initial
  steps.push({
    stepIndex: stepIndex++,
    title: 'Khởi tạo Cây Nhị Phân Tìm Kiếm (BST)',
    description: `Chuẩn bị chèn lần lượt ${values.length} giá trị vào BST: [${values.join(', ')}].`,
    detail: 'Quy tắc cốt lõi của BST: Tất cả node con bên trái luôn nhỏ hơn node cha, tất cả node con bên phải luôn lớn hơn node cha.',
    codeLine: 6,
    actionType: 'INIT',
    variables: {
      ValuesToInsert: values.join(', '),
      InitialSize: 0,
    },
    dataSnapshot: cloneSnapshot(null, null, 'Cây BST ban đầu rỗng.'),
  });

  // Insert helper
  const insert = (val: number) => {
    // Step: Start inserting val
    steps.push({
      stepIndex: stepIndex++,
      title: `Bắt đầu chèn giá trị ${val} vào BST`,
      description: `Bắt đầu tìm vị trí thích hợp cho ${val} từ đỉnh gốc (Root).`,
      detail: `So sánh ${val} với các node trên đường đi theo quy tắc BST.`,
      codeLine: 6,
      actionType: 'SEARCH_STEP',
      variables: {
        value: val,
        rootExists: rootId !== null,
      },
      dataSnapshot: cloneSnapshot(val, rootId, `Bắt đầu chèn ${val}.`),
    });

    if (rootId === null) {
      const newNode: BSTNode = {
        id: 0,
        val,
        x: 280,
        y: 60,
        left: null,
        right: null,
        parent: null,
        state: 'inserted',
      };
      nodes.push(newNode);
      rootId = 0;

      steps.push({
        stepIndex: stepIndex++,
        title: `Tạo Node Gốc (Root) = ${val}`,
        description: `Vì cây đang rỗng, giá trị ${val} trở thành gốc của toàn bộ cây BST.`,
        detail: 'Node gốc đại diện cho điểm bắt đầu của mọi thao tác tìm kiếm.',
        codeLine: 7,
        actionType: 'INSERT_NODE',
        variables: {
          rootVal: val,
          depth: 0,
        },
        dataSnapshot: cloneSnapshot(val, 0, `Node ${val} trở thành gốc của cây.`),
      });
      return;
    }

    let currId: number = rootId;
    let depth = 1;

    while (true) {
      const currNode = nodes[currId];
      currNode.state = 'comparing';

      // Step: Compare
      steps.push({
        stepIndex: stepIndex++,
        title: `So sánh ${val} với Node hiện tại (${currNode.val})`,
        description: val < currNode.val
          ? `${val} < ${currNode.val} ➔ Rẽ sang nhánh TRÁI`
          : `${val} > ${currNode.val} ➔ Rẽ sang nhánh PHẢI`,
        detail: `Theo thuộc tính BST: giá trị nhỏ hơn rẽ trái, lớn hơn rẽ phải.`,
        codeLine: val < currNode.val ? 10 : 12,
        actionType: 'COMPARE',
        variables: {
          insertingValue: val,
          currentNodeVal: currNode.val,
          direction: val < currNode.val ? 'Rẽ Trái (Left)' : 'Rẽ Phải (Right)',
        },
        dataSnapshot: cloneSnapshot(val, currId, `So sánh ${val} với ${currNode.val}.`),
      });

      currNode.state = 'normal';

      if (val < currNode.val) {
        if (currNode.left === null) {
          // Place as left child
          const newId = nodes.length;
          const offsetX = Math.max(35, 120 / Math.pow(1.5, depth));
          const newNode: BSTNode = {
            id: newId,
            val,
            x: Math.round(currNode.x - offsetX),
            y: currNode.y + 70,
            left: null,
            right: null,
            parent: currId,
            state: 'inserted',
          };
          nodes.push(newNode);
          currNode.left = newId;

          steps.push({
            stepIndex: stepIndex++,
            title: `✅ Chèn ${val} làm con TRÁI của Node ${currNode.val}`,
            description: `Nhánh trái của ${currNode.val} đang trống. Đặt Node ${val} vào vị trí này.`,
            detail: `Liên kết mới: ${currNode.val} ➔ con trái: ${val}.`,
            codeLine: 11,
            actionType: 'INSERT_NODE',
            variables: {
              insertedVal: val,
              parentVal: currNode.val,
              position: 'Con Trái (Left Child)',
            },
            dataSnapshot: cloneSnapshot(val, newId, `Đã chèn ${val} làm con trái của ${currNode.val}.`),
          });
          break;
        } else {
          currId = currNode.left;
          depth++;
        }
      } else {
        if (currNode.right === null) {
          // Place as right child
          const newId = nodes.length;
          const offsetX = Math.max(35, 120 / Math.pow(1.5, depth));
          const newNode: BSTNode = {
            id: newId,
            val,
            x: Math.round(currNode.x + offsetX),
            y: currNode.y + 70,
            left: null,
            right: null,
            parent: currId,
            state: 'inserted',
          };
          nodes.push(newNode);
          currNode.right = newId;

          steps.push({
            stepIndex: stepIndex++,
            title: `✅ Chèn ${val} làm con PHẢI của Node ${currNode.val}`,
            description: `Nhánh phải của ${currNode.val} đang trống. Đặt Node ${val} vào vị trí này.`,
            detail: `Liên kết mới: ${currNode.val} ➔ con phải: ${val}.`,
            codeLine: 13,
            actionType: 'INSERT_NODE',
            variables: {
              insertedVal: val,
              parentVal: currNode.val,
              position: 'Con Phải (Right Child)',
            },
            dataSnapshot: cloneSnapshot(val, newId, `Đã chèn ${val} làm con phải của ${currNode.val}.`),
          });
          break;
        } else {
          currId = currNode.right;
          depth++;
        }
      }
    }
  };

  // Insert all values
  for (const v of values) {
    insert(v);
  }

  // Reset node states
  nodes.forEach((n) => (n.state = 'normal'));

  // In-order traversal walk
  const inorder = (id: number | null) => {
    if (id === null) return;
    const node = nodes[id];
    inorder(node.left);
    inorderList.push(node.val);
    inorder(node.right);
  };
  inorder(rootId);

  // Final Step: In-order complete
  steps.push({
    stepIndex: stepIndex++,
    title: '🎉 Hoàn tất dựng Cây BST & Duyệt In-order',
    description: `Cây BST đã chứa đủ ${nodes.length} node. Duyệt trung thứ tự (Inorder: Trái ➔ Gốc ➔ Phải) cho ra dãy tăng dần tuyệt đối: [${inorderList.join(', ')}].`,
    detail: 'Thuộc tính kỳ diệu của BST: Duyệt Inorder luôn luôn cho ra dãy số đã sắp xếp tăng dần hoàn chỉnh!',
    codeLine: 15,
    actionType: 'COMPLETE',
    variables: {
      totalNodes: nodes.length,
      sortedInorder: inorderList.join(', '),
      treeHeight: 3,
    },
    dataSnapshot: cloneSnapshot(null, null, `Hoàn tất BST! Inorder: [${inorderList.join(', ')}]`),
  });

  return steps;
}
