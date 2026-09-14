import { AlgorithmStep } from '../../types/algorithm';
import { BinarySearchSnapshot } from '../../types/binarySearch';

export function recordBinarySearchSimulation(
  rawArray: number[],
  target: number
): AlgorithmStep<BinarySearchSnapshot>[] {
  // Ensure array is sorted for binary search
  const array = [...rawArray].sort((a, b) => a - b);
  const steps: AlgorithmStep<BinarySearchSnapshot>[] = [];
  let stepIndex = 0;

  let low = 0;
  let high = array.length - 1;
  const eliminatedSet = new Set<number>();

  // Step 0: Initial state
  steps.push({
    stepIndex: stepIndex++,
    title: 'Khởi tạo khoảng tìm kiếm',
    description: `Mảng đã sắp xếp gồm ${array.length} phần tử. Thiết lập con trỏ low = 0, high = ${high}. Cần tìm target = ${target}.`,
    detail: 'Không gian tìm kiếm ban đầu bao gồm toàn bộ mảng [0 ... ' + high + '].',
    codeLine: 2,
    actionType: 'INIT',
    variables: {
      low: 0,
      high: high,
      mid: 'chưa tính',
      target: target,
      arrayLength: array.length,
    },
    dataSnapshot: {
      array,
      target,
      low: 0,
      high: high,
      mid: -1,
      foundIndex: null,
      eliminatedIndices: [],
      activeIndices: Array.from({ length: array.length }, (_, i) => i),
      comparisonText: `Chuẩn bị tìm kiếm giá trị ${target}...`,
      verdict: 'WAITING',
    },
  });

  let found = false;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    const midVal = array[mid];

    // Step: Calculate mid
    steps.push({
      stepIndex: stepIndex++,
      title: `Tính Mid = low + (high - low) / 2 = ${mid}`,
      description: `Tính điểm chia giữa: mid = ${low} + (${high} - ${low}) / 2 = ${mid}. Giá trị tại arr[${mid}] = ${midVal}.`,
      detail: `Khoảng đang xét hiện tại là [${low} ... ${high}] gồm ${high - low + 1} phần tử.`,
      codeLine: 6,
      actionType: 'SEARCH_STEP',
      variables: {
        low,
        high,
        mid,
        'arr[mid]': midVal,
        target,
      },
      dataSnapshot: {
        array,
        target,
        low,
        high,
        mid,
        foundIndex: null,
        eliminatedIndices: Array.from(eliminatedSet),
        activeIndices: Array.from({ length: high - low + 1 }, (_, i) => low + i),
        comparisonText: `Đang kiểm tra phần tử chính giữa: arr[${mid}] = ${midVal}`,
        verdict: 'WAITING',
      },
    });

    // Step: Compare arr[mid] with target
    if (midVal === target) {
      found = true;
      steps.push({
        stepIndex: stepIndex++,
        title: `🎯 Tìm thấy target = ${target} tại chỉ số ${mid}!`,
        description: `Giá trị arr[${mid}] = ${midVal} chính xác bằng target = ${target}! Thuật toán dừng thành công.`,
        detail: `Đã tìm ra kết quả sau ${stepIndex - 1} bước so sánh. Độ phức tạp O(log N).`,
        codeLine: 8,
        actionType: 'FOUND',
        variables: {
          low,
          high,
          mid,
          'arr[mid]': midVal,
          target,
          result: `Index ${mid}`,
        },
        dataSnapshot: {
          array,
          target,
          low,
          high,
          mid,
          foundIndex: mid,
          eliminatedIndices: Array.from(eliminatedSet),
          activeIndices: [mid],
          comparisonText: `arr[${mid}] (${midVal}) == target (${target}) ➔ TÌM THẤY!`,
          verdict: 'EQUAL',
        },
      });
      break;
    } else if (midVal < target) {
      // Step: arr[mid] < target -> eliminate left half
      for (let i = low; i <= mid; i++) {
        eliminatedSet.add(i);
      }
      const nextLow = mid + 1;

      steps.push({
        stepIndex: stepIndex++,
        title: `arr[${mid}] (${midVal}) < target (${target}) ➔ Cắt bỏ nửa trái`,
        description: `Vì mảng đã sắp xếp và arr[${mid}] < ${target}, tất cả các phần tử từ chỉ số ${low} đến ${mid} đều nhỏ hơn target.`,
        detail: `Cắt bỏ nửa trái [${low} ... ${mid}]. Dời con trỏ low sang mid + 1 = ${nextLow}.`,
        codeLine: 12,
        actionType: 'COMPARE',
        variables: {
          low: nextLow,
          high,
          mid,
          'arr[mid]': midVal,
          target,
          action: 'low = mid + 1',
        },
        dataSnapshot: {
          array,
          target,
          low: nextLow,
          high,
          mid,
          foundIndex: null,
          eliminatedIndices: Array.from(eliminatedSet),
          activeIndices: Array.from({ length: Math.max(0, high - nextLow + 1) }, (_, i) => nextLow + i),
          comparisonText: `${midVal} < ${target} ➔ Loại bỏ [${low} ... ${mid}], dời low = ${nextLow}`,
          verdict: 'GO_RIGHT',
        },
      });

      low = nextLow;
    } else {
      // Step: arr[mid] > target -> eliminate right half
      for (let i = mid; i <= high; i++) {
        eliminatedSet.add(i);
      }
      const nextHigh = mid - 1;

      steps.push({
        stepIndex: stepIndex++,
        title: `arr[${mid}] (${midVal}) > target (${target}) ➔ Cắt bỏ nửa phải`,
        description: `Vì mảng đã sắp xếp và arr[${mid}] > ${target}, tất cả các phần tử từ chỉ số ${mid} đến ${high} đều lớn hơn target.`,
        detail: `Cắt bỏ nửa phải [${mid} ... ${high}]. Dời con trỏ high sang mid - 1 = ${nextHigh}.`,
        codeLine: 16,
        actionType: 'COMPARE',
        variables: {
          low,
          high: nextHigh,
          mid,
          'arr[mid]': midVal,
          target,
          action: 'high = mid - 1',
        },
        dataSnapshot: {
          array,
          target,
          low,
          high: nextHigh,
          mid,
          foundIndex: null,
          eliminatedIndices: Array.from(eliminatedSet),
          activeIndices: Array.from({ length: Math.max(0, nextHigh - low + 1) }, (_, i) => low + i),
          comparisonText: `${midVal} > ${target} ➔ Loại bỏ [${mid} ... ${high}], dời high = ${nextHigh}`,
          verdict: 'GO_LEFT',
        },
      });

      high = nextHigh;
    }
  }

  if (!found) {
    // Mark all as eliminated
    for (let i = 0; i < array.length; i++) {
      eliminatedSet.add(i);
    }
    steps.push({
      stepIndex: stepIndex++,
      title: `❌ Không tìm thấy target = ${target} trong mảng!`,
      description: `Điều kiện low (${low}) > high (${high}) xảy ra. Không gian tìm kiếm đã cạn kiệt.`,
      detail: `Giá trị ${target} không tồn tại trong mảng. Hàm trả về -1.`,
      codeLine: 20,
      actionType: 'NOT_FOUND',
      variables: {
        low,
        high,
        target,
        result: -1,
      },
      dataSnapshot: {
        array,
        target,
        low,
        high,
        mid: -1,
        foundIndex: null,
        eliminatedIndices: Array.from(eliminatedSet),
        activeIndices: [],
        comparisonText: `low > high (${low} > ${high}) ➔ Không tồn tại ${target}!`,
        verdict: 'DONE',
      },
    });
  }

  return steps;
}
