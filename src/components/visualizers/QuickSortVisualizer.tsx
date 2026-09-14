import React from 'react';
import { QuickSortSnapshot } from '../../types/quickSort';
import { RefreshCw, ArrowDownUp, CheckCircle2 } from 'lucide-react';

interface QuickSortVisualizerProps {
  snapshot: QuickSortSnapshot;
  onGenerateRandomArray?: () => void;
}

export const QuickSortVisualizer: React.FC<QuickSortVisualizerProps> = ({
  snapshot,
  onGenerateRandomArray,
}) => {
  const {
    array,
    pivotIndex,
    low,
    high,
    i,
    j,
    swappedIndices,
    sortedIndices,
    partitionRange,
    logMessage,
  } = snapshot;

  const maxVal = Math.max(...array, 1);

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dark-850/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Phân hoạch hiện tại:</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-xs">
              [{partitionRange[0]} ... {partitionRange[1]}]
            </span>
          </div>

          {pivotIndex !== null && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Pivot:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs">
                arr[{pivotIndex}] = {array[pivotIndex]}
              </span>
            </div>
          )}
        </div>

        {onGenerateRandomArray && (
          <button
            onClick={onGenerateRandomArray}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Mảng ngẫu nhiên</span>
          </button>
        )}
      </div>

      {/* Main Bar Stage */}
      <div className="flex-1 min-h-[380px] bg-dark-900/90 rounded-2xl border border-slate-800/80 relative overflow-x-auto flex flex-col justify-end p-6 select-none">
        {/* Top Indicators */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-xl bg-dark-850/90 border border-slate-700/80 text-xs font-mono text-cyan-300 shadow-lg">
            {logMessage}
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              i: {i !== null ? i : '-'}
            </span>
            <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
              j: {j !== null ? j : '-'}
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Pivot: {pivotIndex !== null ? array[pivotIndex] : '-'}
            </span>
          </div>
        </div>

        {/* Bars Container */}
        <div className="flex items-end justify-center gap-2 md:gap-3 w-full h-[260px] pb-10">
          {array.map((val, idx) => {
            const isPivot = pivotIndex === idx;
            const isI = i === idx;
            const isJ = j === idx;
            const isSorted = sortedIndices.includes(idx);
            const isSwapped = swappedIndices && (swappedIndices[0] === idx || swappedIndices[1] === idx);
            const inRange = idx >= partitionRange[0] && idx <= partitionRange[1];

            const heightPercent = Math.max(25, Math.round((val / maxVal) * 75) + 10);

            let barBg = 'bg-slate-800 border-slate-700 text-slate-300';
            if (isSorted) {
              barBg = 'bg-emerald-500/30 border-emerald-400 text-emerald-200 shadow-glow-emerald';
            } else if (isPivot) {
              barBg = 'bg-amber-500/30 border-amber-400 text-amber-200 ring-2 ring-amber-400/60 shadow-lg';
            } else if (isSwapped) {
              barBg = 'bg-purple-500/40 border-purple-400 text-purple-100 animate-pulse';
            } else if (isI || isJ) {
              barBg = 'bg-cyan-500/30 border-cyan-400 text-cyan-200';
            } else if (!inRange) {
              barBg = 'bg-slate-900/60 border-slate-800 text-slate-600 opacity-30';
            }

            return (
              <div
                key={idx}
                className="flex-1 max-w-[56px] min-w-[32px] flex flex-col items-center relative group"
              >
                {/* Pointer tags */}
                <div className="absolute -top-12 flex flex-col items-center pointer-events-none gap-0.5">
                  {isPivot && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-dark-900 shadow-md">
                      PIVOT
                    </span>
                  )}
                  {isI && !isPivot && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500 text-dark-900 shadow-md">
                      i
                    </span>
                  )}
                  {isJ && !isPivot && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500 text-dark-900 shadow-md">
                      j
                    </span>
                  )}
                  {isSorted && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-dark-900 shadow-md">
                      ✓
                    </span>
                  )}

                  {(isPivot || isI || isJ) && (
                    <div
                      className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] ${
                        isPivot ? 'border-t-amber-400' : isI ? 'border-t-cyan-400' : 'border-t-sky-400'
                      }`}
                    />
                  )}
                </div>

                {/* The Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-xl border flex flex-col items-center justify-between p-1.5 transition-all duration-300 ${barBg}`}
                >
                  <span className="font-mono font-bold text-xs md:text-sm">
                    {val}
                  </span>
                </div>

                {/* Index label below */}
                <div className="mt-2 text-center">
                  <span
                    className={`font-mono text-[11px] ${
                      isPivot
                        ? 'text-amber-400 font-bold'
                        : isI || isJ
                        ? 'text-cyan-400 font-bold'
                        : isSorted
                        ? 'text-emerald-400 font-medium'
                        : 'text-slate-500'
                    }`}
                  >
                    [{idx}]
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
