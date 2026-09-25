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
    <div className="bg-dark-850/95 backdrop-blur-md border-t border-slate-800 px-3 md:px-6 py-2.5 flex flex-col gap-2 shrink-0 z-30">
      {/* Timeline Scrubber Bar */}
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-[11px] font-mono text-slate-400 min-w-[56px] sm:min-w-[70px] shrink-0">
          Bước {totalSteps > 0 ? currentStepIndex + 1 : 0} / {totalSteps}
        </span>

        <div className="relative flex-1 flex items-center group min-w-0">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={(e) => onGoToStep(Number(e.target.value))}
            className="w-full h-2 sm:h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          />
        </div>

        <span className="text-[11px] font-mono text-cyan-400 min-w-[32px] sm:min-w-[36px] text-right font-bold shrink-0">
          {percent}%
        </span>
      </div>

      {/* Controls & Speed in One Clean Row — on phone keep single row with min-width */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 overflow-hidden">
        {/* Reset */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onReset}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-all text-[11px] sm:text-xs flex items-center gap-1.5 font-medium border border-slate-700/60 min-h-[36px]"
            title="Reset về bước đầu (R)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset (R)</span>
          </button>

          <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-500 font-mono pl-2">
            <span>Space: Play/Pause</span>
            <span>•</span>
            <span>← / →: Bước lui/tới</span>
          </div>
        </div>

        {/* Main Transport Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onPrev}
            disabled={currentStepIndex <= 0}
            className="min-h-[40px] min-w-[40px] p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 transition-all border border-slate-700/60 flex items-center justify-center"
            title="Bước trước (Phím ←)"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className={`min-h-[40px] px-4 sm:px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-dark-900 shadow-amber-500/20'
                : 'bg-cyan-500 hover:bg-cyan-400 text-dark-900 shadow-glow-cyan'
            }`}
            title="Phát / Tạm dừng (Space)"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span className="hidden sm:inline">Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span className="hidden sm:inline">Chạy tiếp</span>
              </>
            )}
          </button>

          <button
            onClick={onNext}
            disabled={currentStepIndex >= totalSteps - 1}
            className="min-h-[40px] min-w-[40px] p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 transition-all border border-slate-700/60 flex items-center justify-center"
            title="Bước tiếp theo (Phím →)"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Multiplier */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-dark-900/80 p-0.5 rounded-xl border border-slate-800/80 shrink-0 overflow-x-auto scrollbar-thin max-w-[42%] sm:max-w-none">
          <Gauge className="w-3 h-3 text-slate-500 ml-1.5 mr-0.5 hidden sm:inline shrink-0" />
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              className={`min-h-[28px] px-2 py-1 rounded-lg text-[11px] font-mono font-medium transition-all shrink-0 ${
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
