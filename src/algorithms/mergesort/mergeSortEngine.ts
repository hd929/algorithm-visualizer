import { AlgorithmStep } from '../../types/algorithm';
import { MergeSortSnapshot } from '../../types/mergeSort';

export function recordMergeSortSimulation(
  rawArray: number[]
): AlgorithmStep<MergeSortSnapshot>[] {
  const array = [...rawArray];
  const n = array.length;
  const tempArray: (number | null)[] = new Array(n).fill(null);

  const steps: AlgorithmStep<MergeSortSnapshot>[] = [];
  let stepIndex = 0;

  const cloneSnapshot = (
    leftR: [number, number] | null,
    rightR: [number, number] | null,
    iVal: number | null,
    jVal: number | null,
    kVal: number | null,
    mergedR: [number, number] | null,
    msg: string
  ): MergeSortSnapshot => ({
    array: [...array],
    tempArray: [...tempArray],
    leftRange: leftR,
    rightRange: rightR,
    i: iVal,
    j: jVal,
    k: kVal,
    activeMergedRange: mergedR,
    logMessage: msg,
  });

  // Step 0: Initial
  steps.push({
    stepIndex: stepIndex++,
    title: 'Khởi tạo mảng Merge Sort',
    description: `Mảng ban đầu gồm ${n} phần tử cần sắp xếp. Thuật toán chia đôi mảng đệ quy và sau đó trộn lại theo thứ tự tăng dần.`,
    detail: 'Độ phức tạp luôn luôn là O(N log N) trong mọi trường hợp (Worst/Average/Best).',
    codeLine: 16,
    actionType: 'INIT',
    variables: {
      ArraySize: n,
      Range: `[0 ... ${n - 1}]`,
    },
    dataSnapshot: cloneSnapshot(null, null, null, null, null, null, 'Khởi tạo mảng ban đầu.'),
  });

  const merge = (l: number, mid: number, r: number) => {
    const buffer: number[] = [];
    let i = l;
    let j = mid + 1;

    // Clear temp buffer slots for visualization
    for (let p = l; p <= r; p++) {
      tempArray[p] = null;
    }

    steps.push({
      stepIndex: stepIndex++,
      title: `Bắt đầu trộn 2 nửa: [${l}..${mid}] và [${mid + 1}..${r}]`,
      description: `So sánh các phần tử từ hai nửa mảng con đã sắp xếp để đổ vào mảng đệm tạm thời.`,
      detail: `Nửa trái: [${array.slice(l, mid + 1).join(', ')}], Nửa phải: [${array.slice(mid + 1, r + 1).join(', ')}].`,
      codeLine: 1,
      actionType: 'MERGE',
      variables: {
        leftSubarray: `[${l} ... ${mid}]`,
        rightSubarray: `[${mid + 1} ... ${r}]`,
        i,
        j,
      },
      dataSnapshot: cloneSnapshot([l, mid], [mid + 1, r], i, j, l, null, `Chuẩn bị trộn đoạn [${l}..${r}].`),
    });

    let k = l;
    while (i <= mid && j <= r) {
      const valI = array[i];
      const valJ = array[j];

      steps.push({
        stepIndex: stepIndex++,
        title: `So sánh arr[${i}] (${valI}) vs arr[${j}] (${valJ})`,
        description: `Chọn giá trị nhỏ hơn để đưa vào vị trí temp[${k}].`,
        detail: valI <= valJ ? `arr[${i}] <= arr[${j}] ➔ Lấy ${valI}` : `arr[${j}] < arr[${i}] ➔ Lấy ${valJ}`,
        codeLine: 6,
        actionType: 'COMPARE',
        variables: {
          'arr[i]': valI,
          'arr[j]': valJ,
          chosen: valI <= valJ ? valI : valJ,
          k,
        },
        dataSnapshot: cloneSnapshot([l, mid], [mid + 1, r], i, j, k, null, `So sánh ${valI} với ${valJ}.`),
      });

      if (valI <= valJ) {
        tempArray[k] = valI;
        buffer.push(valI);
        i++;
      } else {
        tempArray[k] = valJ;
        buffer.push(valJ);
        j++;
      }
      k++;
    }

    while (i <= mid) {
      tempArray[k] = array[i];
      buffer.push(array[i]);
      i++;
      k++;
    }

    while (j <= r) {
      tempArray[k] = array[j];
      buffer.push(array[j]);
      j++;
      k++;
    }

    // Copy back to array
    for (let p = 0; p < buffer.length; p++) {
      array[l + p] = buffer[p];
    }

    steps.push({
      stepIndex: stepIndex++,
      title: `✅ Sao chép mảng đệm vào mảng gốc [${l} ... ${r}]`,
      description: `Đoạn [${l} ... ${r}] đã được trộn và sắp xếp hoàn chỉnh thành: [${buffer.join(', ')}].`,
      detail: `Mảng gốc được cập nhật với các giá trị đã sắp xếp.`,
      codeLine: 13,
      actionType: 'MERGE',
      variables: {
        mergedRange: `[${l} ... ${r}]`,
        sortedElements: buffer.join(', '),
      },
      dataSnapshot: cloneSnapshot(null, null, null, null, null, [l, r], `Đã trộn xong đoạn [${l}..${r}]: [${buffer.join(', ')}]`),
    });
  };

  const mergeSortRecursive = (l: number, r: number) => {
    if (l >= r) return;

    const mid = l + Math.floor((r - l) / 2);

    steps.push({
      stepIndex: stepIndex++,
      title: `Chia đôi mảng [${l} ... ${r}] tại mid = ${mid}`,
      description: `Chia đoạn con thành 2 nửa: nửa trái [${l} ... ${mid}] và nửa phải [${mid + 1} ... ${r}].`,
      detail: `Đệ quy chia nhỏ cho đến khi kích thước đoạn con = 1.`,
      codeLine: 18,
      actionType: 'SPLIT',
      variables: {
        currentRange: `[${l} ... ${r}]`,
        mid,
        leftHalf: `[${l} ... ${mid}]`,
        rightHalf: `[${mid + 1} ... ${r}]`,
      },
      dataSnapshot: cloneSnapshot([l, mid], [mid + 1, r], null, null, null, null, `Chia đôi đoạn [${l}..${r}] tại mid=${mid}.`),
    });

    mergeSortRecursive(l, mid);
    mergeSortRecursive(mid + 1, r);
    merge(l, mid, r);
  };

  mergeSortRecursive(0, n - 1);

  // Final step
  steps.push({
    stepIndex: stepIndex++,
    title: '🎉 Hoàn tất Merge Sort!',
    description: `Toàn bộ mảng gồm ${n} phần tử đã được sắp xếp tăng dần hoàn hảo: [${array.join(', ')}].`,
    detail: 'Merge Sort đảm bảo tính ổn định (Stable Sort) và đạt hiệu năng O(N log N) bền bỉ.',
    codeLine: 22,
    actionType: 'COMPLETE',
    variables: {
      isSorted: true,
      totalElements: n,
    },
    dataSnapshot: cloneSnapshot(null, null, null, null, null, [0, n - 1], `Sắp xếp hoàn tất! [${array.join(', ')}]`),
  });

  return steps;
}
