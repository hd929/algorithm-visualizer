export interface KruskalNode {
  id: number;
  x: number;
  y: number;
  parent: number;
  rank: number;
  color: string;
}

export interface KruskalEdge {
  id: string;
  u: number;
  v: number;
  weight: number;
  state: 'pending' | 'checking' | 'accepted' | 'rejected';
}

export interface KruskalSnapshot {
  nodes: KruskalNode[];
  edges: KruskalEdge[];
  sortedEdges: KruskalEdge[];
  currentEdgeIndex: number;
  mstEdges: KruskalEdge[];
  mstTotalWeight: number;
  numComponents: number;
  logMessage: string;
}
