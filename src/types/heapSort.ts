export interface HeapTreeNode {
  index: number;
  value: number;
  x: number;
  y: number;
  left?: number;
  right?: number;
}

export interface HeapSortSnapshot {
  array: number[];
  heapSize: number;
  phase: 'BUILD_HEAP' | 'HEAPIFY' | 'EXTRACT_MAX' | 'SORTED';
  activeIndices: number[]; // Indices currently compared or examined
  swapIndices?: [number, number]; // Pair currently being swapped
  sortedIndices: number[]; // Indices that have been moved to sorted position at end
  largestIdx?: number;
  rootIdx?: number;
}
