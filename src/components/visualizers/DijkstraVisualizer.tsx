import React from 'react';
import { DijkstraSnapshot } from '../../types/dijkstra';
import { Layers, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

interface DijkstraVisualizerProps {
  snapshot: DijkstraSnapshot;
  onSelectSource?: (source: number) => void;
}

export const DijkstraVisualizer: React.FC<DijkstraVisualizerProps> = ({
  snapshot,
  onSelectSource,
}) => {
  const {
    nodes,
    edges,
    pq,
    currentNode,
    activeEdge,
    sourceNode,
    dist,
    visited,
    logMessage,
  } = snapshot;

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Top Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dark-850/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Đỉnh nguồn (Source):</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-xs">
              Đỉnh {sourceNode}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500">Đổi nguồn:</span>
            {nodes.map((node) => (
              <button
                key={node.id}
                onClick={() => onSelectSource && onSelectSource(node.id)}
                className={`w-6 h-6 rounded-md font-mono text-xs transition-all ${
                  node.id === sourceNode
                    ? 'bg-cyan-500 text-dark-900 font-bold'
                    : 'bg-dark-900 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                {node.id}
              </button>
            ))}
          </div>
        </div>

        {/* Current Node Badge */}
        {currentNode !== null && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Đang xét:</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs animate-pulse">
              Đỉnh {currentNode}
            </span>
          </div>
        )}
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 min-h-0 bg-dark-900/90 rounded-2xl border border-slate-800/80 relative overflow-hidden flex items-center justify-center p-2">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.4) 1px, transparent 1px)',
            backgroundSize: '24px 24px' 
          }}
        />

        {/* SVG Graph View */}
        <div className="w-full h-full relative flex items-center justify-center">
          <svg viewBox="0 0 580 360" className="w-full h-full max-h-[380px]">
            <defs>
              <marker
                id="arrowhead-idle"
                markerWidth="8"
                markerHeight="6"
                refX="23"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#475569" />
              </marker>
              <marker
                id="arrowhead-exploring"
                markerWidth="8"
                markerHeight="6"
                refX="23"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
              </marker>
              <marker
                id="arrowhead-relaxed"
                markerWidth="8"
                markerHeight="6"
                refX="23"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#06b6d4" />
              </marker>
              <marker
                id="arrowhead-tree"
                markerWidth="8"
                markerHeight="6"
                refX="23"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
              </marker>
            </defs>

            {/* Render Edges */}
            {edges.map((edge) => {
              const uNode = nodes[edge.u];
              const vNode = nodes[edge.v];
              if (!uNode || !vNode) return null;

              const isEdgeActive = activeEdge === edge.id;
              let strokeColor = '#334155';
              let strokeWidth = 2;
              let marker = 'url(#arrowhead-idle)';

              if (edge.state === 'tree') {
                strokeColor = '#10b981';
                strokeWidth = 3.5;
                marker = 'url(#arrowhead-tree)';
              } else if (edge.state === 'relaxed') {
                strokeColor = '#06b6d4';
                strokeWidth = 3;
                marker = 'url(#arrowhead-relaxed)';
              } else if (isEdgeActive || edge.state === 'exploring') {
                strokeColor = '#f59e0b';
                strokeWidth = 3;
                marker = 'url(#arrowhead-exploring)';
              }

              const midX = (uNode.x + vNode.x) / 2;
              const midY = (uNode.y + vNode.y) / 2;

              return (
                <g key={edge.id}>
                  <line
                    x1={uNode.x}
                    y1={uNode.y}
                    x2={vNode.x}
                    y2={vNode.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    markerEnd={marker}
                    className="transition-all duration-300"
                  />
                  {/* Weight label box */}
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x={-12}
                      y={-10}
                      width={24}
                      height={20}
                      rx={5}
                      fill="#0f172a"
                      stroke={strokeColor}
                      strokeWidth={1}
                    />
                    <text
                      textAnchor="middle"
                      dy="0.3em"
                      fill={isEdgeActive ? '#f59e0b' : '#94a3b8'}
                      fontSize="11"
                      fontWeight="bold"
                      className="font-mono select-none"
                    >
                      {edge.weight}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Render Nodes */}
            {nodes.map((node) => {
              const isCurrent = currentNode === node.id;
              const isSource = sourceNode === node.id;
              const isFinalized = visited[node.id];
              const nodeDist = dist[node.id];

              let nodeColor = '#38bdf8'; // cyan
              if (isSource) nodeColor = '#38bdf8';
              if (isFinalized) nodeColor = '#10b981'; // emerald
              if (isCurrent) nodeColor = '#f59e0b'; // amber

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="transition-all duration-300 cursor-pointer"
                >
                  {/* Outer pulse */}
                  {isCurrent && (
                    <circle
                      r={28}
                      fill="none"
                      stroke={nodeColor}
                      strokeWidth={2}
                      className="animate-ping opacity-50"
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r={20}
                    fill="#0f172a"
                    stroke={nodeColor}
                    strokeWidth={isCurrent ? 3 : 2}
                  />

                  {/* Node ID */}
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

                  {/* Distance badge above */}
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
                      fontSize="10"
                      fontWeight="bold"
                      className="font-mono select-none"
                    >
                      {nodeDist === 999 ? '∞' : nodeDist}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Real-time Priority Queue (Min-Heap) & Distance Array */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Min-Heap Priority Queue Card */}
        <div className="bg-dark-850/80 p-3 rounded-2xl border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Priority Queue (Min-Heap):</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {pq.length} phần tử
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 min-h-[36px]">
            {pq.length === 0 ? (
              <span className="text-xs text-slate-500 italic font-mono">
                [Hàng đợi rỗng]
              </span>
            ) : (
              pq.map((item, idx) => (
                <div
                  key={idx}
                  className={`px-2.5 py-1 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 shrink-0 border ${
                    idx === 0
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                      : 'bg-dark-900 text-slate-300 border-slate-800'
                  }`}
                >
                  <span className="text-[10px] text-slate-500">#{idx + 1}</span>
                  <span>Đỉnh {item.node}</span>
                  <span className="text-cyan-400 font-bold">({item.dist})</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Distance Array Table */}
        <div className="bg-dark-850/80 p-3 rounded-2xl border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
            <span className="text-xs font-semibold text-slate-300">
              Mảng Khoảng Cách dist[i]:
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {visited.filter(Boolean).length}/{nodes.length} chốt xong
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1.5">
            {nodes.map((n) => (
              <div
                key={n.id}
                className={`p-1.5 rounded-lg text-center font-mono border ${
                  visited[n.id]
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-dark-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-[9px] text-slate-500">[{n.id}]</div>
                <div className="text-xs font-bold">
                  {dist[n.id] === 999 ? '∞' : dist[n.id]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
