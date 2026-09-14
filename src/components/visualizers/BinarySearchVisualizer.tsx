import React, { useState } from 'react';
import { Binary, Search, RefreshCw, Target } from 'lucide-react';
import { BinarySearchSnapshot } from '../../types/binarySearch';

interface BinarySearchVisualizerProps {
  snapshot: BinarySearchSnapshot;
  onSetNewTarget?: (target: number) => void;
  onGenerateRandomArray?: () => void;
}

export const BinarySearchVisualizer: React.FC<BinarySearchVisualizerProps> = ({
  snapshot,
  onSetNewTarget,
  onGenerateRandomArray,
}) => {
  const {
    array,
    target,
    low,
    high,
    mid,
    foundIndex,
    eliminatedIndices,
    comparisonText,
  } = snapshot;

  const [inputTarget, setInputTarget] = useState<string>(String(target));

  const handleTargetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(inputTarget, 10);
    if (!isNaN(val) && onSetNewTarget) {
      onSetNewTarget(val);
    }
  };

  // Find max value for bar height normalization
  const maxVal = Math.max(...array, 1);

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dark-850/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-300 font-medium">Mục tiêu (Target):</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-sm">
              {target}
            </span>
          </div>

          <form onSubmit={handleTargetSubmit} className="flex items-center gap-1.5">
            <input
              type="number"
              value={inputTarget}
              onChange={(e) => setInputTarget(e.target.value)}
              className="w-16 h-8 text-center bg-dark-900 border border-slate-700 rounded-lg text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              placeholder="Target"
            />
            <button
              type="submit"
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-all"
            >
              Đặt Target
            </button>
          </form>
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

      {/* Main Visual Array Stage */}
      <div className="flex-1 min-h-[380px] bg-dark-900/90 rounded-2xl border border-slate-800/80 relative overflow-x-auto flex flex-col justify-end p-6 select-none">
        {/* Comparison banner at top of stage */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-xl bg-dark-850/90 border border-slate-700/80 text-xs font-mono text-cyan-300 shadow-lg">
            {comparisonText}
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              Low: {low}
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Mid: {mid >= 0 ? mid : '-'}
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
              High: {high}
            </span>
          </div>
        </div>

        {/* Array Bars & Cards */}
        <div className="flex items-end justify-center gap-2 md:gap-3 w-full h-[260px] pb-10">
          {array.map((value, idx) => {
            const isLow = idx === low;
            const isMid = idx === mid;
            const isHigh = idx === high;
            const isEliminated = eliminatedIndices.includes(idx);
            const isFound = foundIndex === idx;

            // Height percentage based on value (between 25% and 85%)
            const heightPercent = Math.max(25, Math.round((value / maxVal) * 75) + 10);

            // Determine bar style
            let barBg = 'bg-slate-800 border-slate-700 text-slate-300';
            if (isFound) {
              barBg = 'bg-emerald-500/40 border-emerald-400 text-emerald-100 shadow-glow-emerald animate-bounce';
            } else if (isMid) {
              barBg = 'bg-amber-500/30 border-amber-400 text-amber-200 shadow-lg ring-2 ring-amber-400/50';
            } else if (isLow || isHigh) {
              barBg = 'bg-cyan-500/20 border-cyan-400/60 text-cyan-200';
            } else if (isEliminated) {
              barBg = 'bg-slate-900/60 border-slate-800 text-slate-600 opacity-25';
            }

            return (
              <div
                key={idx}
                className="flex-1 max-w-[56px] min-w-[32px] flex flex-col items-center relative group"
              >
                {/* Pointer tags above the element */}
                <div className="absolute -top-12 flex flex-col items-center pointer-events-none gap-0.5">
                  {isFound && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-dark-900 shadow-md">
                      🎯 MATCH
                    </span>
                  )}
                  {isMid && !isFound && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-dark-900 shadow-md">
                      MID
                    </span>
                  )}
                  {isLow && !isMid && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500 text-dark-900 shadow-md">
                      LOW
                    </span>
                  )}
                  {isHigh && !isMid && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500 text-dark-900 shadow-md">
                      HIGH
                    </span>
                  )}

                  {/* Indicator Arrow */}
                  {(isLow || isMid || isHigh || isFound) && (
                    <div
                      className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] ${
                        isFound
                          ? 'border-t-emerald-400'
                          : isMid
                          ? 'border-t-amber-400'
                          : isLow
                          ? 'border-t-cyan-400'
                          : 'border-t-rose-400'
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
                    {value}
                  </span>
                </div>

                {/* Index label below */}
                <div className="mt-2 text-center">
                  <span
                    className={`font-mono text-[11px] ${
                      isMid
                        ? 'text-amber-400 font-bold'
                        : isLow || isHigh
                        ? 'text-cyan-400 font-bold'
                        : isEliminated
                        ? 'text-slate-700 line-through'
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
