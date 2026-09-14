import React from 'react';
import { MergeSortSnapshot } from '../../types/mergeSort';
import { RefreshCw, GitMerge } from 'lucide-react';

interface MergeSortVisualizerProps {
  snapshot: MergeSortSnapshot;
  onGenerateRandomArray?: () => void;
}

export const MergeSortVisualizer: React.FC<MergeSortVisualizerProps> = ({
  snapshot,
  onGenerateRandomArray,
}) => {
  const {
    array,
    tempArray,
    leftRange,
    rightRange,
    i,
    j,
    k,
    activeMergedRange,
    logMessage,
  } = snapshot;

  const maxVal = Math.max(...array, 1);

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dark-850/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Trạng thái:</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-xs">
              {leftRange && rightRange
                ? `Trộn [${leftRange[0]}..${leftRange[1]}] và [${rightRange[0]}..${rightRange[1]}]`
                : 'Đang chia nhỏ / hoàn tất'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            {i !== null && (
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                i: {i}
              </span>
            )}
            {j !== null && (
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                j: {j}
              </span>
            )}
            {k !== null && (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                k: {k}
              </span>
            )}
          </div>
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

      {/* Main Dual Stage (Main Array + Auxiliary Buffer) */}
      <div className="flex-1 min-h-[380px] bg-dark-900/90 rounded-2xl border border-slate-800/80 relative overflow-x-auto flex flex-col justify-between p-5 select-none gap-4">
        {/* Top: Main Array Bars */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-mono text-slate-400 font-semibold flex items-center gap-1.5">
            <span>Mảng Gốc arr[]:</span>
          </span>

          <div className="flex items-end justify-center gap-2 md:gap-3 w-full h-[150px] pb-2">
            {array.map((val, idx) => {
              const isI = i === idx;
              const isJ = j === idx;
              const inLeft = leftRange && idx >= leftRange[0] && idx <= leftRange[1];
              const inRight = rightRange && idx >= rightRange[0] && idx <= rightRange[1];
              const isMerged = activeMergedRange && idx >= activeMergedRange[0] && idx <= activeMergedRange[1];

              const heightPercent = Math.max(25, Math.round((val / maxVal) * 70) + 15);

              let barBg = 'bg-slate-800 border-slate-700 text-slate-300';
              if (isMerged) {
                barBg = 'bg-emerald-500/30 border-emerald-400 text-emerald-200 shadow-glow-emerald';
              } else if (isI) {
                barBg = 'bg-cyan-500/30 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/50';
              } else if (isJ) {
                barBg = 'bg-purple-500/30 border-purple-400 text-purple-200 ring-2 ring-purple-400/50';
              } else if (inLeft) {
                barBg = 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300';
              } else if (inRight) {
                barBg = 'bg-purple-500/15 border-purple-500/30 text-purple-300';
              }

              return (
                <div
                  key={idx}
                  className="flex-1 max-w-[50px] min-w-[28px] flex flex-col items-center relative group"
                >
                  {/* Pointer tag */}
                  <div className="absolute -top-7 flex flex-col items-center pointer-events-none">
                    {isI && <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500 text-dark-900">i</span>}
                    {isJ && <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500 text-dark-900">j</span>}
                  </div>

                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg border flex flex-col items-center justify-between p-1 transition-all duration-300 ${barBg}`}
                  >
                    <span className="font-mono font-bold text-xs">
                      {val}
                    </span>
                  </div>

                  <span className="mt-1 font-mono text-[10px] text-slate-500">
                    [{idx}]
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom: Auxiliary Buffer temp[] */}
        <div className="flex flex-col gap-1 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-amber-400 font-semibold flex items-center gap-1.5">
              <GitMerge className="w-3.5 h-3.5" />
              <span>Bộ Đệm Trộn temp[] (Auxiliary Buffer):</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Đổ vào mảng phụ rồi copy ngược lại
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 md:gap-3 w-full py-2">
            {tempArray.map((val, idx) => {
              const isK = k === idx;
              const hasVal = val !== null;

              return (
                <div
                  key={idx}
                  className={`flex-1 max-w-[50px] min-w-[28px] h-11 rounded-xl border flex flex-col items-center justify-center font-mono transition-all ${
                    isK
                      ? 'bg-amber-500/25 border-amber-400 text-amber-200 ring-2 ring-amber-400/40 shadow-sm'
                      : hasVal
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-dark-850/60 border-slate-800 text-slate-600'
                  }`}
                >
                  <span className="text-xs font-bold">
                    {hasVal ? val : '-'}
                  </span>
                  <span className="text-[9px] text-slate-500">
                    t[{idx}]
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
