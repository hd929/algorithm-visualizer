export type AlgorithmCategory = 
  | 'DSU' 
  | 'BINARY_SEARCH' 
  | 'DIJKSTRA' 
  | 'KRUSKAL' 
  | 'QUICK_SORT'
  | 'BFS'
  | 'DFS'
  | 'MERGE_SORT'
  | 'BST'
  | 'KNAPSACK'
  | 'HEAP_SORT'
  | 'N_QUEENS'
  | 'TRIE'
  | 'TOPO_SORT';

export interface AlgorithmStep<T = any> {
  stepIndex: number;
  title: string;
  description: string;
  detail?: string;
  codeLine: number; // 1-indexed line in current code snippet
  actionType: 
    | 'INIT' 
    | 'SEARCH_STEP' 
    | 'COMPARE' 
    | 'SWAP'
    | 'PARTITION'
    | 'MERGE'
    | 'SPLIT'
    | 'RELAX_EDGE'
    | 'EXTRACT_MIN'
    | 'ENQUEUE'
    | 'DEQUEUE'
    | 'PUSH_STACK'
    | 'POP_STACK'
    | 'BACKTRACK'
    | 'INSERT_NODE'
    | 'ADD_TO_MST'
    | 'REJECT_CYCLE'
    | 'FOUND' 
    | 'NOT_FOUND' 
    | 'FIND_ROOT' 
    | 'PATH_COMPRESS' 
    | 'CHECK_SAME_SET' 
    | 'UNION_BY_RANK' 
    | 'CYCLE_DETECTED' 
    | 'DP_CALCULATE'
    | 'DP_TAKE'
    | 'DP_SKIP'
    | 'HEAPIFY'
    | 'PLACE_QUEEN'
    | 'REMOVE_QUEEN'
    | 'CONFLICT'
    | 'TRIE_INSERT'
    | 'TRIE_TRAVERSE'
    | 'REDUCE_INDEGREE'
    | 'OUTPUT_ORDER'
    | 'COMPLETE';
  variables: Record<string, string | number | boolean | null | undefined>;
  dataSnapshot: T;
}

export interface CodeSnippet {
  language: string;
  code: string;
  lines: string[];
}
