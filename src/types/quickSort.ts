export interface QuickSortSnapshot {
  array: number[];
  pivotIndex: number | null;
  low: number;
  high: number;
  i: number | null;
  j: number | null;
  swappedIndices: [number, number] | null;
  sortedIndices: number[];
  partitionRange: [number, number];
  logMessage: string;
}
