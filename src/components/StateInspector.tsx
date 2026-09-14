import React from 'react';
import { Activity } from 'lucide-react';

interface StateInspectorProps {
  variables: Record<string, string | number | boolean | null | undefined>;
}

export const StateInspector: React.FC<StateInspectorProps> = ({ variables }) => {
  const entries = Object.entries(variables);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800 shadow-xl flex flex-col gap-2.5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">Biến số & Trạng thái (Variables)</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Live Watch</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
        {entries.map(([key, val]) => (
          <div
            key={key}
            className="bg-dark-900/80 border border-slate-800/80 rounded-xl p-2.5 flex flex-col gap-1"
          >
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              {key}
            </span>
            <span className="font-mono text-xs font-semibold text-cyan-300 truncate">
              {val === null || val === undefined ? 'null' : String(val)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
