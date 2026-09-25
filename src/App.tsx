import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AlgorithmCategory, AlgorithmStep } from './types/algorithm';

// Types
import { DSUOperation, DSUSnapshot } from './types/dsu';
import { BinarySearchSnapshot } from './types/binarySearch';
import { DijkstraSnapshot } from './types/dijkstra';
import { KruskalSnapshot } from './types/kruskal';
import { QuickSortSnapshot } from './types/quickSort';
import { BFSSnapshot } from './types/bfs';
import { DFSSnapshot } from './types/dfs';
import { MergeSortSnapshot } from './types/mergeSort';
import { BSTSnapshot } from './types/bst';
import { KnapsackSnapshot } from './types/knapsack';
import { HeapSortSnapshot } from './types/heapSort';
import { NQueensSnapshot } from './types/nQueens';
import { TrieSnapshot } from './types/trie';
import { TopoSortSnapshot } from './types/topoSort';

// Engines & Snippets
import { recordDSUSimulation } from './algorithms/dsu/dsuEngine';
import { DSU_CODE_LINES } from './algorithms/dsu/dsuSnippets';
import { recordBinarySearchSimulation } from './algorithms/binarySearch/bsEngine';
import { BS_CODE_LINES } from './algorithms/binarySearch/bsSnippets';
import { recordDijkstraSimulation } from './algorithms/dijkstra/dijkstraEngine';
import { DIJKSTRA_CODE_LINES } from './algorithms/dijkstra/dijkstraSnippets';
import { recordKruskalSimulation } from './algorithms/kruskal/kruskalEngine';
import { KRUSKAL_CODE_LINES } from './algorithms/kruskal/kruskalSnippets';
import { recordQuickSortSimulation } from './algorithms/quickSort/quickSortEngine';
import { QUICK_SORT_CODE_LINES } from './algorithms/quickSort/quickSortSnippets';
import { recordBFSSimulation } from './algorithms/bfs/bfsEngine';
import { BFS_CODE_LINES } from './algorithms/bfs/bfsSnippets';
import { recordDFSSimulation } from './algorithms/dfs/dfsEngine';
import { DFS_CODE_LINES } from './algorithms/dfs/dfsSnippets';
import { recordMergeSortSimulation } from './algorithms/mergesort/mergeSortEngine';
import { MERGE_SORT_CODE_LINES } from './algorithms/mergesort/mergeSortSnippets';
import { recordBSTSimulation } from './algorithms/bst/bstEngine';
import { BST_CODE_LINES } from './algorithms/bst/bstSnippets';
import { recordKnapsackSimulation } from './algorithms/knapsack/knapsackEngine';
import { KNAPSACK_CODE_LINES } from './algorithms/knapsack/knapsackSnippets';
import { recordHeapSortSimulation, DEFAULT_HEAP_ARRAY } from './algorithms/heapSort/heapSortEngine';
import { HEAP_SORT_CODE_LINES } from './algorithms/heapSort/heapSortSnippets';
import { recordNQueensSimulation } from './algorithms/nQueens/nQueensEngine';
import { N_QUEENS_CODE_LINES } from './algorithms/nQueens/nQueensSnippets';
import { recordTrieSimulation } from './algorithms/trie/trieEngine';
import { TRIE_CODE_LINES } from './algorithms/trie/trieSnippets';
import { recordTopoSortSimulation } from './algorithms/topoSort/topoSortEngine';
import { TOPO_SORT_CODE_LINES } from './algorithms/topoSort/topoSortSnippets';

// Components
import { usePlayback } from './engine/usePlayback';
import { Navbar } from './components/Navbar';
import { PlaybackControls } from './components/PlaybackControls';
import { CodeViewer } from './components/CodeViewer';
import { AlgorithmCatalogModal } from './components/AlgorithmCatalogModal';

// Visualizers
import { DSUVisualizer } from './components/visualizers/DSUVisualizer';
import { BinarySearchVisualizer } from './components/visualizers/BinarySearchVisualizer';
import { DijkstraVisualizer } from './components/visualizers/DijkstraVisualizer';
import { KruskalVisualizer } from './components/visualizers/KruskalVisualizer';
import { QuickSortVisualizer } from './components/visualizers/QuickSortVisualizer';
import { BFSVisualizer } from './components/visualizers/BFSVisualizer';
import { DFSVisualizer } from './components/visualizers/DFSVisualizer';
import { MergeSortVisualizer } from './components/visualizers/MergeSortVisualizer';
import { BSTVisualizer } from './components/visualizers/BSTVisualizer';
import { KnapsackVisualizer } from './components/visualizers/KnapsackVisualizer';
import { HeapSortVisualizer } from './components/visualizers/HeapSortVisualizer';
import { NQueensVisualizer } from './components/visualizers/NQueensVisualizer';
import { TrieVisualizer } from './components/visualizers/TrieVisualizer';
import { TopoSortVisualizer } from './components/visualizers/TopoSortVisualizer';

