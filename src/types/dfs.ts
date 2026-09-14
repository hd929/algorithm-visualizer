export interface DFSNode {
  id: number;
  x: number;
  y: number;
  visited: boolean;
  entryTime: number;
  exitTime: number;
  isBacktracking: boolean;
}

export interface DFSEdge {
  id: string;
  u: number;
  v: number;
  state: 'idle' | 'tree' | 'back' | 'exploring';
}

export interface DFSSnapshot {
  nodes: DFSNode[];
  edges: DFSEdge[];
  callStack: number[];
  currentNode: number | null;
  visitedOrder: number[];
  logMessage: string;
}
