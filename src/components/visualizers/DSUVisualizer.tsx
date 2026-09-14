import React, { useState } from 'react';
import { Network, GitBranch, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { DSUSnapshot, DSUOperation } from '../../types/dsu';

interface DSUVisualizerProps {
  snapshot: DSUSnapshot;
  onRunCustomOperations?: (ops: DSUOperation[]) => void;
}

export const DSUVisualizer: React.FC<DSUVisualizerProps> = ({
  snapshot,
  onRunCustomOperations,
}) => {
  const [activeTab, setActiveTab] = useState<'network' | 'forest'>('network');
  const [inputU, setInputU] = useState<string>('0');
  const [inputV, setInputV] = useState<string>('1');

  const {
    nodes,
    edges,
    parent,
    rank,
    size,
    activeNodes,
    pathHighlighted,
    numComponents,
    logMessage,
  } = snapshot;

  const handleAddUnion = () => {
    const u = parseInt(inputU, 10);
    const v = parseInt(inputV, 10);
    if (!isNaN(u) && !isNaN(v) && u >= 0 && u < nodes.length && v >= 0 && v < nodes.length) {
      if (onRunCustomOperations) {
        onRunCustomOperations([{ type: 'UNION', u, v }]);
      }
    }
  };

  const handleAddFind = () => {
    const u = parseInt(inputU, 10);
    if (!isNaN(u) && u >= 0 && u < nodes.length) {
      if (onRunCustomOperations) {
        onRunCustomOperations([{ type: 'FIND', u }]);
      }
    }
  };

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Top Visualizer Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dark-850/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('network')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'network'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Mạng Lưới Cụm (Graph)</span>
          </button>
          <button
            onClick={() => setActiveTab('forest')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'forest'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-glow-purple'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>Rừng Cây DSU (Forest & Parent)</span>
          </button>
        </div>

        {/* Component Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Số Cụm (Components):</span>
          <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-xs">
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
            backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.4) 1px, transparent 1px)',
            backgroundSize: '24px 24px' 
          }}
        />

        {activeTab === 'network' ? (
          /* Graph Network View */
          <div className="w-full h-full relative flex items-center justify-center">
            <svg viewBox="0 0 520 380" className="w-full h-full max-h-[400px]">
              <defs>
                <filter id="glow-edge" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Render edges */}
              {edges.map((edge) => {
                const srcNode = nodes[edge.source];
                const tgtNode = nodes[edge.target];
                if (!srcNode || !tgtNode) return null;

                const isTesting = activeNodes.includes(edge.source) && activeNodes.includes(edge.target);

                return (
                  <line
                    key={edge.id}
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke={isTesting ? '#f59e0b' : srcNode.color}
                    strokeWidth={isTesting ? 4 : 2.5}
                    strokeOpacity={0.8}
                    filter={isTesting ? 'url(#glow-edge)' : undefined}
                    strokeDasharray={isTesting ? '6 4' : undefined}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Path Highlighted when finding root */}
              {pathHighlighted.length > 1 &&
                pathHighlighted.map((curr, idx) => {
                  if (idx === pathHighlighted.length - 1) return null;
                  const next = pathHighlighted[idx + 1];
                  const n1 = nodes[curr];
                  const n2 = nodes[next];
                  if (!n1 || !n2) return null;

                  return (
                    <line
                      key={`path-${curr}-${next}`}
                      x1={n1.x}
                      y1={n1.y}
                      x2={n2.x}
                      y2={n2.y}
                      stroke="#38bdf8"
                      strokeWidth={4}
                      strokeDasharray="4 4"
                      className="animate-pulse"
                    />
                  );
                })}

              {/* Render nodes */}
              {nodes.map((node) => {
                const isActive = activeNodes.includes(node.id);
                const isPath = pathHighlighted.includes(node.id);
                const isRoot = parent[node.id] === node.id;

                return (
                  <g 
                    key={node.id} 
                    transform={`translate(${node.x}, ${node.y})`}
                    className="transition-all duration-300 cursor-pointer"
                  >
                    {/* Pulsing ring on active */}
                    {(isActive || isPath) && (
                      <circle
                        r={28}
                        fill="none"
                        stroke={node.color}
                        strokeWidth={2}
                        className="animate-ping opacity-40"
                      />
                    )}

                    {/* Outer glow ring */}
                    <circle
                      r={21}
                      fill={node.color}
                      fillOpacity={0.15}
                      stroke={node.color}
                      strokeWidth={isActive ? 3 : 2}
                      className="transition-all"
                    />

                    {/* Inner Node Circle */}
                    <circle
                      r={17}
                      fill="#0f172a"
                      stroke={node.color}
                      strokeWidth={isActive ? 2.5 : 1.5}
                    />

                    {/* Node ID label */}
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

                    {/* Root crown / star indicator */}
                    {isRoot && (
                      <g transform="translate(0, -25)">
                        <rect
                          x={-18}
                          y={-9}
                          width={36}
                          height={14}
                          rx={7}
                          fill="#0f172a"
                          stroke={node.color}
                          strokeWidth={1}
                        />
                        <text
                          textAnchor="middle"
                          dy="0.25em"
                          fill={node.color}
                          fontSize="9"
                          fontWeight="bold"
                          className="font-mono select-none"
                        >
                          ROOT
                        </text>
                      </g>
                    )}

                    {/* Parent label below */}
                    <text
                      y={30}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="10"
                      className="font-mono select-none"
                    >
                      p={parent[node.id]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          /* Forest Tree Hierarchy View */
          <div className="w-full flex flex-col gap-4 max-w-[650px]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {nodes.map((node) => {
                const isRoot = parent[node.id] === node.id;
                const isActive = activeNodes.includes(node.id);

                return (
                  <div
                    key={node.id}
                    className={`p-3 rounded-xl border transition-all flex flex-col gap-2 ${
                      isActive
                        ? 'bg-cyan-500/10 border-cyan-400 shadow-glow-cyan'
                        : 'bg-dark-850/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: node.color }}
                        />
                        <span className="font-bold text-sm text-slate-100 font-mono">
                          Node {node.id}
                        </span>
                      </div>
                      {isRoot ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          ROOT
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                          ➔ {parent[node.id]}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] grid grid-cols-3 gap-1 pt-1 border-t border-slate-800/80 font-mono text-slate-400">
                      <div>
                        p: <span className="text-cyan-300">{parent[node.id]}</span>
                      </div>
                      <div>
                        rank: <span className="text-purple-300">{rank[node.id]}</span>
                      </div>
                      <div>
                        sz: <span className="text-emerald-300">{size[node.id]}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tree Pointers visual summary */}
            <div className="bg-dark-850/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed">
              <span className="text-cyan-400 font-semibold">Cấu trúc Parent Cây: </span>
              {nodes.map((n, i) => (
                <span key={n.id} className="mr-3">
                  [{n.id} ➔ {parent[n.id]}]
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Command Bar */}
      <div className="bg-dark-850/70 p-3 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">Tương tác trực tiếp:</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={0}
              max={nodes.length - 1}
              value={inputU}
              onChange={(e) => setInputU(e.target.value)}
              className="w-12 h-8 text-center bg-dark-900 border border-slate-700 rounded-lg text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              placeholder="u"
            />
            <span className="text-xs text-slate-500">và</span>
            <input
              type="number"
              min={0}
              max={nodes.length - 1}
              value={inputV}
              onChange={(e) => setInputV(e.target.value)}
              className="w-12 h-8 text-center bg-dark-900 border border-slate-700 rounded-lg text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
              placeholder="v"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddUnion}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-medium transition-all"
          >
            Chạy unite({inputU}, {inputV})
          </button>
          <button
            onClick={handleAddFind}
            className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-medium transition-all"
          >
            Chạy find({inputU})
          </button>
        </div>
      </div>
    </div>
  );
};
