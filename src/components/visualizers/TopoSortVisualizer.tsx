import React from 'react';
import { TopoSortSnapshot } from '../../types/topoSort';
import { ArrowRight, Workflow, Layers, CheckCircle } from 'lucide-react';

interface TopoSortVisualizerProps {
  snapshot: TopoSortSnapshot;
}

export const TopoSortVisualizer: React.FC<TopoSortVisualizerProps> = ({ snapshot }) => {
  const { nodes, edges, queue, topoOrder, currentNode, phase } = snapshot;

  return (
    <div className="flex flex-col h-full gap-3 overflow-hidden">
      {/* Top Header: Queue & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dark-850/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Hàng Đợi (Queue):</span>
            <div className="flex items-center gap-1 bg-dark-900 px-2 py-1 rounded-xl border border-slate-800 min-h-[28px]">
              {queue.length === 0 ? (
                <span className="text-[11px] font-mono text-slate-500 italic px-1">Rỗng</span>
              ) : (
                queue.map((nodeId, idx) => (
                  <span
                    key={`${nodeId}-${idx}`}
                    className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold border ${
                      idx === 0
                        ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    [{nodeId}]
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-dark-900 border border-slate-800 text-slate-300">
              Đang xét: <span className="text-cyan-400 font-bold">{currentNode !== null ? `Đỉnh [${currentNode}]` : '—'}</span>
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500/30 border border-cyan-400 inline-block"></span>
            <span>In-Degree = 0</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Đã sắp xếp</span>
          </span>
        </div>
      </div>

      {/* Main DAG Graph */}
      <div className="flex-1 min-h-[380px] bg-dark-900/90 rounded-2xl border border-slate-800/80 flex flex-col justify-between p-4 relative overflow-hidden select-none">
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 540 320" className="w-full h-full max-h-[300px]">
            <defs>
              <marker
                id="topo-arrow"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
              </marker>
              <marker
                id="topo-arrow-dim"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" />
              </marker>
            </defs>

            {/* Directed Edges */}
            {edges.map((e, idx) => {
              const fromNode = nodes.find((n) => n.id === e.from);
              const toNode = nodes.find((n) => n.id === e.to);
              if (!fromNode || !toNode) return null;

              const isEdgeActive = e.active;
              const isRemoved = e.removed;

              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isEdgeActive ? '#38bdf8' : isRemoved ? '#334155' : '#64748b'}
                    strokeWidth={isEdgeActive ? 3 : isRemoved ? 1.5 : 2}
                    strokeDasharray={isRemoved ? '4 4' : 'none'}
                    markerEnd={isRemoved ? 'url(#topo-arrow-dim)' : 'url(#topo-arrow)'}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}

            {/* Graph Nodes */}
            {nodes.map((n) => {
              const isCurrent = currentNode === n.id;
              const isProcessed = topoOrder.includes(n.id);
              const inQueue = queue.includes(n.id);
              const isZero = n.inDegree === 0;

              let fillColor = '#1e293b';
              let strokeColor = '#475569';
              let textColor = '#cbd5e1';

              if (isCurrent) {
                fillColor = '#0e7490';
                strokeColor = '#22d3ee';
                textColor = '#ffffff';
              } else if (isProcessed) {
                fillColor = '#064e3b';
                strokeColor = '#10b981';
                textColor = '#a7f3d0';
              } else if (inQueue || isZero) {
                fillColor = '#0c4a6e';
                strokeColor = '#38bdf8';
                textColor = '#e0f2fe';
              }

              return (
                <g key={`node-${n.id}`} className="transition-all duration-300">
                  {/* Node Circle */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={20}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isCurrent || inQueue ? 2.5 : 1.5}
                    className={isCurrent ? 'shadow-glow-cyan' : ''}
                  />

                  {/* Node Label */}
                  <text
                    x={n.x}
                    y={n.y + 5}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize={13}
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {n.label}
                  </text>

                  {/* In-Degree Badge */}
                  <g transform={`translate(${n.x + 10}, ${n.y - 18})`}>
                    <rect
                      x={-2}
                      y={-2}
                      width={18}
                      height={16}
                      rx={6}
                      fill={n.inDegree === 0 ? '#0284c7' : '#334155'}
                      stroke={n.inDegree === 0 ? '#38bdf8' : '#475569'}
                      strokeWidth={1}
                    />
                    <text
                      x={7}
                      y={10}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={9}
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {n.inDegree}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Bottom Output Topo Sequence */}
        <div className="p-3 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-300">Thứ tự Tô-pô đã duyệt (Result):</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {topoOrder.length === 0 ? (
              <span className="text-xs text-slate-500 italic">Chưa có đỉnh nào xuất ra</span>
            ) : (
              topoOrder.map((nodeId, idx) => (
                <React.Fragment key={nodeId}>
                  <div className="px-2.5 py-1 rounded-xl bg-cyan-500/20 border border-cyan-400/80 text-cyan-200 text-xs font-mono font-bold flex items-center gap-1 shadow-sm">
                    <span>Đỉnh [{nodeId}]</span>
                  </div>
                  {idx < topoOrder.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
