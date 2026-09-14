import React, { useState } from 'react';
import { 
  Network, 
  Binary, 
  Route, 
  GitMerge, 
  ArrowDownUp, 
  X, 
  Search, 
  ArrowRight,
  Layers,
  Sparkles,
  GitBranch,
  Split,
  Workflow
} from 'lucide-react';
import { AlgorithmCategory } from '../types/algorithm';

interface AlgorithmItem {
  id: AlgorithmCategory;
  name: string;
  category: 'Đồ Thị & Cụm' | 'Tìm Kiếm' | 'Sắp Xếp' | 'Cây & Cấu Trúc';
  icon: React.ReactNode;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  tags: string[];
}

interface AlgorithmCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAlgorithm: AlgorithmCategory;
  onSelectAlgorithm: (algo: AlgorithmCategory) => void;
}

export const ALGORITHMS_CATALOG: AlgorithmItem[] = [
  {
    id: 'DSU',
    name: 'Disjoint Set Union (DSU / Union-Find)',
    category: 'Đồ Thị & Cụm',
    icon: <Network className="w-5 h-5 text-cyan-400" />,
    timeComplexity: 'O(α(N))',
    spaceComplexity: 'O(N)',
    description: 'Quản lý các tập hợp không giao nhau, nén đường đi (Path Compression) và gộp theo rank (Union by Rank).',
    tags: ['Graph', 'Sets', 'Trees', 'Amortized'],
  },
  {
    id: 'BINARY_SEARCH',
    name: 'Binary Search (Tìm Kiếm Nhị Phân)',
    category: 'Tìm Kiếm',
    icon: <Binary className="w-5 h-5 text-purple-400" />,
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    description: 'Cắt đôi không gian tìm kiếm liên tục trên mảng đã sắp xếp với 3 con trỏ Low, Mid, High.',
    tags: ['Divide & Conquer', 'Array', 'Pointers'],
  },
  {
    id: 'DIJKSTRA',
    name: "Dijkstra's Shortest Path",
    category: 'Đồ Thị & Cụm',
    icon: <Route className="w-5 h-5 text-amber-400" />,
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V + E)',
    description: 'Tìm đường đi ngắn nhất từ đỉnh nguồn trên đồ thị có trọng số dương bằng hàng đợi ưu tiên Min-Heap.',
    tags: ['Graph', 'Shortest Path', 'Min-Heap', 'Greedy'],
  },
  {
    id: 'KRUSKAL',
    name: "Kruskal's Minimum Spanning Tree",
    category: 'Đồ Thị & Cụm',
    icon: <GitMerge className="w-5 h-5 text-emerald-400" />,
    timeComplexity: 'O(E log E)',
    spaceComplexity: 'O(V + E)',
    description: 'Xây dựng cây khung nhỏ nhất (MST) bằng cách duyệt danh sách cạnh sắp xếp theo trọng số kết hợp DSU.',
    tags: ['Graph', 'MST', 'Greedy', 'DSU'],
  },
  {
    id: 'QUICK_SORT',
    name: 'Quick Sort (Phân Hoạch Lomuto)',
    category: 'Sắp Xếp',
    icon: <ArrowDownUp className="w-5 h-5 text-sky-400" />,
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(log N)',
    description: 'Thuật toán chia để trị kinh điển: chọn Pivot, phân hoạch 2 nửa nhỏ hơn và lớn hơn rồi đệ quy.',
    tags: ['Sorting', 'Divide & Conquer', 'Swap', 'Pivot'],
  },
  {
    id: 'MERGE_SORT',
    name: 'Merge Sort (Sắp Xếp Trộn)',
    category: 'Sắp Xếp',
    icon: <Split className="w-5 h-5 text-rose-400" />,
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    description: 'Chia đôi mảng liên tục đến từng phần tử và trộn 2 nửa đã sắp xếp thông qua bộ đệm phụ temp[].',
    tags: ['Sorting', 'Divide & Conquer', 'Buffer', 'Stable'],
  },
  {
    id: 'BFS',
    name: 'Breadth-First Search (BFS)',
    category: 'Đồ Thị & Cụm',
    icon: <Workflow className="w-5 h-5 text-teal-400" />,
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description: 'Duyệt đồ thị theo từng lớp (Layer) bằng Hàng đợi Queue (FIFO), tìm đường đi ít cạnh nhất.',
    tags: ['Graph', 'Queue', 'FIFO', 'Layers'],
  },
  {
    id: 'DFS',
    name: 'Depth-First Search (DFS)',
    category: 'Đồ Thị & Cụm',
    icon: <Layers className="w-5 h-5 text-indigo-400" />,
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description: 'Duyệt đồ thị theo chiều sâu đệ quy bằng Call Stack (LIFO), tự động quay lui (Backtracking).',
    tags: ['Graph', 'Call Stack', 'LIFO', 'Backtracking'],
  },
  {
    id: 'BST',
    name: 'Binary Search Tree (Cây BST)',
    category: 'Cây & Cấu Trúc',
    icon: <GitBranch className="w-5 h-5 text-lime-400" />,
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(N)',
    description: 'Cấu trúc cây nhị phân tìm kiếm: node con trái < cha < node con phải. Duyệt In-order cho dãy tăng dần.',
    tags: ['Tree', 'Binary Tree', 'Inorder', 'Search'],
  },
];

export const AlgorithmCatalogModal: React.FC<AlgorithmCatalogModalProps> = ({
  isOpen,
  onClose,
  currentAlgorithm,
  onSelectAlgorithm,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const categories = ['ALL', 'Đồ Thị & Cụm', 'Tìm Kiếm', 'Sắp Xếp', 'Cây & Cấu Trúc'];

  const filteredAlgorithms = ALGORITHMS_CATALOG.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-dark-850 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-dark-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 shadow-glow-cyan">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>Kho Thuật Toán Mô Phỏng</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-normal">
                  {ALGORITHMS_CATALOG.length} Thuật toán
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Chọn một thuật toán để chuyển sang giao diện mô phỏng trực quan ngay lập tức
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-800 bg-dark-900/40 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm thuật toán (tên, từ khóa, độ phức tạp...)"
              className="w-full bg-dark-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-dark-900 font-bold shadow-sm'
                    : 'bg-dark-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat === 'ALL' ? 'Tất cả' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Algorithms Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAlgorithms.map((algo) => {
            const isCurrent = currentAlgorithm === algo.id;

            return (
              <div
                key={algo.id}
                onClick={() => {
                  onSelectAlgorithm(algo.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 group relative overflow-hidden ${
                  isCurrent
                    ? 'bg-gradient-to-br from-cyan-500/20 via-dark-850 to-purple-500/20 border-cyan-400 shadow-glow-cyan ring-1 ring-cyan-400/50'
                    : 'bg-dark-900/80 hover:bg-dark-800/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-dark-850 border border-slate-800 group-hover:border-slate-700">
                        {algo.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                          {algo.name}
                        </h3>
                        <span className="text-[10px] text-slate-400">
                          {algo.category}
                        </span>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        Đang chọn
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed pt-1">
                    {algo.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-dark-900 border border-slate-800 text-slate-400">
                      Time: <span className="text-cyan-300 font-semibold">{algo.timeComplexity}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-dark-900 border border-slate-800 text-slate-400">
                      Space: <span className="text-purple-300 font-semibold">{algo.spaceComplexity}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Mô phỏng</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
