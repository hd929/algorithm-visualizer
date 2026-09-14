import React from 'react';
import { DFSSnapshot } from '../../types/dfs';
import { Layers, ArrowDown, CheckCircle2, RotateCcw } from 'lucide-react';

interface DFSVisualizerProps {
  snapshot: DFSSnapshot;
}

export const DFSVisualizer: React.FC<DFSVisualizerProps> = ({ snapshot }) => {
  const { nodes, edges, callStack, currentNode, visitedOrder, logMessage } = snapshot;

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
              <span className="text-xs text-slate-400">Đang ở Frame:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs animate-pulse">
                dfs({currentNode})
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Độ sâu Stack (Depth):</span>
          <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono font-bold text-xs">
            {callStack.length}
          </span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 min-h-0 bg-dark-900/90 rounded-2xl border border-slate-800/80 relative overflow-hidden flex items-center justify-center p-2">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px)',
            backgroundSize: '24px 24px' 
          }}
        />

        {/* SVG Graph View */}
        <div className="w-full h-full relative flex items-center justify-center">
          <svg viewBox="0 0 520 360" className="w-full h-full max-h-[380px]">
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
              } else if (edge.state === 'back') {
                strokeColor = '#a855f7'; // purple back edge (cycle)
                strokeWidth = 2;
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
              const inStack = callStack.includes(node.id);
              const isVisited = node.visited;

              let nodeColor = '#64748b'; // unvisited
              if (isVisited) nodeColor = '#10b981'; // emerald
              if (inStack) nodeColor = '#a855f7'; // purple stack
              if (isCurrent) nodeColor = '#f59e0b'; // amber active

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

                  {/* Backtracking flag */}
                  {node.isBacktracking && (
                    <text
                      y={28}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="9"
                      className="font-mono select-none"
                    >
                      ↩ done
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Live Call Stack & Visited Sequence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Call Stack Display */}
        <div className="bg-dark-850/80 p-3 rounded-2xl border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Ngăn Xếp Call Stack (LIFO):</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {callStack.length} frames
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 min-h-[36px]">
            {callStack.length === 0 ? (
              <span className="text-xs text-slate-500 italic font-mono">
                [Stack rỗng - Đã hoàn tất đệ quy]
              </span>
            ) : (
              callStack.map((item, idx) => {
                const isTop = idx === callStack.length - 1;
                return (
                  <div
                    key={idx}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 shrink-0 border ${
                      isTop
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm ring-1 ring-amber-400/50'
                        : 'bg-dark-900 text-purple-300 border-slate-800'
                    }`}
                  >
                    <span>dfs({item})</span>
                    {isTop && (
                      <span className="text-[9px] font-bold text-amber-400 uppercase bg-amber-500/10 px-1 rounded">
                        TOP
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Visited Sequence */}
        <div className="bg-dark-850/80 p-3 rounded-2xl border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Thứ Tự Duyệt DFS (Discovery Order):</span>
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
