export type BinarySearchMode = 'STANDARD' | 'LOWER_BOUND' | 'UPPER_BOUND' | 'ROTATED';

export interface BinarySearchSnapshot {
  array: number[];
  target: number;
  low: number;
  high: number;
  mid: number;
  foundIndex: number | null;
  eliminatedIndices: number[];
  activeIndices: number[];
  comparisonText: string;
  verdict: 'WAITING' | 'EQUAL' | 'GO_LEFT' | 'GO_RIGHT' | 'DONE';
}
