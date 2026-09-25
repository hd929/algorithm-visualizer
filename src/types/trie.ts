export interface TrieNode {
  id: string;
  char: string;
  isEndOfWord: boolean;
  children: Record<string, string>; // char -> nodeId
  parentId?: string;
  depth: number;
}

export interface TrieSnapshot {
  nodes: Record<string, TrieNode>;
  rootId: string;
  activeNodeId: string;
  currentWord: string;
  charIndex: number;
  operation: 'INSERT' | 'SEARCH' | 'DONE';
  matchedPrefix: string;
  wordsInserted: string[];
  status: 'IDLE' | 'TRAVERSING' | 'ADDED_CHAR' | 'MARKED_END' | 'WORD_FOUND' | 'PREFIX_FOUND' | 'NOT_FOUND';
}
