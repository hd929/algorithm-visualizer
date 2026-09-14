export interface BFSNode {
  id: number;
  x: number;
  y: number;
  level: number;
  visited: boolean;
  parent: number | null;
}

export interface BFSEdge {
  id: string;
  u: number;
  v: number;
  state: 'idle' | 'exploring' | 'tree' | 'cross';
}

export interface BFSSnapshot {
  nodes: BFSNode[];
  edges: BFSEdge[];
  queue: number[];
  currentNode: number | null;
  visitedOrder: number[];
  logMessage: string;
}
