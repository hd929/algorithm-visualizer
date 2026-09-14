export interface BSTNode {
  id: number;
  val: number;
  x: number;
  y: number;
  left: number | null;
  right: number | null;
  parent: number | null;
  state: 'normal' | 'comparing' | 'inserted' | 'inorder';
}

export interface BSTSnapshot {
  nodes: BSTNode[];
  rootId: number | null;
  insertingVal: number | null;
  comparingNodeId: number | null;
  inorderList: number[];
  logMessage: string;
}
