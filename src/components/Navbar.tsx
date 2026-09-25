import React, { useState } from 'react';
import { 
  Network, 
  Binary, 
  RotateCcw,
  Route,
  GitMerge,
  ArrowDownUp,
  Workflow,
  Layers,
  Split,
  GitBranch,
  LayoutGrid,
  GitFork,
  Backpack,
  Crown,
  Menu,
  X
} from 'lucide-react';
import { AlgorithmCategory } from '../types/algorithm';

interface NavbarProps {
  currentAlgorithm: AlgorithmCategory;
  onSelectAlgorithm: (algo: AlgorithmCategory) => void;
  onOpenCatalog: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentAlgorithm,
  onSelectAlgorithm,
  onOpenCatalog,
  onReset,
}) => {
  const quickAlgorithms: { id: AlgorithmCategory; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'DSU',
      label: 'DSU',
      icon: <Network className="w-3.5 h-3.5" />,
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/15',
    },
    {
      id: 'BINARY_SEARCH',
      label: 'Binary Search',
      icon: <Binary className="w-3.5 h-3.5" />,
      color: 'text-purple-400 border-purple-500/30 bg-purple-500/15',
    },
    {
      id: 'DIJKSTRA',
      label: 'Dijkstra',
      icon: <Route className="w-3.5 h-3.5" />,
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/15',
    },
    {
      id: 'KRUSKAL',
      label: 'Kruskal MST',
      icon: <GitMerge className="w-3.5 h-3.5" />,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/15',
    },
    {
      id: 'QUICK_SORT',
      label: 'Quick Sort',
      icon: <ArrowDownUp className="w-3.5 h-3.5" />,
      color: 'text-sky-400 border-sky-500/30 bg-sky-500/15',
    },
    {
      id: 'MERGE_SORT',
      label: 'Merge Sort',
      icon: <Split className="w-3.5 h-3.5" />,
      color: 'text-rose-400 border-rose-500/30 bg-rose-500/15',
    },
    {
      id: 'HEAP_SORT',
      label: 'Heap Sort',
      icon: <GitFork className="w-3.5 h-3.5" />,
      color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/15',
    },
    {
      id: 'BFS',
      label: 'BFS (Queue)',
      icon: <Workflow className="w-3.5 h-3.5" />,
      color: 'text-teal-400 border-teal-500/30 bg-teal-500/15',
    },
    {
      id: 'DFS',
      label: 'DFS (Stack)',
      icon: <Layers className="w-3.5 h-3.5" />,
      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/15',
    },
    {
      id: 'TOPO_SORT',
      label: 'Topo Sort',
      icon: <Workflow className="w-3.5 h-3.5" />,
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/15',
    },
    {
      id: 'BST',
      label: 'BST Tree',
      icon: <GitBranch className="w-3.5 h-3.5" />,
      color: 'text-lime-400 border-lime-500/30 bg-lime-500/15',
    },
    {
      id: 'TRIE',
      label: 'Trie Prefix',
      icon: <GitBranch className="w-3.5 h-3.5" />,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/15',
    },
    {
      id: 'KNAPSACK',
      label: 'Knapsack DP',
      icon: <Backpack className="w-3.5 h-3.5" />,
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/15',
    },
    {
      id: 'N_QUEENS',
      label: 'N-Queens',
      icon: <Crown className="w-3.5 h-3.5" />,
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/15',
    },
  ];

  const [drawerOpen, setDrawerOpen] = useState(false);

  const pick = (a: AlgorithmCategory) => {
    onSelectAlgorithm(a);
    setDrawerOpen(false);
  };

  const tab = (a: (typeof quickAlgorithms)[number]) => (
    <button
      key={a.id}
      onClick={() => pick(a.id)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
        currentAlgorithm === a.id
          ? `${a.color} border shadow-sm`
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
      }`}
    >
      {a.icon}
      <span>{a.label}</span>
    </button>
  );

  return (
    <header className="h-16 border-b border-slate-800/80 bg-dark-900/90 backdrop-blur-md px-3 md:px-6 flex items-center justify-between sticky top-0 z-40 gap-3">
      {/* Brand Logo & Catalog Button */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1px] flex items-center justify-center shadow-glow-cyan">
            <div className="w-full h-full bg-dark-900 rounded-xl flex items-center justify-center">
              <Network className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="hidden xl:block">
            <span className="font-bold text-base md:text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
              AlgoVision
            </span>
          </div>
        </div>

        {/* Algorithm Catalog Button */}
        <button
          onClick={onOpenCatalog}
          className="flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-xl bg-dark-850 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all shadow-sm"
          title="Mở toàn bộ danh mục 14 thuật toán"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Kho Thuật Toán</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            14
          </span>
        </button>
      </div>

      {/* Algorithm Quick Switcher Tabs (Desktop horizontal scrollable) */}
      <div className="hidden lg:flex items-center bg-dark-850 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-[850px] scrollbar-thin">
        {quickAlgorithms.map(tab)}
      </div>

      {/* Mobile: hamburger + reset */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-1.5 px-2.5 md:px-3 min-h-[44px] min-w-[44px] rounded-xl bg-dark-800 hover:bg-slate-700/60 border border-slate-700/60 text-slate-300 hover:text-white transition-all text-xs"
          title="Khởi tạo lại trạng thái ban đầu (R)"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden md:inline">Reset</span>
        </button>

        <button
          onClick={() => setDrawerOpen((o) => !o)}
          className="lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-dark-800 hover:bg-slate-700/60 border border-slate-700/60 text-slate-200 transition-all"
          title="Chọn thuật toán"
        >
          {drawerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Algorithm Drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-dark-900/70 backdrop-blur-sm z-40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed left-0 right-0 top-16 z-50 max-h-[62vh] overflow-y-auto bg-dark-900/95 backdrop-blur-xl border-b border-slate-800 px-3 py-3 grid grid-cols-2 gap-2 shadow-2xl">
            {quickAlgorithms.map((a) => (
              <button
                key={a.id}
                onClick={() => pick(a.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  currentAlgorithm === a.id
                    ? `${a.color} shadow-sm`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-slate-800'
                }`}
              >
                {a.icon}
                <span className="truncate">{a.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </header>
  );
};
