import { AlgorithmStep } from '../../types/algorithm';
import { KnapsackItem, KnapsackSnapshot } from '../../types/knapsack';

export const DEFAULT_KNAPSACK_ITEMS: KnapsackItem[] = [
  { id: 1, name: 'Phone', weight: 1, value: 15, color: '#38bdf8' },
  { id: 2, name: 'Camera', weight: 2, value: 25, color: '#a855f7' },
  { id: 3, name: 'Laptop', weight: 3, value: 40, color: '#ec4899' },
  { id: 4, name: 'Console', weight: 2, value: 30, color: '#10b981' },
];

export const DEFAULT_KNAPSACK_CAPACITY = 5;

export function recordKnapsackSimulation(
  items: KnapsackItem[] = DEFAULT_KNAPSACK_ITEMS,
  capacity: number = DEFAULT_KNAPSACK_CAPACITY
): AlgorithmStep<KnapsackSnapshot>[] {
  const steps: AlgorithmStep<KnapsackSnapshot>[] = [];
  const n = items.length;

  // Initialize DP table (n+1) x (capacity+1) with 0
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array(capacity + 1).fill(0)
  );

  const cloneTable = () => dp.map((row) => [...row]);

  // Step 0: Init
  steps.push({
    stepIndex: steps.length,
    title: 'Khởi tạo Bảng Quy Hoạch Động (DP Table)',
    description: `Khởi tạo bảng dp[${n + 1}][${capacity + 1}] bằng 0. Hàng i biểu thị xét i vật phẩm đầu tiên, cột w biểu thị sức chứa tối đa.`,
    detail: `Số vật phẩm = ${n}, Sức chứa Balo W = ${capacity}.`,
    codeLine: 8,
    actionType: 'INIT',
    variables: { n, W: capacity, 'dp[0..n][0..W]': 0 },
    dataSnapshot: {
      items,
      capacity,
      dpTable: cloneTable(),
      currentItemIdx: 0,
      currentWeight: 0,
      decision: 'INIT',
      selectedItemIds: [],
    },
  });

  // DP Loops
  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];

    for (let w = 1; w <= capacity; w++) {
      if (item.weight <= w) {
        const skipVal = dp[i - 1][w];
        const prevRemain = dp[i - 1][w - item.weight];
        const takeVal = item.value + prevRemain;

        const isTakeBetter = takeVal > skipVal;
        dp[i][w] = Math.max(takeVal, skipVal);

        steps.push({
          stepIndex: steps.length,
          title: `Xét Vật phẩm #${i} (${item.name}) tại Sức chứa w=${w}`,
          description: `Vật phẩm ${item.name} (w=${item.weight}, v=${item.value}) <= ${w}. So sánh: Bỏ qua (dp[${i - 1}][${w}]=${skipVal}) vs Lấy (giá trị ${item.value} + dp[${i - 1}][${w - item.weight}]=${takeVal}) ➔ ${isTakeBetter ? 'LẤY' : 'BỎ QUA'}.`,
          detail: `dp[${i}][${w}] = max(${takeVal}, ${skipVal}) = ${dp[i][w]}`,
          codeLine: 16,
          actionType: isTakeBetter ? 'DP_TAKE' : 'DP_SKIP',
          variables: {
            i,
            item: item.name,
            weight: item.weight,
            val: item.value,
            w,
            skipVal,
            takeVal,
            'dp[i][w]': dp[i][w],
          },
          dataSnapshot: {
            items,
            capacity,
            dpTable: cloneTable(),
            currentItemIdx: i,
            currentWeight: w,
            decision: isTakeBetter ? 'TAKE' : 'SKIP',
            comparingCells: [
              { r: i - 1, c: w, label: `Skip: ${skipVal}` },
              { r: i - 1, c: w - item.weight, label: `+${item.value}` },
            ],
            selectedItemIds: [],
          },
        });
      } else {
        // Cannot take
        dp[i][w] = dp[i - 1][w];
        steps.push({
          stepIndex: steps.length,
          title: `Vật phẩm #${i} (${item.name}) quá nặng (w=${item.weight} > ${w})`,
          description: `Không thể đưa ${item.name} vào balo có sức chứa ${w}. Giá trị tối ưu giữ nguyên từ hàng trước: dp[${i - 1}][${w}] = ${dp[i][w]}.`,
          detail: `dp[${i}][${w}] = dp[${i - 1}][${w}] = ${dp[i][w]}`,
          codeLine: 19,
          actionType: 'DP_SKIP',
          variables: {
            i,
            item: item.name,
            weight: item.weight,
            w,
            'dp[i][w]': dp[i][w],
          },
          dataSnapshot: {
            items,
            capacity,
            dpTable: cloneTable(),
            currentItemIdx: i,
            currentWeight: w,
            decision: 'SKIP',
            comparingCells: [{ r: i - 1, c: w, label: `Copy: ${dp[i][w]}` }],
            selectedItemIds: [],
          },
        });
      }
    }
  }

  // Backtracking to find optimal items
  let res = dp[n][capacity];
  let curW = capacity;
  const selected: number[] = [];

  steps.push({
    stepIndex: steps.length,
    title: 'Hoàn tất Bảng DP ➔ Bắt đầu Truy Vết Kết Quả Tối Ưu',
    description: `Giá trị tối đa đạt được là dp[${n}][${capacity}] = ${res}. Bắt đầu truy ngược từ ô [${n}][${capacity}] để xác định các vật phẩm đã được chọn.`,
    detail: `Max Profit = ${res}, Bắt đầu tại w = ${curW}.`,
    codeLine: 26,
    actionType: 'DP_CALCULATE',
    variables: { 'Max Profit': res, 'Remaining Capacity': curW },
    dataSnapshot: {
      items,
      capacity,
      dpTable: cloneTable(),
      currentItemIdx: n,
      currentWeight: curW,
      decision: 'BACKTRACK',
      selectedItemIds: [],
      maxValueFound: res,
    },
  });

  for (let i = n; i > 0 && res > 0; i--) {
    const item = items[i - 1];
    if (res !== dp[i - 1][curW]) {
      selected.push(item.id);
      res -= item.value;
      curW -= item.weight;

      steps.push({
        stepIndex: steps.length,
        title: `Truy vết: Đã chọn Vật phẩm #${i} (${item.name})`,
        description: `Vì dp[${i}][${curW + item.weight}] (${dp[i][curW + item.weight]}) != dp[${i - 1}][${curW + item.weight}] (${dp[i - 1][curW + item.weight]}), chứng tỏ vật phẩm ${item.name} đã được chọn! Trừ giá trị ${item.value} và giảm sức chứa đi ${item.weight}.`,
        detail: `Đã chọn: ${item.name} (w=${item.weight}, v=${item.value}). Sức chứa còn lại = ${curW}.`,
        codeLine: 29,
        actionType: 'DP_TAKE',
        variables: {
          'Selected Item': item.name,
          'Item Weight': item.weight,
          'Item Value': item.value,
          'Remaining W': curW,
        },
        dataSnapshot: {
          items,
          capacity,
          dpTable: cloneTable(),
          currentItemIdx: i,
          currentWeight: curW + item.weight,
          decision: 'BACKTRACK',
          selectedItemIds: [...selected],
          maxValueFound: dp[n][capacity],
        },
      });
    } else {
      steps.push({
        stepIndex: steps.length,
        title: `Truy vết: Bỏ qua Vật phẩm #${i} (${item.name})`,
        description: `Vì dp[${i}][${curW}] == dp[${i - 1}][${curW}], vật phẩm ${item.name} không được chọn.`,
        detail: `Chuyển lên hàng trên i=${i - 1}.`,
        codeLine: 28,
        actionType: 'DP_SKIP',
        variables: { 'Skipped Item': item.name, 'Remaining W': curW },
        dataSnapshot: {
          items,
          capacity,
          dpTable: cloneTable(),
          currentItemIdx: i,
          currentWeight: curW,
          decision: 'BACKTRACK',
          selectedItemIds: [...selected],
          maxValueFound: dp[n][capacity],
        },
      });
    }
  }

  // Final complete step
  steps.push({
    stepIndex: steps.length,
    title: 'Hoàn Thành Bài Toán Balo 0/1 (Knapsack Complete)',
    description: `Tổng giá trị lớn nhất có thể thu được: ${dp[n][capacity]}. Danh sách vật phẩm được chọn vào balo: [${selected.map((id) => items.find((it) => it.id === id)?.name).join(', ')}].`,
    detail: `Tổng trọng lượng = ${capacity - curW}/${capacity}`,
    codeLine: 35,
    actionType: 'COMPLETE',
    variables: {
      'Total Value': dp[n][capacity],
      'Total Weight': `${capacity - curW}/${capacity}`,
      'Items Count': selected.length,
    },
    dataSnapshot: {
      items,
      capacity,
      dpTable: cloneTable(),
      currentItemIdx: 0,
      currentWeight: 0,
      decision: 'BACKTRACK',
      selectedItemIds: [...selected],
      maxValueFound: dp[n][capacity],
    },
  });

  return steps;
}
