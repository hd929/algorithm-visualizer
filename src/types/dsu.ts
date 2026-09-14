export interface DSUNode {
  id: number;
  parent: number;
  rank: number;
  size: number;
  x: number;
  y: number;
  clusterRoot: number;
  color: string;
}

export interface DSUEdge {
  id: string;
  source: number;
  target: number;
  state: 'idle' | 'testing' | 'connected' | 'cycle';
}

export interface DSUSnapshot {
  nodes: DSUNode[];
  edges: DSUEdge[];
  parent: number[];
  rank: number[];
  size: number[];
  activeNodes: number[]; // e.g. nodes being queried
  pathHighlighted: number[]; // path from node to root
  compressedEdges?: { from: number; oldTo: number; newTo: number }[];
  activePair?: [number, number];
  rootU?: number;
  rootV?: number;
  numComponents: number;
  logMessage: string;
}

export interface DSUOperation {
  type: 'UNION' | 'FIND';
  u: number;
  v?: number;
}
