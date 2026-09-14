import React from 'react';
import { BFSSnapshot } from '../../types/bfs';
import { Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

interface BFSVisualizerProps {
  snapshot: BFSSnapshot;
  onSelectStartNode?: (nodeId: number) => void;
}

export const BFSVisualizer: React.FC<BFSVisualizerProps> = ({
  snapshot,
  onSelectStartNode,
}) => {
  const { nodes, edges, queue, currentNode, visitedOrder, logMessage } = snapshot;

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Top Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dark-850/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Đỉnh bắt đầu:</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-xs">
              Đỉnh 0
            </span>
          </div>

          {currentNode !== null && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Đang xét:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs animate-pulse">
                Đỉnh {currentNode} (Level {nodes[currentNode].level})
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Đã duyệt:</span>
          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-xs">
            {visitedOrder.length} / {nodes.length}
          </span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 min-h-0 bg-dark-900/90 rounded-2xl border border-slate-800/80 relative overflow-hidden flex items-center justify-center p-2">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.3) 1px, transparent 1px)',
            backgroundSize: '24px 24px' 
          }}
        />

        {/* SVG Graph View */}
        <div className="w-full h-full relative flex items-center justify-center">
          <svg viewBox="0 0 580 360" className="w-full h-full max-h-[380px]">
            {/* Render Edges */}
            {edges.map((edge) => {
              const uNode = nodes[edge.u];
              const vNode = nodes[edge.v];
              if (!uNode || !vNode) return null;

              let strokeColor = '#334155';
              let strokeWidth = 2;
              let isDashed = false;

              if (edge.state === 'tree') {
                strokeColor = '#10b981'; // emerald tree edge
                strokeWidth = 3.5;
              } else if (edge.state === 'cross') {
                strokeColor = '#475569';
                strokeWidth = 1.5;
                isDashed = true;
              }

              return (
                <line
                  key={edge.id}
                  x1={uNode.x}
                  y1={uNode.y}
                  x2={vNode.x}
                  y2={vNode.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={isDashed ? '4 4' : undefined}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Render Nodes */}
            {nodes.map((node) => {
              const isCurrent = currentNode === node.id;
              const inQueue = queue.includes(node.id);
              const isVisited = node.visited;

              let nodeColor = '#64748b'; // unvisited slate
              if (isVisited) nodeColor = '#10b981'; // emerald
              if (inQueue) nodeColor = '#38bdf8'; // cyan
              if (isCurrent) nodeColor = '#f59e0b'; // amber

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="transition-all duration-300 cursor-pointer"
                >
                  {isCurrent && (
                    <circle
                      r={28}
                      fill="none"
                      stroke={nodeColor}
                      strokeWidth={2}
                      className="animate-ping opacity-50"
                    />
                  )}

                  <circle
                    r={20}
                    fill="#0f172a"
                    stroke={nodeColor}
                    strokeWidth={isCurrent ? 3 : 2}
                  />

                  <text
                    textAnchor="middle"
                    dy="0.35em"
                    fill="#f8fafc"
                    fontSize="13"
                    fontWeight="bold"
                    className="font-mono select-none"
                  >
                    {node.id}
                  </text>

                  {/* Level Tag above */}
                  {node.level >= 0 && (
                    <g transform="translate(0, -28)">
                      <rect
                        x={-18}
                        y={-9}
                        width={36}
                        height={16}
                        rx={6}
                        fill="#0f172a"
                        stroke={nodeColor}
                        strokeWidth={1}
                      />
                      <text
                        textAnchor="middle"
                        dy="0.3em"
                        fill={nodeColor}
                        fontSize="9"
                        fontWeight="bold"
                        className="font-mono select-none"
                      >
                        Lvl {node.level}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Live FIFO Queue Bar & Visited Order */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Queue Display */}
        <div className="bg-dark-850/80 p-3 rounded-2xl border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hàng Đợi Queue (FIFO):</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {queue.length} phần tử
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 min-h-[36px]">
            {queue.length === 0 ? (
              <span className="text-xs text-slate-500 italic font-mono">
                [Hàng đợi rỗng]
              </span>
            ) : (
              queue.map((item, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 shrink-0 border ${
                    idx === 0
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm ring-1 ring-amber-400/40'
                      : 'bg-dark-900 text-slate-300 border-slate-800'
                  }`}
                >
                  {idx === 0 && <span className="text-[9px] font-bold text-amber-400 uppercase">Front ➔</span>}
                  <span>Đỉnh {item}</span>
                  {idx === queue.length - 1 && queue.length > 1 && (
                    <span className="text-[9px] text-slate-500 uppercase">➔ Back</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Visited Sequence */}
        <div className="bg-dark-850/80 p-3 rounded-2xl border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Thứ Tự Đã Duyệt (Visited Order):</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {visitedOrder.length} đỉnh
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1 min-h-[36px] font-mono text-xs">
            {visitedOrder.map((nodeId, idx) => (
              <React.Fragment key={nodeId}>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {nodeId}
                </span>
                {idx < visitedOrder.length - 1 && (
                  <span className="text-slate-600">➔</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
