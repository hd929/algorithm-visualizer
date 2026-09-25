import { AlgorithmStep } from '../../types/algorithm';
import { NQueensSnapshot, QueenPosition } from '../../types/nQueens';

export function recordNQueensSimulation(n: number = 4): AlgorithmStep<NQueensSnapshot>[] {
  const steps: AlgorithmStep<NQueensSnapshot>[] = [];
  const board: number[] = Array(n).fill(-1);
  let solutionsFound = 0;

  const currentQueens = (): QueenPosition[] => {
    const list: QueenPosition[] = [];
    for (let r = 0; r < n; r++) {
      if (board[r] !== -1) {
        list.push({ row: r, col: board[r] });
      }
    }
    return list;
  };

  // Step 0: Init
  steps.push({
    stepIndex: steps.length,
    title: `Khởi tạo Bàn Cờ Vua kích thước ${n}x${n}`,
    description: `Mục tiêu: Đặt ${n} quân hậu lên bàn cờ ${n}x${n} sao cho không có 2 quân hậu nào tấn công lẫn nhau (cùng hàng, cùng cột, hoặc cùng đường chéo).`,
    detail: `Kích thước N = ${n}. Sử dụng thuật toán quay lui (Backtracking).`,
    codeLine: 35,
    actionType: 'INIT',
    variables: { N: n, 'Số nghiệm tìm được': 0 },
    dataSnapshot: {
      n,
      queens: [],
      currentRow: 0,
      currentCol: -1,
      status: 'TESTING',
      conflicts: [],
      solutionsFound: 0,
    },
  });

  const checkSafeAndGetConflicts = (
    row: number,
    col: number
  ): { isSafe: boolean; conflicts: QueenPosition[] } => {
    const conflicts: QueenPosition[] = [];
    for (let prevRow = 0; prevRow < row; prevRow++) {
      const prevCol = board[prevRow];
      // Same column
      if (prevCol === col) {
        conflicts.push({ row: prevRow, col: prevCol });
      }
      // Same diagonal
      else if (Math.abs(prevRow - row) === Math.abs(prevCol - col)) {
        conflicts.push({ row: prevRow, col: prevCol });
      }
    }
    return { isSafe: conflicts.length === 0, conflicts };
  };

  const solve = (row: number) => {
    if (row === n) {
      solutionsFound++;
      steps.push({
        stepIndex: steps.length,
        title: `🎉 Tìm Thấy Nghiệm Hợp Lệ Thứ #${solutionsFound}!`,
        description: `Đã đặt thành công ${n} quân hậu trên toàn bộ ${n} hàng mà không hề có bất kỳ xung đột nào!`,
        detail: `Nghiệm: [${currentQueens().map((q) => `(${q.row},${q.col})`).join(', ')}]`,
        codeLine: 19,
        actionType: 'FOUND',
        variables: {
          'Nghiệm số': solutionsFound,
          'Trạng thái': 'SUCCESS',
        },
        dataSnapshot: {
          n,
          queens: currentQueens(),
          currentRow: row,
          currentCol: -1,
          status: 'SOLUTION_FOUND',
          conflicts: [],
          solutionsFound,
          currentSolution: currentQueens(),
        },
      });
      return;
    }

    for (let col = 0; col < n; col++) {
      const { isSafe: safe, conflicts } = checkSafeAndGetConflicts(row, col);

      // Testing step
      steps.push({
        stepIndex: steps.length,
        title: `Thử Đặt Quân Hậu tại Hàng ${row}, Cột ${col}`,
        description: `Kiểm tra ô (${row}, ${col}) xem có bị các quân hậu trước đó chiếu tướng theo cột hoặc đường chéo không.`,
        detail: `Hàng ${row}, Cột ${col}: ${safe ? 'An toàn (Safe)' : 'Xung đột (Conflict)'}`,
        codeLine: 25,
        actionType: 'COMPARE',
        variables: {
          'Đang thử ô': `(${row}, ${col})`,
          'Trạng thái kiểm tra': safe ? 'AN TOÀN' : 'XUNG ĐỘT',
        },
        dataSnapshot: {
          n,
          queens: currentQueens(),
          currentRow: row,
          currentCol: col,
          status: 'TESTING',
          conflicts,
          solutionsFound,
        },
      });

      if (safe) {
        board[row] = col;

        steps.push({
          stepIndex: steps.length,
          title: `Đặt Quân Hậu Vào Ô (${row}, ${col})`,
          description: `Ô (${row}, ${col}) hoàn toàn an toàn! Cố định quân hậu tại đây và tiến hành đệ quy xuống hàng ${row + 1}.`,
          detail: `Quân hậu hàng ${row} đặt tại cột ${col}.`,
          codeLine: 26,
          actionType: 'PLACE_QUEEN',
          variables: {
            'Quân hậu mới': `(${row}, ${col})`,
            'Tiếp theo': `Đệ quy row=${row + 1}`,
          },
          dataSnapshot: {
            n,
            queens: currentQueens(),
            currentRow: row,
            currentCol: col,
            status: 'SAFE',
            conflicts: [],
            solutionsFound,
          },
        });

        // Recurse
        solve(row + 1);

        // Backtrack
        board[row] = -1;
        steps.push({
          stepIndex: steps.length,
          title: `Quay Lui (Backtrack): Gỡ Quân Hậu khỏi Ô (${row}, ${col})`,
          description: `Đã thử hết các nhánh đệ quy bên dưới. Thu hồi lại quyết định, gỡ quân hậu khỏi ô (${row}, ${col}) để thử tiếp cột kế tiếp ${col + 1}.`,
          detail: `Gỡ hậu tại row ${row}. Thử tiếp các cột còn lại.`,
          codeLine: 28,
          actionType: 'BACKTRACK',
          variables: {
            'Quay lui tại': `(${row}, ${col})`,
            'Hành động': 'Gỡ quân hậu & thử cột kế tiếp',
          },
          dataSnapshot: {
            n,
            queens: currentQueens(),
            currentRow: row,
            currentCol: col,
            status: 'BACKTRACK',
            conflicts: [],
            solutionsFound,
          },
        });
      } else {
        // Conflict step
        steps.push({
          stepIndex: steps.length,
          title: `Xung Đột tại Ô (${row}, ${col}) ➔ Bỏ Qua`,
          description: `Không thể đặt hậu tại (${row}, ${col}) vì bị quân hậu ở ô [${conflicts.map((c) => `(${c.row},${c.col})`).join(', ')}] chiếu theo đường chéo/cột!`,
          detail: `Xung đột với ${conflicts.length} quân hậu trước đó.`,
          codeLine: 13,
          actionType: 'CONFLICT',
          variables: {
            'Xung đột tại': `(${row}, ${col})`,
            'Chiếu bởi': conflicts.map((c) => `(${c.row},${c.col})`).join('; '),
          },
          dataSnapshot: {
            n,
            queens: currentQueens(),
            currentRow: row,
            currentCol: col,
            status: 'CONFLICT',
            conflicts,
            solutionsFound,
          },
        });
      }
    }
  };

  solve(0);

  // Complete
  steps.push({
    stepIndex: steps.length,
    title: `Hoàn Tất Thuật Toán N-Queens (Tổng cộng: ${solutionsFound} Nghiệm)`,
    description: `Đã duyệt vét cạn toàn bộ không gian trạng thái bằng kỹ thuật quay lui. Tìm thấy tổng cộng ${solutionsFound} cách xếp ${n} quân hậu an toàn trên bàn cờ.`,
    detail: `N = ${n}, Total Solutions = ${solutionsFound}`,
    codeLine: 38,
    actionType: 'COMPLETE',
    variables: {
      'Tổng nghiệm': solutionsFound,
      'Không gian tìm kiếm': 'Đã hoàn tất',
    },
    dataSnapshot: {
      n,
      queens: [],
      currentRow: -1,
      currentCol: -1,
      status: 'COMPLETE',
      conflicts: [],
      solutionsFound,
    },
  });

  return steps;
}
