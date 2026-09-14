import React from 'react';
import { BSTSnapshot } from '../../types/bst';
import { GitBranch, Sparkles } from 'lucide-react';

interface BSTVisualizerProps {
  snapshot: BSTSnapshot;
}

export const BSTVisualizer: React.FC<BSTVisualizerProps> = ({ snapshot }) => {
  const { nodes, insertingVal, comparingNodeId, inorderList, logMessage } = snapshot;

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Top Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dark-850/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Đang chèn:</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-xs">
              {insertingVal !== null ? insertingVal : 'Chờ...'}
            </span>
          </div>

          {comparingNodeId !== null && nodes[comparingNodeId] && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">So sánh với:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs animate-pulse">
                Node {nodes[comparingNodeId].val}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Tổng số Nodes:</span>
          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-xs">
            {nodes.length}
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

        {/* SVG Tree View */}
        <div className="w-full h-full relative flex items-center justify-center">
          <svg viewBox="0 0 560 380" className="w-full h-full max-h-[380px]">
            {/* Render Branches */}
            {nodes.map((node) => {
              const lines = [];

              if (node.left !== null && nodes[node.left]) {
                const leftChild = nodes[node.left];
                lines.push(
                  <line
                    key={`branch-left-${node.id}`}
                    x1={node.x}
                    y1={node.y}
                    x2={leftChild.x}
                    y2={leftChild.y}
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    className="transition-all duration-300"
                  />
                );
              }

              if (node.right !== null && nodes[node.right]) {
                const rightChild = nodes[node.right];
                lines.push(
                  <line
                    key={`branch-right-${node.id}`}
                    x1={node.x}
                    y1={node.y}
                    x2={rightChild.x}
                    y2={rightChild.y}
                    stroke="#a855f7"
                    strokeWidth={2.5}
                    className="transition-all duration-300"
                  />
                );
              }

              return <g key={`branches-${node.id}`}>{lines}</g>;
            })}

            {/* Render Nodes */}
            {nodes.map((node) => {
              const isComparing = comparingNodeId === node.id;
              const isNewlyInserted = node.state === 'inserted';

              let nodeColor = '#38bdf8'; // cyan
              if (isNewlyInserted) nodeColor = '#10b981'; // emerald
              if (isComparing) nodeColor = '#f59e0b'; // amber

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="transition-all duration-300 cursor-pointer"
                >
                  {isComparing && (
                    <circle
                      r={26}
                      fill="none"
                      stroke={nodeColor}
                      strokeWidth={2}
                      className="animate-ping opacity-50"
                    />
                  )}

                  <circle
                    r={19}
                    fill="#0f172a"
                    stroke={nodeColor}
                    strokeWidth={isComparing || isNewlyInserted ? 2.5 : 1.8}
                  />

                  <text
                    textAnchor="middle"
                    dy="0.35em"
                    fill="#f8fafc"
                    fontSize="12"
                    fontWeight="bold"
                    className="font-mono select-none"
                  >
                    {node.val}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* In-order Traversal Result Bar */}
      <div className="bg-dark-850/80 p-3 rounded-2xl border border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Duyệt Trung Thứ Tự (In-order Traversal ➔ Dãy Tăng Dần):</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Trái ➔ Gốc ➔ Phải
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1 min-h-[36px] font-mono text-xs">
          {inorderList.length === 0 ? (
            <span className="text-xs text-slate-500 italic">
              [Chưa hoàn tất cây]
            </span>
          ) : (
            inorderList.map((val, idx) => (
              <React.Fragment key={idx}>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
                  {val}
                </span>
                {idx < inorderList.length - 1 && (
                  <span className="text-slate-600">➔</span>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