import { Sparkles, Info, CheckCircle2, AlertTriangle, Layers, Zap, Backpack, Crown, GitFork, Code2, MonitorPlay } from 'lucide-react';

export const App: React.FC = () => {
  // Active Algorithm
  const [currentAlgorithm, setCurrentAlgorithm] = useState<AlgorithmCategory>('DSU');
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false);
  const [mobilePane, setMobilePane] = useState<'visualizer' | 'code'>('visualizer');

  // 1. DSU State
  const [dsuNodeCount, setDsuNodeCount] = useState<number>(7);
  const [dsuOperations, setDsuOperations] = useState<DSUOperation[]>([
    { type: 'UNION', u: 0, v: 1 },
    { type: 'UNION', u: 1, v: 2 },
    { type: 'UNION', u: 3, v: 4 },
    { type: 'UNION', u: 4, v: 5 },
    { type: 'UNION', u: 2, v: 5 },
    { type: 'FIND', u: 5 },
    { type: 'UNION', u: 0, v: 4 },
  ]);

  // 2. Binary Search State
  const [bsArray, setBsArray] = useState<number[]>([
    4, 9, 15, 23, 31, 42, 56, 67, 78, 89, 95, 108
  ]);
  const [bsTarget, setBsTarget] = useState<number>(42);

  // 3. Dijkstra State
  const [dijkstraSource, setDijkstraSource] = useState<number>(0);

  // 4. QuickSort State
  const [qsArray, setQsArray] = useState<number[]>([
    48, 15, 82, 33, 64, 21, 95, 7, 56, 39, 72, 28
  ]);

  // 5. MergeSort State
  const [msArray, setMsArray] = useState<number[]>([
    38, 27, 43, 3, 9, 82, 10, 19, 54, 12, 65, 31
  ]);

  // 6. BST State
  const [bstValues, setBstValues] = useState<number[]>([
    45, 25, 65, 15, 35, 55, 75, 30
  ]);

  // 7. BFS / DFS State
  const [bfsStartNode, setBfsStartNode] = useState<number>(0);
  const [dfsStartNode, setDfsStartNode] = useState<number>(0);

  // 8. HeapSort State
  const [heapArray, setHeapArray] = useState<number[]>([...DEFAULT_HEAP_ARRAY]);

  // 9. N-Queens State
  const [nQueensSize, setNQueensSize] = useState<number>(4);

  // Generate steps per algorithm
  const dsuSteps = useMemo(() => recordDSUSimulation(dsuNodeCount, dsuOperations), [dsuNodeCount, dsuOperations]);
  const bsSteps = useMemo(() => recordBinarySearchSimulation(bsArray, bsTarget), [bsArray, bsTarget]);
  const dijkstraSteps = useMemo(() => recordDijkstraSimulation(dijkstraSource), [dijkstraSource]);
  const kruskalSteps = useMemo(() => recordKruskalSimulation(), []);
  const qsSteps = useMemo(() => recordQuickSortSimulation(qsArray), [qsArray]);
  const bfsSteps = useMemo(() => recordBFSSimulation(bfsStartNode), [bfsStartNode]);
  const dfsSteps = useMemo(() => recordDFSSimulation(dfsStartNode), [dfsStartNode]);
  const msSteps = useMemo(() => recordMergeSortSimulation(msArray), [msArray]);
  const bstSteps = useMemo(() => recordBSTSimulation(bstValues), [bstValues]);
  const knapsackSteps = useMemo(() => recordKnapsackSimulation(), []);
  const heapSortSteps = useMemo(() => recordHeapSortSimulation(heapArray), [heapArray]);
  const nQueensSteps = useMemo(() => recordNQueensSimulation(nQueensSize), [nQueensSize]);
  const trieSteps = useMemo(() => recordTrieSimulation(), []);
  const topoSortSteps = useMemo(() => recordTopoSortSimulation(), []);

  // Active steps passed to playback engine
  const activeSteps = useMemo<AlgorithmStep<any>[]>(() => {
    switch (currentAlgorithm) {
      case 'DSU':
        return dsuSteps;
      case 'BINARY_SEARCH':
        return bsSteps;
      case 'DIJKSTRA':
        return dijkstraSteps;
      case 'KRUSKAL':
        return kruskalSteps;
      case 'QUICK_SORT':
        return qsSteps;
      case 'BFS':
        return bfsSteps;
      case 'DFS':
        return dfsSteps;
      case 'MERGE_SORT':
        return msSteps;
      case 'BST':
        return bstSteps;
      case 'KNAPSACK':
        return knapsackSteps;
      case 'HEAP_SORT':
        return heapSortSteps;
      case 'N_QUEENS':
        return nQueensSteps;
      case 'TRIE':
        return trieSteps;
      case 'TOPO_SORT':
        return topoSortSteps;
      default:
        return dsuSteps;
    }
  }, [
    currentAlgorithm,
    dsuSteps,
    bsSteps,
    dijkstraSteps,
    kruskalSteps,
    qsSteps,
    bfsSteps,
    dfsSteps,
    msSteps,
    bstSteps,
    knapsackSteps,
    heapSortSteps,
    nQueensSteps,
    trieSteps,
    topoSortSteps,
  ]);

  const playback = usePlayback(activeSteps);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        playback.togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        playback.nextStep();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        playback.prevStep();
      } else if (e.key === 'r' || e.key === 'R') {
        playback.reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playback]);

  // Code details mapping
  const codeDetails = useMemo(() => {
    switch (currentAlgorithm) {
      case 'DSU':
        return { title: 'DSU_DisjointSet.cpp', lines: DSU_CODE_LINES };
      case 'BINARY_SEARCH':
        return { title: 'BinarySearch.cpp', lines: BS_CODE_LINES };
      case 'DIJKSTRA':
        return { title: 'Dijkstra_ShortestPath.cpp', lines: DIJKSTRA_CODE_LINES };
      case 'KRUSKAL':
        return { title: 'Kruskal_MST.cpp', lines: KRUSKAL_CODE_LINES };
      case 'QUICK_SORT':
        return { title: 'QuickSort_Lomuto.cpp', lines: QUICK_SORT_CODE_LINES };
      case 'BFS':
        return { title: 'BFS_Queue.cpp', lines: BFS_CODE_LINES };
      case 'DFS':
        return { title: 'DFS_RecursionStack.cpp', lines: DFS_CODE_LINES };
      case 'MERGE_SORT':
        return { title: 'MergeSort_DivideAndConquer.cpp', lines: MERGE_SORT_CODE_LINES };
      case 'BST':
        return { title: 'BST_BinarySearchTree.cpp', lines: BST_CODE_LINES };
      case 'KNAPSACK':
        return { title: 'Knapsack_DP.cpp', lines: KNAPSACK_CODE_LINES };
      case 'HEAP_SORT':
        return { title: 'HeapSort_MaxHeap.cpp', lines: HEAP_SORT_CODE_LINES };
      case 'N_QUEENS':
        return { title: 'NQueens_Backtracking.cpp', lines: N_QUEENS_CODE_LINES };
      case 'TRIE':
        return { title: 'Trie_PrefixTree.cpp', lines: TRIE_CODE_LINES };
      case 'TOPO_SORT':
        return { title: 'TopologicalSort_Kahn.cpp', lines: TOPO_SORT_CODE_LINES };
      default:
        return { title: 'Code.cpp', lines: [] };
    }
  }, [currentAlgorithm]);

  // Handlers
  const handleSelectAlgorithm = useCallback((algo: AlgorithmCategory) => {
    setCurrentAlgorithm(algo);
    setMobilePane('visualizer');
    playback.reset();
  }, [playback]);

  const handleGenerateRandomBSArray = useCallback(() => {
    const size = 12;
    const nums = new Set<number>();
    while (nums.size < size) {
      nums.add(Math.floor(Math.random() * 95) + 5);
    }
    const sorted = Array.from(nums).sort((a, b) => a - b);
    const randomTarget = Math.random() > 0.3 
      ? sorted[Math.floor(Math.random() * sorted.length)] 
      : Math.floor(Math.random() * 95) + 5;
    setBsArray(sorted);
    setBsTarget(randomTarget);
  }, []);

  const handleGenerateRandomQSArray = useCallback(() => {
    const size = 12;
    const newArr: number[] = [];
    for (let i = 0; i < size; i++) {
      newArr.push(Math.floor(Math.random() * 92) + 8);
    }
    setQsArray(newArr);
  }, []);

  const handleGenerateRandomMSArray = useCallback(() => {
    const size = 12;
    const newArr: number[] = [];
    for (let i = 0; i < size; i++) {
      newArr.push(Math.floor(Math.random() * 92) + 8);
    }
    setMsArray(newArr);
  }, []);

  const handleGenerateRandomHeapArray = useCallback(() => {
    const size = 7;
    const newArr: number[] = [];
    for (let i = 0; i < size; i++) {
      newArr.push(Math.floor(Math.random() * 85) + 10);
    }
    setHeapArray(newArr);
  }, []);

  // Active step details
  const activeStep = playback.currentStep;
  const activeCodeLine = activeStep ? activeStep.codeLine : 1;
  const activeVariables = activeStep ? activeStep.variables : {};

  // Action badge resolver
  const getBadge = () => {
    if (!activeStep) return { icon: <Info className="w-3 h-3" />, label: 'READY', cls: 'bg-slate-800 text-slate-300' };
    switch (activeStep.actionType) {
      case 'PATH_COMPRESS':
        return { icon: <Zap className="w-3 h-3 text-amber-400" />, label: 'PATH COMPRESSION', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'UNION_BY_RANK':
        return { icon: <Sparkles className="w-3 h-3 text-cyan-400" />, label: 'UNION BY RANK', cls: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
      case 'CYCLE_DETECTED':
        return { icon: <AlertTriangle className="w-3 h-3 text-rose-400" />, label: 'CHU TRÌNH (CYCLE)', cls: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
      case 'FOUND':
        return { icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />, label: 'TÌM THẤY TARGET', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'RELAX_EDGE':
        return { icon: <Zap className="w-3 h-3 text-cyan-400" />, label: 'RELAX EDGE', cls: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
      case 'ADD_TO_MST':
        return { icon: <Sparkles className="w-3 h-3 text-emerald-400" />, label: 'CHẤP NHẬN VÀO MST', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'SWAP':
        return { icon: <Sparkles className="w-3 h-3 text-purple-400" />, label: 'HOÁN ĐỔI (SWAP)', cls: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
      case 'DP_TAKE':
        return { icon: <Backpack className="w-3 h-3 text-emerald-400" />, label: 'LẤY VÀO BALO', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'DP_SKIP':
        return { icon: <Info className="w-3 h-3 text-slate-400" />, label: 'BỎ QUA VẬT PHẨM', cls: 'bg-slate-500/15 text-slate-300 border-slate-500/30' };
      case 'HEAPIFY':
        return { icon: <GitFork className="w-3 h-3 text-yellow-400" />, label: 'VUN ĐỐNG HEAPIFY', cls: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30' };
      case 'PLACE_QUEEN':
        return { icon: <Crown className="w-3 h-3 text-cyan-400" />, label: 'ĐẶT QUÂN HẬU', cls: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
      case 'CONFLICT':
        return { icon: <AlertTriangle className="w-3 h-3 text-rose-400" />, label: 'CHIẾU XUNG ĐỘT', cls: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
      case 'BACKTRACK':
        return { icon: <Info className="w-3 h-3 text-amber-400" />, label: 'QUAY LUI (BACKTRACK)', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'TRIE_INSERT':
        return { icon: <Sparkles className="w-3 h-3 text-cyan-400" />, label: 'CHÈN TỪ TRIE', cls: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
      case 'TRIE_TRAVERSE':
        return { icon: <Zap className="w-3 h-3 text-purple-400" />, label: 'DUYỆT TIỀN TỐ', cls: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
      case 'OUTPUT_ORDER':
        return { icon: <CheckCircle2 className="w-3 h-3 text-sky-400" />, label: 'XUẤT THỨ TỰ TÔ-PÔ', cls: 'bg-sky-500/15 text-sky-300 border-sky-500/30' };
      case 'REDUCE_INDEGREE':
        return { icon: <Zap className="w-3 h-3 text-teal-400" />, label: 'GIẢM IN-DEGREE', cls: 'bg-teal-500/15 text-teal-300 border-teal-500/30' };
      default:
        return { icon: <Info className="w-3 h-3 text-cyan-400" />, label: activeStep.actionType, cls: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
    }
  };


  const badge = getBadge();

  return (
    <div className="h-[100dvh] w-screen flex flex-col bg-dark-900 text-slate-100 overflow-hidden select-none">
      {/* 1. Navbar (Fixed height 56px) */}
      <Navbar
        currentAlgorithm={currentAlgorithm}
        onSelectAlgorithm={handleSelectAlgorithm}
        onOpenCatalog={() => setIsCatalogOpen(true)}
        onReset={playback.reset}
      />

      {/* 2. Top Step Narration & Live Variables Bar (Fixed height ~52px) — stack on mobile */}
      <div className="bg-dark-850/90 border-b border-slate-800/80 px-3 md:px-6 py-2 flex flex-col sm:flex-row sm:items-center gap-2 shrink-0 z-20">
        {/* Upper row: Badge + Title/Description */}
        <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border shrink-0 ${badge.cls}`}>
            {badge.icon}
            <span className="hidden sm:inline">{badge.label}</span>
            <span className="sm:hidden">{badge.label.slice(0, 10)}</span>
          </span>

          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-xs md:text-sm text-slate-100 truncate">
              {activeStep ? activeStep.title : 'Chuẩn bị mô phỏng'}
            </h2>
            <p className="text-[11px] text-slate-400 hidden sm:block truncate">
              {activeStep ? activeStep.description : 'Bấm Play hoặc Bước tiếp theo để bắt đầu.'}
            </p>
          </div>
        </div>

        {/* Lower row on mobile: Live Variable Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto shrink-0 max-w-full sm:max-w-[45%] scrollbar-thin">
          {Object.entries(activeVariables).slice(0, 5).map(([k, v]) => (
            <div
              key={k}
              className="px-2 py-0.5 rounded-lg bg-dark-900 border border-slate-800 flex items-center gap-1.5 text-[11px] font-mono shrink-0"
            >
              <span className="text-slate-500">{k}:</span>
              <span className="text-cyan-300 font-bold">{String(v)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile pane tabs (pill segmented control) */}
      <div className="lg:hidden flex justify-center shrink-0 py-1.5">
        <div className="inline-flex bg-dark-850 border border-slate-800 rounded-full p-1 gap-1">
          {(['visualizer', 'code'] as const).map((p) => {
            const on = mobilePane === p;
            return (
              <button
                key={p}
                onClick={() => setMobilePane(p)}
                className={`px-5 py-2 min-h-[44px] rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${on ? 'bg-cyan-500 text-dark-900 shadow-glow-cyan' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {p === 'visualizer' ? <MonitorPlay className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                <span>{p === 'visualizer' ? 'Mô phỏng' : 'Code'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Central Studio Area (Flex-1, side-by-side, no overflow) */}
      <div className="flex-1 min-h-0 p-2 md:p-4 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch overflow-y-auto lg:overflow-hidden">
        {/* Left Column: Visualizer Canvas (7 cols) — hidden when Code pane on mobile */}
        <div className={`lg:col-span-7 h-full min-h-0 flex flex-col lg:overflow-hidden ${mobilePane === 'code' ? 'hidden lg:flex' : 'flex'}`}>

          {currentAlgorithm === 'DSU' && (
            <DSUVisualizer
              snapshot={
                (activeStep?.dataSnapshot as unknown as DSUSnapshot) ||
                dsuSteps[0]?.dataSnapshot
              }
              onRunCustomOperations={(ops) => setDsuOperations((prev) => [...prev, ...ops])}
            />
          )}

          {currentAlgorithm === 'BINARY_SEARCH' && (
            <BinarySearchVisualizer
              snapshot={
                (activeStep?.dataSnapshot as unknown as BinarySearchSnapshot) ||
                bsSteps[0]?.dataSnapshot
              }
              onSetNewTarget={(newTarget) => setBsTarget(newTarget)}
              onGenerateRandomArray={handleGenerateRandomBSArray}
            />
          )}

          {currentAlgorithm === 'DIJKSTRA' && (
            <DijkstraVisualizer
              snapshot={
                (activeStep?.dataSnapshot as unknown as DijkstraSnapshot) ||
                dijkstraSteps[0]?.dataSnapshot
              }
              onSelectSource={(src) => setDijkstraSource(src)}
            />
          )}

          {currentAlgorithm === 'KRUSKAL' && (
            <KruskalVisualizer
              snapshot={
                (activeStep?.dataSnapshot as unknown as KruskalSnapshot) ||
                kruskalSteps[0]?.dataSnapshot
              }
            />
          )}

          {currentAlgorithm === 'QUICK_SORT' && (
            <QuickSortVisualizer
              snapshot={
                (activeStep?.dataSnapshot as unknown as QuickSortSnapshot) ||
                qsSteps[0]?.dataSnapshot
              }
              onGenerateRandomArray={handleGenerateRandomQSArray}
            />
          )}

          {currentAlgorithm === 'BFS' && (
            <BFSVisualizer
              snapshot={
                (activeStep?.dataSnapshot as unknown as BFSSnapshot) ||
                bfsSteps[0]?.dataSnapshot
              }
              onSelectStartNode={(node) => setBfsStartNode(node)}
            />
          )}

          {currentAlgorithm === 'DFS' && (
            <DFSVisualizer
              snapshot={
                (activeStep?.dataSnapshot as unknown as DFSSnapshot) ||
                dfsSteps[0]?.dataSnapshot
              }
            />
          )}

          {currentAlgorithm === 'MERGE_SORT' && (
            <MergeSortVisualizer
              snapshot={
                (activeStep?.dataSnapshot as unknown as MergeSortSnapshot) ||
                msSteps[0]?.dataSnapshot
              }
              onGenerateRandomArray={handleGenerateRandomMSArray}
            />
          )}

          {currentAlgorithm === 'BST' && (
            <BSTVisualizer
              snapshot={
                (activeStep?.dataSnapshot as unknown as BSTSnapshot) ||
                bstSteps[0]?.dataSnapshot
              }
            />
          )}

          {currentAlgorithm === 'KNAPSACK' && (
            <KnapsackVisualizer
              snapshot={
                (activeStep?.dataSnapshot as unknown as KnapsackSnapshot) ||
                knapsackSteps[0]?.dataSnapshot
              }
            />
          )}

          {currentAlgorithm === 'HEAP_SORT' && (
            <HeapSortVisualizer
              snapshot={
                (activeStep?.dataSnapshot as unknown as HeapSortSnapshot) ||
                heapSortSteps[0]?.dataSnapshot
              }
              onGenerateRandomArray={handleGenerateRandomHeapArray}
            />
          )}

          {currentAlgorithm === 'N_QUEENS' && (
            <NQueensVisualizer
              snapshot={
                (activeStep?.dataSnapshot as unknown as NQueensSnapshot) ||
                nQueensSteps[0]?.dataSnapshot
              }
            />
          )}

          {currentAlgorithm === 'TRIE' && (
            <TrieVisualizer
              snapshot={
                (activeStep?.dataSnapshot as unknown as TrieSnapshot) ||
                trieSteps[0]?.dataSnapshot
              }
            />
          )}

          {currentAlgorithm === 'TOPO_SORT' && (
            <TopoSortVisualizer
              snapshot={
                (activeStep?.dataSnapshot as unknown as TopoSortSnapshot) ||
                topoSortSteps[0]?.dataSnapshot
              }
            />
          )}
        </div>


        {/* Right Column: Code Viewer (5 cols) — side-by-side on desktop, tabbed on mobile */}
        <div className={`lg:col-span-5 h-full min-h-0 flex flex-col overflow-hidden ${mobilePane === 'visualizer' ? 'hidden lg:flex' : 'flex'}`}>
          <CodeViewer
            title={codeDetails.title}
            lines={codeDetails.lines}
            activeLine={activeCodeLine}
          />
        </div>
      </div>

      {/* 4. Docked Bottom Playback Bar (Fixed at very bottom, never overlapping!) */}
      <PlaybackControls
        currentStepIndex={playback.currentStepIndex}
        totalSteps={playback.totalSteps}
        isPlaying={playback.isPlaying}
        speed={playback.speed}
        onTogglePlay={playback.togglePlay}
        onNext={playback.nextStep}
        onPrev={playback.prevStep}
        onReset={playback.reset}
        onGoToStep={playback.goToStep}
        onSetSpeed={playback.setSpeed}
      />

      {/* Algorithm Catalog Modal */}
      <AlgorithmCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        currentAlgorithm={currentAlgorithm}
        onSelectAlgorithm={handleSelectAlgorithm}
      />
    </div>
  );
};

export default App;
