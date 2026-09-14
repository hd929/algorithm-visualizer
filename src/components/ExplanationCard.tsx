import React from 'react';
import { 
  Info, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Compass, 
  Zap,
  HelpCircle
} from 'lucide-react';
import { AlgorithmStep } from '../types/algorithm';

interface ExplanationCardProps {
  step: AlgorithmStep | null;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({ step }) => {
  if (!step) {
    return (
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-slate-500 text-sm">
        Chưa có bước thực thi nào.
      </div>
    );
  }

  // Get action badge style
  const getBadge = () => {
    switch (step.actionType) {
      case 'INIT':
        return {
          icon: <Layers className="w-3.5 h-3.5 text-blue-400" />,
          label: 'KHỞI TẠO',
          cls: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
        };
      case 'PATH_COMPRESS':
        return {
          icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
          label: 'PATH COMPRESSION',
          cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-sm',
        };
      case 'UNION_BY_RANK':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />,
          label: 'UNION BY RANK',
          cls: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 shadow-glow-cyan',
        };
      case 'CYCLE_DETECTED':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
          label: 'CHU TRÌNH / CÙNG CỤM',
          cls: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        };
      case 'FOUND':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'TÌM THẤY TARGET',
          cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-glow-emerald',
        };
      case 'NOT_FOUND':
        return {
          icon: <HelpCircle className="w-3.5 h-3.5 text-slate-400" />,
          label: 'KHÔNG TỒN TẠI',
          cls: 'bg-slate-700/30 text-slate-300 border-slate-600/30',
        };
      case 'COMPARE':
        return {
          icon: <Compass className="w-3.5 h-3.5 text-purple-400" />,
          label: 'SO SÁNH & THU HẸP',
          cls: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
        };
      default:
        return {
          icon: <Info className="w-3.5 h-3.5 text-cyan-400" />,
          label: 'THỰC THI BƯỚC',
          cls: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
        };
    }
  };

  const badge = getBadge();

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800 shadow-xl flex flex-col gap-2.5">
      {/* Header with Title and Action Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
          <span>{step.title}</span>
        </h3>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border ${badge.cls}`}>
          {badge.icon}
          <span>{badge.label}</span>
        </span>
      </div>

      {/* Main explanation description */}
      <p className="text-sm text-slate-200 leading-relaxed">
        {step.description}
      </p>

      {/* Detailed insight if available */}
      {step.detail && (
        <div className="text-xs text-slate-400 bg-dark-900/60 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed font-sans">
          💡 <span className="text-slate-300">{step.detail}</span>
        </div>
      )}
    </div>
  );
};
