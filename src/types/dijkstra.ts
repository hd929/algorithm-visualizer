export interface DijkstraNode {
  id: number;
  x: number;
  y: number;
  dist: number; // Infinity is represented as 999999
  visited: boolean;
  parent: number | null;
}

export interface DijkstraEdge {
  id: string;
  u: number;
  v: number;
  weight: number;
  state: 'idle' | 'exploring' | 'relaxed' | 'tree' | 'unused';
}

export interface PriorityQueueItem {
  dist: number;
  node: number;
}

export interface DijkstraSnapshot {
  nodes: DijkstraNode[];
  edges: DijkstraEdge[];
  pq: PriorityQueueItem[];
  currentNode: number | null;
  activeEdge: string | null;
  sourceNode: number;
  targetNode: number | null;
  dist: number[];
  visited: boolean[];
  logMessage: string;
}
