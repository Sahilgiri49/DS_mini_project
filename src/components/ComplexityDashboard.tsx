import React from 'react';
import { AlgorithmMeta } from '../data/pythonCode';
import { SortStep } from '../utils/sortingEngine';
import { Clock, HardDrive, ShieldCheck, Repeat, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

interface ComplexityDashboardProps {
  meta: AlgorithmMeta;
  currentStep: SortStep;
}

export const ComplexityDashboard: React.FC<ComplexityDashboardProps> = ({ meta, currentStep }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {/* Live Comparisons */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 backdrop-blur-sm flex flex-col justify-between">
        <span className="text-[11px] font-medium text-slate-400">Comparisons</span>
        <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
          {currentStep.comparisons}
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Live counter</span>
      </div>

      {/* Live Swaps / Overwrites */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 backdrop-blur-sm flex flex-col justify-between">
        <span className="text-[11px] font-medium text-slate-400">Swaps / Writes</span>
        <div className="text-xl font-bold font-mono text-fuchsia-400 tabular-nums">
          {currentStep.swaps}
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Array mutations</span>
      </div>

      {/* Array Accesses */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 backdrop-blur-sm flex flex-col justify-between">
        <span className="text-[11px] font-medium text-slate-400">Array Accesses</span>
        <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums">
          {currentStep.arrayAccesses}
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Read & writes</span>
      </div>

      {/* Time Complexity */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 backdrop-blur-sm flex flex-col justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Time (Avg)</span>
        </div>
        <div className="text-xl font-bold font-mono text-white">
          {meta.timeAvg}
        </div>
        <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
          <span>Best: {meta.timeBest}</span>
          <span>Worst: {meta.timeWorst}</span>
        </div>
      </div>

      {/* Space Complexity */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 backdrop-blur-sm flex flex-col justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
          <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
          <span>Aux Space</span>
        </div>
        <div className="text-xl font-bold font-mono text-white">
          {meta.spaceComplexity}
        </div>
        <span className="text-[10px] text-slate-500 font-mono">
          {meta.inPlace ? 'In-Place memory' : 'Auxiliary buffers'}
        </span>
      </div>

      {/* Stability & In-Place */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 backdrop-blur-sm flex flex-col justify-between">
        <span className="text-[11px] font-medium text-slate-400">Classification</span>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-200">
            <span className={meta.stable ? 'text-emerald-400' : 'text-rose-400'}>
              {meta.stable ? '✓ Stable' : '✗ Unstable'}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {meta.inPlace ? 'In-place: Yes' : 'In-place: No'}
          </div>
        </div>
        <span className="text-[10px] text-slate-500">Order preservation</span>
      </div>
    </div>
  );
};
