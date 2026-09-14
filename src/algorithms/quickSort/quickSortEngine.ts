import { AlgorithmStep } from '../../types/algorithm';
import { QuickSortSnapshot } from '../../types/quickSort';

export function recordQuickSortSimulation(
  rawArray: number[]
): AlgorithmStep<QuickSortSnapshot>[] {
  const array = [...rawArray];
  const steps: AlgorithmStep<QuickSortSnapshot>[] = [];
  let stepIndex = 0;

  const sortedIndicesSet = new Set<number>();

  const cloneSnapshot = (
    pivotIdx: number | null,
    low: number,
    high: number,
    iVal: number | null,
    jVal: number | null,
    swapped: [number, number] | null,
    msg: string
  ): QuickSortSnapshot => ({
    array: [...array],
    pivotIndex: pivotIdx,
    low,
    high,
    i: iVal,
    j: jVal,
    swappedIndices: swapped,
    sortedIndices: Array.from(sortedIndicesSet),
    partitionRange: [low, high],
    logMessage: msg,
  });

  // Step 0: Initial state
  steps.push({
    stepIndex: stepIndex++,
    title: 'Khởi tạo mảng cần sắp xếp',
    description: `Mảng ban đầu gồm ${array.length} phần tử chưa được sắp xếp.`,
    detail: 'Thuật toán Quick Sort chọn phần tử chốt (Pivot) và phân hoạch mảng thành 2 phần: nhỏ hơn pivot và lớn hơn pivot.',
    codeLine: 14,
    actionType: 'INIT',
    variables: {
      ArraySize: array.length,
      SortedCount: 0,
    },
    dataSnapshot: cloneSnapshot(null, 0, array.length - 1, null, null, null, 'Mảng ban đầu chuẩn bị phân hoạch.'),
  });

  // Recursive partition recorder
  const quickSortRecursive = (low: number, high: number) => {
    if (low >= high) {
      if (low === high) {
        sortedIndicesSet.add(low);
      }
      return;
    }

    const pivot = array[high];
    const pivotIdx = high;

    // Step: Select Pivot
    steps.push({
      stepIndex: stepIndex++,
      title: `Chọn Pivot = arr[${high}] (${pivot}) cho khoảng [${low} ... ${high}]`,
      description: `Đang phân hoạch đoạn con từ chỉ số ${low} đến ${high}. Chọn phần tử cuối arr[${high}] = ${pivot} làm Pivot.`,
      detail: `Khởi tạo con trỏ biên i = ${low - 1}. Con trỏ j sẽ quét từ ${low} đến ${high - 1}.`,
      codeLine: 2,
      actionType: 'PARTITION',
      variables: {
        partitionRange: `[${low} ... ${high}]`,
        pivot,
        i: low - 1,
        j: low,
      },
      dataSnapshot: cloneSnapshot(
        pivotIdx,
        low,
        high,
        low - 1,
        low,
        null,
        `Chọn pivot = arr[${high}] = ${pivot}. Bắt đầu phân hoạch đoạn [${low} ... ${high}].`
      ),
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      const curVal = array[j];

      // Step: Compare arr[j] with pivot
      steps.push({
        stepIndex: stepIndex++,
        title: `So sánh arr[${j}] (${curVal}) với Pivot (${pivot})`,
        description: `Kiểm tra nếu arr[${j}] (${curVal}) <= Pivot (${pivot}).`,
        detail:
          curVal <= pivot
            ? `arr[${j}] nhỏ hơn hoặc bằng Pivot ➔ Cần đưa về nửa bên trái bằng cách hoán đổi với arr[i+1].`
            : `arr[${j}] lớn hơn Pivot ➔ Giữ nguyên ở nửa bên phải.`,
        codeLine: 7,
        actionType: 'COMPARE',
        variables: {
          'arr[j]': curVal,
          pivot,
          condition: curVal <= pivot ? 'Thoả mãn (<= pivot)' : 'Lớn hơn pivot',
          i,
          j,
        },
        dataSnapshot: cloneSnapshot(
          pivotIdx,
          low,
          high,
          i,
          j,
          null,
          `So sánh arr[${j}]=${curVal} với pivot=${pivot}.`
        ),
      });

      if (curVal <= pivot) {
        i++;
        if (i !== j) {
          // Swap arr[i] and arr[j]
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;

          steps.push({
            stepIndex: stepIndex++,
            title: `🔄 Hoán đổi arr[${i}] (${array[i]}) ⇄ arr[${j}] (${array[j]})`,
            description: `Dời con trỏ i lên ${i} và hoán đổi để đưa phần tử nhỏ hơn pivot sang bên trái.`,
            detail: `Mảng sau hoán đổi: [${array.join(', ')}].`,
            codeLine: 9,
            actionType: 'SWAP',
            variables: {
              swapA: `arr[${i}]=${array[i]}`,
              swapB: `arr[${j}]=${array[j]}`,
              i,
              j,
            },
            dataSnapshot: cloneSnapshot(
              pivotIdx,
              low,
              high,
              i,
              j,
              [i, j],
              `Hoán đổi arr[${i}] và arr[${j}].`
            ),
          });
        }
      }
    }

    // Place pivot in correct position: swap arr[i + 1] and arr[high]
    const finalPivotIndex = i + 1;
    const temp = array[finalPivotIndex];
    array[finalPivotIndex] = array[high];
    array[high] = temp;
    sortedIndicesSet.add(finalPivotIndex);

    steps.push({
      stepIndex: stepIndex++,
      title: `🎯 Đặt Pivot (${pivot}) vào vị trí cố định [${finalPivotIndex}]`,
      description: `Hoán đổi arr[${finalPivotIndex}] (${array[finalPivotIndex]}) với arr[${high}] (${array[high]}).`,
      detail: `Pivot ${pivot} hiện đã đứng đúng vị trí cuối cùng trong mảng đã sắp xếp! Tất cả bên trái đều <= ${pivot}, bên phải đều > ${pivot}.`,
      codeLine: 12,
      actionType: 'FOUND',
      variables: {
        finalPivotIndex,
        pivotValue: pivot,
        leftPartition: `[${low} ... ${finalPivotIndex - 1}]`,
        rightPartition: `[${finalPivotIndex + 1} ... ${high}]`,
      },
      dataSnapshot: cloneSnapshot(
        finalPivotIndex,
        low,
        high,
        i,
        null,
        [finalPivotIndex, high],
        `Pivot ${pivot} đã ở đúng vị trí thứ ${finalPivotIndex}.`
      ),
    });

    // Recurse left
    quickSortRecursive(low, finalPivotIndex - 1);
    // Recurse right
    quickSortRecursive(finalPivotIndex + 1, high);
  };

  quickSortRecursive(0, array.length - 1);

  // Mark all as sorted
  for (let idx = 0; idx < array.length; idx++) {
    sortedIndicesSet.add(idx);
  }

  // Final step
  steps.push({
    stepIndex: stepIndex++,
    title: '🎉 Hoàn tất Quick Sort!',
    description: `Toàn bộ mảng gồm ${array.length} phần tử đã được sắp xếp tăng dần hoàn chỉnh: [${array.join(', ')}].`,
    detail: 'Thuật toán Quick Sort hoàn tất với độ phức tạp trung bình O(N log N).',
    codeLine: 20,
    actionType: 'COMPLETE',
    variables: {
      isSorted: true,
      totalElements: array.length,
    },
    dataSnapshot: cloneSnapshot(
      null,
      0,
      array.length - 1,
      null,
      null,
      null,
      `Sắp xếp hoàn tất! [${array.join(', ')}]`
    ),
  });

  return steps;
}
