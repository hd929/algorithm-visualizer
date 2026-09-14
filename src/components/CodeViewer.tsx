import React, { useEffect, useRef } from 'react';
import { Code2 } from 'lucide-react';

interface CodeViewerProps {
  title: string;
  lines: string[];
  activeLine: number;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  title,
  lines,
  activeLine,
}) => {
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll ONLY inside the code container, never scroll the whole window
  useEffect(() => {
    if (activeLine > 0 && activeLine <= lines.length) {
      const el = lineRefs.current[activeLine - 1];
      const container = scrollContainerRef.current;
      if (el && container) {
        const targetScrollTop = el.offsetTop - container.offsetTop - container.clientHeight / 2 + el.clientHeight / 2;
        container.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: 'smooth',
        });
      }
    }
  }, [activeLine, lines.length]);

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 flex flex-col h-full overflow-hidden shadow-xl">
      {/* Code Header */}
      <div className="h-11 px-4 bg-dark-850 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">{title}</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            Dòng {activeLine}/{lines.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Live Sync</span>
          </div>
          <div className="flex gap-1.5 ml-1">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-500/80"></div>
          </div>
        </div>
      </div>

      {/* Code Lines List */}
      <div 
        ref={scrollContainerRef}
        className="p-3 overflow-y-auto flex-1 font-mono text-xs leading-6 select-none bg-dark-900/60"
      >
        {lines.map((line, idx) => {
          const lineNumber = idx + 1;
          const isActive = lineNumber === activeLine;

          return (
            <div
              key={idx}
              ref={(el) => {
                lineRefs.current[idx] = el;
              }}
              className={`flex items-center py-0.5 px-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-cyan-500/25 text-cyan-100 border-l-4 border-cyan-400 font-semibold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
              }`}
            >
              {/* Line number */}
              <span className={`w-8 text-right pr-3 select-none text-[11px] font-mono ${isActive ? 'text-cyan-400 font-bold' : 'text-slate-600'}`}>
                {lineNumber}
              </span>

              {/* Indicator arrow */}
              <span className="w-3 text-cyan-400 text-[10px] shrink-0">
                {isActive ? '▶' : ''}
              </span>

              {/* Code text */}
              <span className="whitespace-pre flex-1 pl-1">
                {line}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
