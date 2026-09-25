export interface TopoNode {
  id: number;
  label: string;
  inDegree: number;
  x: number;
  y: number;
}

export interface TopoEdge {
  from: number;
  to: number;
  active?: boolean;
  removed?: boolean;
}

export interface TopoSortSnapshot {
  nodes: TopoNode[];
  edges: TopoEdge[];
  queue: number[];
  topoOrder: number[];
  currentNode: number | null;
  phase: 'CALC_INDEGREE' | 'ENQUEUE_ZEROS' | 'PROCESS_NODE' | 'REDUCE_NEIGHBORS' | 'COMPLETE' | 'CYCLE';
}
