import React from 'react';
import { HeapSortSnapshot } from '../../types/heapSort';
import { RefreshCw, GitFork, ArrowDownUp } from 'lucide-react';

interface HeapSortVisualizerProps {
  snapshot: HeapSortSnapshot;
  onGenerateRandomArray?: () => void;
}

export const HeapSortVisualizer: React.FC<HeapSortVisualizerProps> = ({
  snapshot,
  onGenerateRandomArray,
}) => {
  const {
    array,
    heapSize,
    phase,
    activeIndices,
    swapIndices,
    sortedIndices,
    largestIdx,
    rootIdx,
  } = snapshot;

  const maxVal = Math.max(...array, 1);

  // Binary tree node positions for 7-node complete tree
  // Level 0: 0
  // Level 1: 1, 2
  // Level 2: 3, 4, 5, 6
  const getTreeCoords = (i: number): { x: number; y: number } => {
    switch (i) {
      case 0:
        return { x: 300, y: 45 };
      case 1:
        return { x: 160, y: 115 };
      case 2:
        return { x: 440, y: 115 };
      case 3:
        return { x: 90, y: 185 };
      case 4:
        return { x: 230, y: 185 };
      case 5:
        return { x: 370, y: 185 };
      case 6:
        return { x: 510, y: 185 };
      default:
        return { x: 300 + (i - 3) * 50, y: 220 };
    }
  };

  return (
    <div className="flex flex-col h-full gap-3 overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dark-850/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Giai đoạn:</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-xs">
              {phase === 'BUILD_HEAP' && '1. Xây dựng Max-Heap'}
              {phase === 'EXTRACT_MAX' && '2. Trích xuất Cực Đại ➔ Cuối'}
              {phase === 'HEAPIFY' && '3. Vun Đống (Heapify) Lại'}
              {phase === 'SORTED' && 'Hoàn tất sắp xếp'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-dark-900 border border-slate-800 text-slate-300">
              Heap Size: <span className="text-cyan-400 font-bold">{heapSize}</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-dark-900 border border-slate-800 text-slate-300">
              Đã cố định: <span className="text-emerald-400 font-bold">{sortedIndices.length}/{array.length}</span>
            </span>
          </div>
        </div>

        {onGenerateRandomArray && (
          <button
            onClick={onGenerateRandomArray}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tạo mảng mới</span>
          </button>
        )}
      </div>

      {/* Main Dual Stage (Array Bars Top + Heap Tree Bottom) */}
      <div className="flex-1 min-h-[380px] bg-dark-900/90 rounded-2xl border border-slate-800/80 relative flex flex-col justify-between p-4 select-none gap-3 overflow-hidden">
        {/* Top: Array Bar View */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="font-semibold flex items-center gap-1.5">
              <span>Mảng nhị phân arr[]:</span>
            </span>
            <span className="text-[10px] text-slate-500">
              Phạm vi Heap: [0..{Math.max(0, heapSize - 1)}] | Phần đã sort: [{heapSize}..{array.length - 1}]
            </span>
          </div>

          <div className="flex items-end justify-center gap-2 md:gap-3 w-full h-[120px] pb-1 border-b border-slate-800/60">
            {array.map((val, idx) => {
              const isSorted = sortedIndices.includes(idx);
              const isActive = activeIndices.includes(idx);
              const isSwapping = swapIndices && (swapIndices[0] === idx || swapIndices[1] === idx);
              const isRoot = rootIdx === idx;
              const isLargest = largestIdx === idx;

              const heightPercent = Math.max(25, Math.round((val / maxVal) * 65) + 15);

              let barBg = 'bg-slate-800 border-slate-700 text-slate-300';
              if (isSorted) {
                barBg = 'bg-emerald-500/25 border-emerald-400 text-emerald-200';
              } else if (isSwapping) {
                barBg = 'bg-purple-500/40 border-purple-400 text-purple-200 ring-2 ring-purple-400/60 shadow-glow-purple';
              } else if (isLargest) {
                barBg = 'bg-amber-500/35 border-amber-400 text-amber-200 ring-2 ring-amber-400/60';
              } else if (isRoot) {
                barBg = 'bg-cyan-500/35 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/60';
              } else if (isActive) {
                barBg = 'bg-sky-500/25 border-sky-400 text-sky-200';
              }

              return (
                <div key={idx} className="flex-1 flex flex-col items-center max-w-[55px] h-full justify-end">
                  <span className="text-[11px] font-mono font-bold mb-1">{val}</span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-xl border transition-all duration-200 flex flex-col justify-end items-center pb-1 ${barBg}`}
                  >
                    {isSwapping && <ArrowDownUp className="w-3 h-3 text-purple-300 animate-bounce" />}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-1">[{idx}]</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom: Tree SVG Diagram (Max-Heap Visualizer) */}
        <div className="flex-1 relative min-h-[190px] w-full flex items-center justify-center">
          <svg viewBox="0 0 600 240" className="w-full h-full max-h-[220px]">
            {/* Tree Branch Edges */}
            {array.map((_, i) => {
              const left = 2 * i + 1;
              const right = 2 * i + 2;
              const pCoords = getTreeCoords(i);

              return (
                <g key={`edges-${i}`}>
                  {left < array.length && (
                    <line
                      x1={pCoords.x}
                      y1={pCoords.y}
                      x2={getTreeCoords(left).x}
                      y2={getTreeCoords(left).y}
                      stroke={left >= heapSize ? '#334155' : '#475569'}
                      strokeWidth={2}
                      strokeDasharray={left >= heapSize ? '4 4' : 'none'}
                    />
                  )}
                  {right < array.length && (
                    <line
                      x1={pCoords.x}
                      y1={pCoords.y}
                      x2={getTreeCoords(right).x}
                      y2={getTreeCoords(right).y}
                      stroke={right >= heapSize ? '#334155' : '#475569'}
                      strokeWidth={2}
                      strokeDasharray={right >= heapSize ? '4 4' : 'none'}
                    />
                  )}
                </g>
              );
            })}

            {/* Tree Nodes */}
            {array.map((val, idx) => {
              const coords = getTreeCoords(idx);
              const isSorted = sortedIndices.includes(idx);
              const isSwapping = swapIndices && (swapIndices[0] === idx || swapIndices[1] === idx);
              const isLargest = largestIdx === idx;
              const isRoot = rootIdx === idx;
              const isActive = activeIndices.includes(idx);

              let fillColor = '#1e293b';
              let strokeColor = '#475569';
              let textColor = '#cbd5e1';

              if (isSorted) {
                fillColor = '#064e3b';
                strokeColor = '#10b981';
                textColor = '#6ee7b7';
              } else if (isSwapping) {
                fillColor = '#581c87';
                strokeColor = '#c084fc';
                textColor = '#f3e8ff';
              } else if (isLargest) {
                fillColor = '#78350f';
                strokeColor = '#fbbf24';
                textColor = '#fef3c7';
              } else if (isRoot) {
                fillColor = '#0e7490';
                strokeColor = '#22d3ee';
                textColor = '#cffafe';
              } else if (isActive) {
                fillColor = '#1e3a8a';
                strokeColor = '#38bdf8';
                textColor = '#e0f2fe';
              }

              return (
                <g key={`node-${idx}`} className="transition-all duration-300">
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={18}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isSwapping || isRoot || isLargest ? 3 : 1.5}
                    className={isSwapping ? 'animate-pulse' : ''}
                  />
                  <text
                    x={coords.x}
                    y={coords.y + 5}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize={13}
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {val}
                  </text>
                  <text
                    x={coords.x}
                    y={coords.y - 22}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize={10}
                    fontFamily="monospace"
                  >
                    [{idx}]
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
