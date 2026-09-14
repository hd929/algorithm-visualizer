export interface MergeSortSnapshot {
  array: number[];
  tempArray: (number | null)[];
  leftRange: [number, number] | null;
  rightRange: [number, number] | null;
  i: number | null;
  j: number | null;
  k: number | null;
  activeMergedRange: [number, number] | null;
  logMessage: string;
}
