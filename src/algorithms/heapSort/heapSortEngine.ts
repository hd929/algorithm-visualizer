import { AlgorithmStep } from '../../types/algorithm';
import { HeapSortSnapshot } from '../../types/heapSort';

export const DEFAULT_HEAP_ARRAY = [25, 12, 48, 37, 19, 85, 62];

export function recordHeapSortSimulation(
  initialArray: number[] = DEFAULT_HEAP_ARRAY
): AlgorithmStep<HeapSortSnapshot>[] {
  const steps: AlgorithmStep<HeapSortSnapshot>[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let heapSize = n;
  const sortedIndices: number[] = [];

  const snapshot = (
    phase: HeapSortSnapshot['phase'],
    activeIndices: number[] = [],
    swapIndices?: [number, number],
    largestIdx?: number,
    rootIdx?: number
  ): HeapSortSnapshot => ({
    array: [...arr],
    heapSize,
    phase,
    activeIndices,
    swapIndices,
    sortedIndices: [...sortedIndices],
    largestIdx,
    rootIdx,
  });

  // Step 0: Initial state
  steps.push({
    stepIndex: steps.length,
    title: 'Khởi tạo Mảng Ban Đầu cho Heap Sort',
    description: `Mảng gồm ${n} phần tử chưa có tính chất Max-Heap. Chuẩn bị bước 1: Xây dựng Max-Heap từ các nút nội bộ (index ${Math.floor(n / 2) - 1} về 0).`,
    detail: `Array = [${arr.join(', ')}], Heap Size = ${heapSize}`,
    codeLine: 26,
    actionType: 'INIT',
    variables: { n, heapSize },
    dataSnapshot: snapshot('BUILD_HEAP'),
  });

  // Helper heapify function that records steps
  const runHeapify = (size: number, i: number, phase: HeapSortSnapshot['phase']) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    const active = [i];
    if (left < size) active.push(left);
    if (right < size) active.push(right);

    steps.push({
      stepIndex: steps.length,
      title: `Heapify tại nút [${i}] (Giá trị: ${arr[i]})`,
      description: `Kiểm tra xem nút [${i}] có lớn hơn các con [${left < size ? `${left}:${arr[left]}` : 'None'}, ${right < size ? `${right}:${arr[right]}` : 'None'}] hay không.`,
      detail: `Root = ${arr[i]}${left < size ? `, Con trái = ${arr[left]}` : ''}${right < size ? `, Con phải = ${arr[right]}` : ''}`,
      codeLine: 10,
      actionType: 'COMPARE',
      variables: {
        root: arr[i],
        left: left < size ? arr[left] : 'N/A',
        right: right < size ? arr[right] : 'N/A',
        heapSize: size,
      },
      dataSnapshot: snapshot(phase, active, undefined, largest, i),
    });

    if (left < size && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < size && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      steps.push({
        stepIndex: steps.length,
        title: `Phát hiện Con [${largest}] (${arr[largest]}) > Nút Cha [${i}] (${arr[i]})`,
        description: `Vi phạm tính chất Max-Heap! Chuẩn bị hoán đổi (Swap) phần tử arr[${i}] và arr[${largest}].`,
        detail: `Hoán đổi vị trí ${i} (giá trị ${arr[i]}) và ${largest} (giá trị ${arr[largest]}).`,
        codeLine: 19,
        actionType: 'SWAP',
        variables: {
          'Nút cha': `${arr[i]} (idx: ${i})`,
          'Nút con lớn hơn': `${arr[largest]} (idx: ${largest})`,
        },
        dataSnapshot: snapshot(phase, [i, largest], [i, largest], largest, i),
      });

      // Swap
      const temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;

      steps.push({
        stepIndex: steps.length,
        title: `Đã Hoán Đổi: Nút [${i}] nhận giá trị lớn hơn (${arr[i]})`,
        description: `Sau hoán đổi, giá trị lớn nhất đã nổi lên nút cha. Tiếp tục đệ quy Heapify kiểm tra nhánh con tại nút [${largest}].`,
        detail: `Mảng hiện tại: [${arr.join(', ')}]`,
        codeLine: 21,
        actionType: 'HEAPIFY',
        variables: { 'Sau swap': `arr[${i}]=${arr[i]}, arr[${largest}]=${arr[largest]}` },
        dataSnapshot: snapshot(phase, [i, largest], undefined, largest, i),
      });

      runHeapify(size, largest, phase);
    } else {
      steps.push({
        stepIndex: steps.length,
        title: `Nút [${i}] (${arr[i]}) đã thỏa mãn tính chất Max-Heap`,
        description: `Nút [${i}] đã lớn hơn hoặc bằng tất cả các nút con trong phạm vi heap size = ${size}. Không cần hoán đổi.`,
        detail: `Max-Heap nhánh ${i} hợp lệ.`,
        codeLine: 23,
        actionType: 'COMPARE',
        variables: { 'Nút hợp lệ': `arr[${i}]=${arr[i]}` },
        dataSnapshot: snapshot(phase, [i], undefined, largest, i),
      });
    }
  };

  // Phase 1: Build Max-Heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    runHeapify(n, i, 'BUILD_HEAP');
  }

  steps.push({
    stepIndex: steps.length,
    title: 'Xây Dựng Xong Max-Heap Hoàn Chỉnh!',
    description: `Toàn bộ mảng đã thỏa mãn cây nhị phân Max-Heap. Gốc cây arr[0] = ${arr[0]} luôn là phần tử có giá trị lớn nhất trong toàn bộ tập dữ liệu.`,
    detail: `Max element = arr[0] = ${arr[0]}. Chuẩn bị trích xuất sang cuối mảng.`,
    codeLine: 29,
    actionType: 'HEAPIFY',
    variables: { 'Max root': arr[0], 'Heap array': arr.join(', ') },
    dataSnapshot: snapshot('EXTRACT_MAX', [0]),
  });

  // Phase 2: Extract elements one by one
  for (let i = n - 1; i > 0; i--) {
    steps.push({
      stepIndex: steps.length,
      title: `Trích xuất Cực Đại: Đưa arr[0] (${arr[0]}) về vị trí cuối arr[${i}]`,
      description: `Đưa phần tử lớn nhất arr[0] về đúng vị trí đã sắp xếp cuối heap (arr[${i}]). Giảm kích thước heap còn ${i}.`,
      detail: `Swap arr[0]=${arr[0]} với arr[${i}]=${arr[i]}`,
      codeLine: 32,
      actionType: 'SWAP',
      variables: {
        'Cực đại': arr[0],
        'Vị trí cố định': i,
        'Heap size mới': i,
      },
      dataSnapshot: snapshot('EXTRACT_MAX', [0, i], [0, i]),
    });

    // Swap arr[0] and arr[i]
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;

    sortedIndices.push(i);
    heapSize = i;

    steps.push({
      stepIndex: steps.length,
      title: `Cố Định Phần Tử ${arr[i]} tại Vị Trí [${i}] ➔ Vun Đống Lại Root`,
      description: `Phần tử ${arr[i]} đã ở vị trí chính xác. Vun đống lại cây có gốc tại arr[0] với heapSize = ${heapSize}.`,
      detail: `Sorted so far: [${sortedIndices.map((idx) => arr[idx]).join(', ')}]`,
      codeLine: 33,
      actionType: 'HEAPIFY',
      variables: { 'Đã sắp xếp': arr[i], 'Heap size': heapSize },
      dataSnapshot: snapshot('HEAPIFY', [0]),
    });

    runHeapify(i, 0, 'HEAPIFY');
  }

  sortedIndices.push(0);
  heapSize = 0;

  // Complete
  steps.push({
    stepIndex: steps.length,
    title: 'Hoàn Tất Thuật Toán Heap Sort!',
    description: `Tất cả ${n} phần tử đã được sắp xếp tăng dần hoàn chỉnh. Độ phức tạp thời gian: O(N log N) cho mọi trường hợp, Space: O(1).`,
    detail: `Sorted Array: [${arr.join(', ')}]`,
    codeLine: 35,
    actionType: 'COMPLETE',
    variables: { 'Mảng đã sắp xếp': arr.join(', '), 'Độ phức tạp': 'O(N log N)' },
    dataSnapshot: snapshot('SORTED', [], undefined),
  });

  return steps;
}
