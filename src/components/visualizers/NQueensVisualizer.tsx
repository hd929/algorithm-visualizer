import React from 'react';
import { NQueensSnapshot } from '../../types/nQueens';
import { Crown, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';

interface NQueensVisualizerProps {
  snapshot: NQueensSnapshot;
}

export const NQueensVisualizer: React.FC<NQueensVisualizerProps> = ({ snapshot }) => {
  const {
    n,
    queens,
    currentRow,
    currentCol,
    status,
    conflicts,
    solutionsFound,
    currentSolution,
  } = snapshot;

  const isQueenAt = (r: number, c: number) => {
    return queens.some((q) => q.row === r && q.col === c);
  };

  const isConflictAt = (r: number, c: number) => {
    return conflicts.some((q) => q.row === r && q.col === c);
  };

  const isTestingAt = (r: number, c: number) => {
    return currentRow === r && currentCol === c;
  };

  return (
    <div className="flex flex-col h-full gap-3 overflow-hidden">
      {/* Top Header Controls / Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-dark-850/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Trạng thái:</span>
            <span
              className={`px-2.5 py-0.5 rounded-lg border font-mono font-bold text-xs flex items-center gap-1.5 ${
                status === 'SOLUTION_FOUND'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-glow-emerald'
                  : status === 'CONFLICT'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-400'
                  : status === 'SAFE'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                  : status === 'BACKTRACK'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {status === 'SOLUTION_FOUND' && <CheckCircle2 className="w-3.5 h-3.5" />}
              {status === 'CONFLICT' && <AlertCircle className="w-3.5 h-3.5" />}
              {status === 'BACKTRACK' && <RotateCcw className="w-3.5 h-3.5" />}
              <span>{status}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-dark-900 border border-slate-800 text-slate-300">
              Hậu đã đặt: <span className="text-cyan-400 font-bold">{queens.length}/{n}</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-dark-900 border border-slate-800 text-slate-300">
              Tổng nghiệm: <span className="text-emerald-400 font-bold">{solutionsFound}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-cyan-500 inline-block"></span>
            <span>Hậu an toàn</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block"></span>
            <span>Chiếu xung đột</span>
          </span>
        </div>
      </div>

      {/* Main Chessboard View */}
      <div className="flex-1 min-h-[380px] bg-dark-900/90 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
        <div className="relative">
          {/* Row coordinate labels */}
          <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-around text-xs font-mono text-slate-500 font-bold">
            {Array.from({ length: n }).map((_, r) => (
              <span key={`r-lbl-${r}`}>R{r}</span>
            ))}
          </div>

          {/* Column coordinate labels */}
          <div className="absolute -top-7 left-0 right-0 flex justify-around text-xs font-mono text-slate-500 font-bold">
            {Array.from({ length: n }).map((_, c) => (
              <span key={`c-lbl-${c}`}>C{c}</span>
            ))}
          </div>

          {/* Chessboard Grid */}
          <div
            className="grid gap-1.5 p-2 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-2xl"
            style={{
              gridTemplateColumns: `repeat(${n}, minmax(64px, 76px))`,
              gridTemplateRows: `repeat(${n}, minmax(64px, 76px))`,
            }}
          >
            {Array.from({ length: n }).map((_, r) =>
              Array.from({ length: n }).map((_, c) => {
                const hasQueen = isQueenAt(r, c);
                const hasConflict = isConflictAt(r, c);
                const isTesting = isTestingAt(r, c);
                const isLightSquare = (r + c) % 2 === 0;

                let squareStyle = isLightSquare
                  ? 'bg-slate-850/80 text-slate-400'
                  : 'bg-dark-900 text-slate-500';

                if (hasConflict) {
                  squareStyle = 'bg-rose-500/20 border-rose-500/80 ring-2 ring-rose-500/40';
                } else if (isTesting) {
                  squareStyle = 'bg-amber-500/25 border-amber-400 ring-2 ring-amber-400/50 animate-pulse';
                } else if (hasQueen) {
                  squareStyle = 'bg-cyan-500/25 border-cyan-400 shadow-glow-cyan';
                }

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`rounded-xl border border-slate-800/80 flex flex-col items-center justify-center transition-all duration-300 relative ${squareStyle}`}
                  >
                    {hasQueen && (
                      <div className="flex flex-col items-center animate-in zoom-in-50 duration-200">
                        <Crown className="w-8 h-8 text-cyan-300 fill-cyan-400/40 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                        <span className="text-[10px] font-mono text-cyan-200 font-bold mt-0.5">
                          Q{r}
                        </span>
                      </div>
                    )}

                    {isTesting && !hasQueen && (
                      <div className="flex flex-col items-center opacity-70">
                        <Crown className="w-6 h-6 text-amber-300 stroke-dashed animate-bounce" />
                        <span className="text-[9px] font-mono text-amber-300">Thử...</span>
                      </div>
                    )}

                    {hasConflict && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    )}

                    <span className="absolute bottom-1 right-1 text-[9px] font-mono opacity-25">
                      {r},{c}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bottom Legend */}
        <div className="mt-5 text-center text-xs text-slate-400 font-mono">
          {status === 'SOLUTION_FOUND' ? (
            <span className="text-emerald-300 font-bold">
              🎉 Đã tìm thấy một cấu hình hợp lệ của {n} quân hậu!
            </span>
          ) : (
            <span>
              Quy tắc: Không có 2 quân hậu nào cùng chia sẻ hàng, cột hoặc đường chéo.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
