import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw,
  Gauge
} from 'lucide-react';

interface PlaybackControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onGoToStep: (index: number) => void;
  onSetSpeed: (speed: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  currentStepIndex,
  totalSteps,
  isPlaying,
  speed,
  onTogglePlay,
  onNext,
  onPrev,
  onReset,
  onGoToStep,
  onSetSpeed,
}) => {
  const speeds = [0.5, 1, 1.5, 2];
  const percent = totalSteps > 1 ? Math.round((currentStepIndex / (totalSteps - 1)) * 100) : 0;

  return (
    <div className="bg-dark-850/95 backdrop-blur-md border-t border-slate-800 px-4 md:px-6 py-2.5 flex flex-col gap-2 shrink-0 z-30">
      {/* Timeline Scrubber Bar */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-mono text-slate-400 min-w-[70px]">
          Bước {totalSteps > 0 ? currentStepIndex + 1 : 0} / {totalSteps}
        </span>

        <div className="relative flex-1 flex items-center group">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={(e) => onGoToStep(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
        </div>

        <span className="text-[11px] font-mono text-cyan-400 min-w-[36px] text-right font-bold">
          {percent}%
        </span>
      </div>

      {/* Controls & Speed in One Clean Row */}
      <div className="flex items-center justify-between gap-3">
        {/* Reset & Hotkey hints */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1.5 font-medium border border-slate-700/60"
            title="Reset về bước đầu (R)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset (R)</span>
          </button>

          <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-500 font-mono pl-2">
            <span>Space: Play/Pause</span>
            <span>•</span>
            <span>← / →: Bước lui/tới</span>
          </div>
        </div>

        {/* Main Transport Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={currentStepIndex <= 0}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 transition-all border border-slate-700/60"
            title="Bước trước (Phím ←)"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-dark-900 shadow-amber-500/20'
                : 'bg-cyan-500 hover:bg-cyan-400 text-dark-900 shadow-glow-cyan'
            }`}
            title="Phát / Tạm dừng (Space)"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Chạy tiếp</span>
              </>
            )}
          </button>

          <button
            onClick={onNext}
            disabled={currentStepIndex >= totalSteps - 1}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 transition-all border border-slate-700/60"
            title="Bước tiếp theo (Phím →)"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Multiplier */}
        <div className="flex items-center gap-1 bg-dark-900/80 p-0.5 rounded-xl border border-slate-800/80">
          <Gauge className="w-3 h-3 text-slate-500 ml-1.5 mr-0.5 hidden sm:inline" />
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              className={`px-2 py-1 rounded-lg text-[11px] font-mono font-medium transition-all ${
                speed === s
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
