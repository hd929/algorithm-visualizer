import React from 'react';
import { KruskalSnapshot } from '../../types/kruskal';
import { Sparkles, GitMerge, Check, X, ShieldAlert } from 'lucide-react';

interface KruskalVisualizerProps {
  snapshot: KruskalSnapshot;
}

export const KruskalVisualizer: React.FC<KruskalVisualizerProps> = ({ snapshot }) => {
  const {
    nodes,
    edges,
    sortedEdges,
    currentEdgeIndex,
    mstEdges,
    mstTotalWeight,
    numComponents,
  } = snapshot;

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Top Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dark-850/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400">Tổng Trọng Số MST:</span>
            <span className="px-3 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-sm shadow-glow-emerald">
              {mstTotalWeight}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Cạnh MST đã chọn:</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-xs">
              {mstEdges.length} / {nodes.length - 1}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Số Cụm (Components):</span>
          <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono font-bold text-xs">
            {numComponents}
          </span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 min-h-0 bg-dark-900/90 rounded-2xl border border-slate-800/80 relative overflow-hidden flex items-center justify-center p-2">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px)',
            backgroundSize: '24px 24px' 
          }}
        />

        {/* SVG Graph View */}
        <div className="w-full h-full relative flex items-center justify-center">
          <svg viewBox="0 0 540 360" className="w-full h-full max-h-[380px]">
            {/* Render Edges */}
            {edges.map((edge) => {
              const uNode = nodes[edge.u];
              const vNode = nodes[edge.v];
              if (!uNode || !vNode) return null;

              let strokeColor = '#334155';
              let strokeWidth = 2;
              let isDashed = false;

              if (edge.state === 'accepted') {
                strokeColor = '#10b981'; // emerald
                strokeWidth = 3.5;
              } else if (edge.state === 'rejected') {
                strokeColor = '#f43f5e'; // rose
                strokeWidth = 2;
                isDashed = true;
              } else if (edge.state === 'checking') {
                strokeColor = '#f59e0b'; // amber
                strokeWidth = 3;
                isDashed = true;
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
                    strokeDasharray={isDashed ? '6 4' : undefined}
                    className={edge.state === 'checking' ? 'animate-pulse' : 'transition-all duration-300'}
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
                      fill={edge.state === 'accepted' ? '#10b981' : edge.state === 'rejected' ? '#f43f5e' : '#94a3b8'}
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
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="transition-all duration-300"
                >
                  {/* Outer circle with cluster color */}
                  <circle
                    r={20}
                    fill="#0f172a"
                    stroke={node.color}
                    strokeWidth={2.5}
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

                  {/* Parent pointer tag */}
                  <text
                    y={28}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="10"
                    className="font-mono select-none"
                  >
                    root: {node.parent}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Sorted Edge List Table */}
      <div className="bg-dark-850/80 p-3 rounded-2xl border border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <GitMerge className="w-3.5 h-3.5 text-cyan-400" />
            <span>Danh Sách Cạnh Đã Sắp Xếp (Greedy Queue):</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Duyệt từ nhỏ đến lớn
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {sortedEdges.map((edge, idx) => {
            const isCurrent = currentEdgeIndex === idx;

            let badgeClass = 'bg-dark-900 border-slate-800 text-slate-400';
            let icon = null;

            if (edge.state === 'accepted') {
              badgeClass = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-glow-emerald';
              icon = <Check className="w-3 h-3" />;
            } else if (edge.state === 'rejected') {
              badgeClass = 'bg-rose-500/15 border-rose-500/30 text-rose-400 line-through opacity-60';
              icon = <X className="w-3 h-3" />;
            } else if (isCurrent || edge.state === 'checking') {
              badgeClass = 'bg-amber-500/20 border-amber-500/40 text-amber-300 ring-1 ring-amber-400/50';
            }

            return (
              <div
                key={edge.id}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 shrink-0 border transition-all ${badgeClass}`}
              >
                <span>({edge.u}-{edge.v})</span>
                <span className="font-bold px-1 rounded bg-black/40">w={edge.weight}</span>
                {icon}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
