export interface QueenPosition {
  row: number;
  col: number;
}

export interface NQueensSnapshot {
  n: number;
  queens: QueenPosition[]; // placed queens
  currentRow: number;
  currentCol: number;
  status: 'TESTING' | 'SAFE' | 'CONFLICT' | 'BACKTRACK' | 'SOLUTION_FOUND' | 'COMPLETE';
  conflicts: QueenPosition[]; // squares with attack conflict
  solutionsFound: number;
  currentSolution?: QueenPosition[];
}
