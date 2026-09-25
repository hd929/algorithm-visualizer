import React from 'react';
import { KnapsackSnapshot } from '../../types/knapsack';
import { Backpack, Sparkles, Check, ArrowDown, CornerDownRight } from 'lucide-react';

interface KnapsackVisualizerProps {
  snapshot: KnapsackSnapshot;
}

export const KnapsackVisualizer: React.FC<KnapsackVisualizerProps> = ({ snapshot }) => {
  const {
    items,
    capacity,
    dpTable,
    currentItemIdx,
    currentWeight,
    decision,
    comparingCells = [],
    selectedItemIds,
    maxValueFound,
  } = snapshot;

  const totalSelectedWeight = items
    .filter((it) => selectedItemIds.includes(it.id))
    .reduce((sum, it) => sum + it.weight, 0);

  const totalSelectedValue = items
    .filter((it) => selectedItemIds.includes(it.id))
    .reduce((sum, it) => sum + it.value, 0);

  return (
    <div className="flex flex-col h-full gap-3 overflow-hidden">
      {/* Top Header: Items Summary & Capacity */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-dark-850/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Backpack className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300">
            Sức Chứa Balo (W): <span className="text-cyan-400 font-mono font-bold">{capacity}kg</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-400">
            Đang chứa: <span className="font-mono text-purple-300 font-semibold">{totalSelectedWeight}/{capacity}kg</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-400">
            Tổng giá trị: <span className="font-mono text-emerald-400 font-bold">{maxValueFound ?? totalSelectedValue}₫</span>
          </span>
        </div>

        {/* Item mini badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {items.map((item, idx) => {
            const isSelected = selectedItemIds.includes(item.id);
            const isCurrent = currentItemIdx === idx + 1;

            return (
              <div
                key={item.id}
                className={`px-2 py-1 rounded-xl text-[11px] font-mono border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow-glow-emerald'
                    : isCurrent
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                    : 'bg-dark-900 border-slate-800 text-slate-400'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                <span>#{item.id} {item.name}</span>
                <span className="text-[10px] text-slate-500">({item.weight}kg, {item.value}₫)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main DP Table Area */}
      <div className="flex-1 min-h-[360px] bg-dark-900/90 rounded-2xl border border-slate-800/80 p-4 flex flex-col justify-between overflow-auto relative scrollbar-thin">
        <div className="flex flex-col gap-2 min-w-[500px]">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span className="font-mono font-semibold text-cyan-300 flex items-center gap-1.5">
              <span>Bảng Quy Hoạch Động dp[i][w]:</span>
            </span>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-cyan-500/30 border border-cyan-400 inline-block"></span>
                <span>Ô đang tính</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-purple-500/30 border border-purple-400 inline-block"></span>
                <span>Ô so sánh</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-400 inline-block"></span>
                <span>Đã chọn</span>
              </span>
            </div>
          </div>

          {/* 2D Table */}
          <table className="w-full border-collapse font-mono text-xs">
            <thead>
              <tr>
                <th className="p-2 text-left text-slate-500 font-semibold border-b border-slate-800/80 w-32">
                  Vật phẩm (i)
                </th>
                {Array.from({ length: capacity + 1 }).map((_, w) => (
                  <th
                    key={w}
                    className={`p-2 text-center border-b border-slate-800/80 ${
                      w === currentWeight ? 'text-cyan-400 font-bold bg-cyan-500/10 rounded-t-lg' : 'text-slate-400'
                    }`}
                  >
                    w = {w}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dpTable.map((row, i) => {
                const item = i > 0 ? items[i - 1] : null;
                const isItemRowActive = currentItemIdx === i;

                return (
                  <tr key={i} className={`border-b border-slate-800/40 ${isItemRowActive ? 'bg-slate-800/30' : ''}`}>
                    <td className="p-2 text-slate-300 font-medium">
                      {i === 0 ? (
                        <span className="text-slate-500 italic">0 (Rỗng)</span>
                      ) : (
                        <div className="flex flex-col">
                          <span className={`font-semibold ${isItemRowActive ? 'text-cyan-300' : 'text-slate-200'}`}>
                            #{i} {item?.name}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            w:{item?.weight}kg, v:{item?.value}₫
                          </span>
                        </div>
                      )}
                    </td>

                    {row.map((val, w) => {
                      const isCurrentCell = currentItemIdx === i && currentWeight === w;
                      const comparing = comparingCells.find((c) => c.r === i && c.c === w);
                      const isSelectedCell = decision === 'BACKTRACK' && currentItemIdx === i && currentWeight === w;

                      let cellBg = 'bg-dark-850/60 text-slate-300 border-slate-800';
                      if (isCurrentCell) {
                        cellBg = decision === 'TAKE'
                          ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400 shadow-glow-cyan ring-2 ring-emerald-400/60 font-bold scale-105'
                          : 'bg-cyan-500/30 text-cyan-200 border-cyan-400 shadow-glow-cyan ring-2 ring-cyan-400/60 font-bold scale-105';
                      } else if (comparing) {
                        cellBg = 'bg-purple-500/25 text-purple-200 border-purple-400 font-semibold ring-1 ring-purple-400/50';
                      } else if (isSelectedCell) {
                        cellBg = 'bg-amber-500/30 text-amber-200 border-amber-400 font-bold';
                      }

                      return (
                        <td key={w} className="p-1 text-center">
                          <div
                            className={`py-2 px-1 rounded-xl border transition-all relative ${cellBg}`}
                          >
                            <span className="text-xs">{val}</span>
                            {comparing && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] px-1 bg-purple-900 border border-purple-500 rounded text-purple-200 whitespace-nowrap z-10">
                                {comparing.label}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Selected Items Shelf */}
        <div className="mt-4 p-3 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">Vật phẩm được mang theo:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {selectedItemIds.length === 0 ? (
              <span className="text-xs text-slate-500 italic">Chưa chọn (Đang tính toán bảng DP...)</span>
            ) : (
              selectedItemIds.map((id) => {
                const item = items.find((it) => it.id === id);
                if (!item) return null;
                return (
                  <div
                    key={id}
                    className="px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/80 text-emerald-200 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{item.name}</span>
                    <span className="text-[10px] text-emerald-400/80">({item.weight}kg, {item.value}₫)</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
