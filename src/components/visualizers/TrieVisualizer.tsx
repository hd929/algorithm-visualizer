import React from 'react';
import { TrieSnapshot, TrieNode } from '../../types/trie';
import { GitBranch, Check, Search, PlusCircle, Sparkles } from 'lucide-react';

interface TrieVisualizerProps {
  snapshot: TrieSnapshot;
}

export const TrieVisualizer: React.FC<TrieVisualizerProps> = ({ snapshot }) => {
  const {
    nodes,
    rootId,
    activeNodeId,
    currentWord,
    charIndex,
    operation,
    matchedPrefix,
    wordsInserted,
    status,
  } = snapshot;

  // Layout node coordinates recursively for the SVG canvas
  const getNodeCoordinates = (): Record<string, { x: number; y: number }> => {
    const coords: Record<string, { x: number; y: number }> = {};
    coords[rootId] = { x: 300, y: 40 };

    // Group nodes by depth
    const levels: Record<number, string[]> = {};
    for (const [id, node] of Object.entries(nodes)) {
      if (id === rootId) continue;
      const d = node.depth;
      if (!levels[d]) levels[d] = [];
      levels[d].push(id);
    }

    const maxDepth = Math.max(1, ...Object.keys(levels).map(Number));
    const ySpacing = Math.min(65, 230 / maxDepth);

    for (const [depthStr, ids] of Object.entries(levels)) {
      const d = Number(depthStr);
      const totalInLevel = ids.length;
      const xSpacing = 500 / (totalInLevel + 1);

      ids.forEach((id, index) => {
        coords[id] = {
          x: 50 + (index + 1) * xSpacing,
          y: 40 + d * ySpacing,
        };
      });
    }

    return coords;
  };

  const coords = getNodeCoordinates();

  return (
    <div className="flex flex-col h-full gap-3 overflow-hidden">
      {/* Top Header Controls / Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dark-850/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Thao tác:</span>
            <span
              className={`px-2.5 py-0.5 rounded-lg border font-mono font-bold text-xs flex items-center gap-1.5 ${
                operation === 'INSERT'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                  : operation === 'SEARCH'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {operation === 'INSERT' && <PlusCircle className="w-3.5 h-3.5" />}
              {operation === 'SEARCH' && <Search className="w-3.5 h-3.5" />}
              <span>{operation}: "{currentWord}"</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-dark-900 border border-slate-800 text-slate-300">
              Tiền tố khớp: <span className="text-cyan-400 font-bold">"{matchedPrefix}"</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-dark-900 border border-slate-800 text-slate-300">
              Ký tự: <span className="text-purple-300 font-bold">{charIndex >= 0 ? currentWord[charIndex] : '—'}</span>
            </span>
          </div>
        </div>

        {/* Word Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {wordsInserted.map((w) => (
            <span
              key={w}
              className="px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono flex items-center gap-1"
            >
              <Check className="w-3 h-3 text-emerald-400" />
              <span>{w}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Trie SVG Graph */}
      <div className="flex-1 min-h-[380px] bg-dark-900/90 rounded-2xl border border-slate-800/80 flex flex-col justify-between p-4 relative overflow-hidden select-none">
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 600 300" className="w-full h-full max-h-[320px]">
            {/* Edge Connections */}
            {Object.values(nodes).map((node) => {
              if (node.id === rootId) return null;
              const pCoords = coords[node.parentId || rootId];
              const cCoords = coords[node.id];
              if (!pCoords || !cCoords) return null;

              const isEdgeActive =
                activeNodeId === node.id || (node.parentId && activeNodeId === node.parentId);

              return (
                <g key={`edge-${node.id}`}>
                  <line
                    x1={pCoords.x}
                    y1={pCoords.y}
                    x2={cCoords.x}
                    y2={cCoords.y}
                    stroke={isEdgeActive ? '#38bdf8' : '#334155'}
                    strokeWidth={isEdgeActive ? 2.5 : 1.5}
                    strokeDasharray={isEdgeActive ? 'none' : '2 2'}
                  />
                  {/* Character label on edge */}
                  <rect
                    x={(pCoords.x + cCoords.x) / 2 - 8}
                    y={(pCoords.y + cCoords.y) / 2 - 8}
                    width={16}
                    height={16}
                    rx={4}
                    fill="#0f172a"
                    stroke="#334155"
                    strokeWidth={1}
                  />
                  <text
                    x={(pCoords.x + cCoords.x) / 2}
                    y={(pCoords.y + cCoords.y) / 2 + 4}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize={11}
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {node.char}
                  </text>
                </g>
              );
            })}

            {/* Tree Nodes */}
            {Object.values(nodes).map((node) => {
              const pos = coords[node.id];
              if (!pos) return null;

              const isRoot = node.id === rootId;
              const isActive = activeNodeId === node.id;
              const isEnd = node.isEndOfWord;

              let fillColor = '#1e293b';
              let strokeColor = '#475569';
              let textColor = '#cbd5e1';

              if (isRoot) {
                fillColor = '#0f172a';
                strokeColor = '#0284c7';
                textColor = '#38bdf8';
              } else if (isActive) {
                fillColor = '#0e7490';
                strokeColor = '#22d3ee';
                textColor = '#ffffff';
              } else if (isEnd) {
                fillColor = '#064e3b';
                strokeColor = '#10b981';
                textColor = '#a7f3d0';
              }

              return (
                <g key={`trie-node-${node.id}`} className="transition-all duration-300">
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isRoot ? 22 : 18}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isActive || isEnd ? 2.5 : 1.5}
                    className={isActive ? 'shadow-glow-cyan' : ''}
                  />
                  {isEnd && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={22}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                    />
                  )}
                  <text
                    x={pos.x}
                    y={pos.y + (isRoot ? 4 : 5)}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize={isRoot ? 10 : 13}
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {node.char}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Bottom Legend */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block"></span>
              <span>Nút đang duyệt</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-400 inline-block"></span>
              <span>Kết thúc từ (isEndOfWord = true)</span>
            </span>
          </div>

          <span className="text-slate-500">Mỗi nút lưu con trong bảng băm / mảng ký tự</span>
        </div>
      </div>
    </div>
  );
};
