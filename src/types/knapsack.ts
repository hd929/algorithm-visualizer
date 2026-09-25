export interface KnapsackItem {
  id: number;
  name: string;
  weight: number;
  value: number;
  color: string;
}

export interface KnapsackSnapshot {
  items: KnapsackItem[];
  capacity: number;
  dpTable: number[][]; // (n+1) x (capacity+1)
  currentItemIdx: number; // 1 to n (or 0 during init)
  currentWeight: number; // 0 to capacity
  decision?: 'TAKE' | 'SKIP' | 'COMPARE' | 'INIT' | 'BACKTRACK';
  comparingCells?: { r: number; c: number; label: string }[];
  selectedItemIds: number[];
  maxValueFound?: number;
}
