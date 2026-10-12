import React from 'react';
import { SortStep } from '../utils/sortingEngine';
import { BarChart3, Palette, Activity } from 'lucide-react';

export type VisualizerViewMode = 'bars' | 'spectrum' | 'scatter';

interface VisualizerStageProps {
  step: SortStep;
  viewMode: VisualizerViewMode;
  setViewMode: (mode: VisualizerViewMode) => void;
  maxVal: number;
}

export const VisualizerStage: React.FC<VisualizerStageProps> = ({
  step,
  viewMode,
  setViewMode,
  maxVal,
}) => {
  const { array, indices, sortedIndices, activePointers, type, description } = step;
  const sortedSet = new Set(sortedIndices);
  const activeSet = new Set(indices);

  // Retrieve pointers for an index (e.g. i, j, min, mid)
  const getPointersForIndex = (idx: number): string[] => {
    const labels: string[] = [];
    for (const [key, val] of Object.entries(activePointers)) {
      if (val === idx) {
        labels.push(key);
      }
    }
    return labels;
  };

  const minVal = Math.min(...(array.length > 0 ? array : [0]));

  return (
    <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm shadow-xl relative overflow-hidden">
      {/* View Mode Toolbar & Live Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">View Mode</span>
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('bars')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                viewMode === 'bars'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Dynamic Bars</span>
            </button>
            <button
              onClick={() => setViewMode('spectrum')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                viewMode === 'spectrum'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Color Spectrum</span>
            </button>
            <button
              onClick={() => setViewMode('scatter')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                viewMode === 'scatter'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Pulse Scatter</span>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 shadow-xs shadow-amber-400/50" />
            <span className="text-slate-300">Comparing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 shadow-xs shadow-rose-500/50" />
            <span className="text-slate-300">Swapping</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400 shadow-xs shadow-emerald-400/50" />
            <span className="text-slate-300">Sorted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-cyan-600" />
            <span className="text-slate-400">Unsorted</span>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 min-h-[360px] flex items-end justify-center px-2 py-6 relative">
        {/* Background coordinate grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* View 1: Dynamic Bars (Smooth, moving, tactile bars like in race mode) */}
        {viewMode === 'bars' && (
          <div className="w-full h-full flex items-end justify-center gap-1 sm:gap-1.5 relative z-10">
            {array.map((val, idx) => {
              const heightPercent = Math.max(8, (val / (maxVal || 1)) * 92);
              const isComparing = activeSet.has(idx) && (type === 'compare' || type === 'pivot');
              const isSwapping = activeSet.has(idx) && (type === 'swap' || type === 'overwrite');
              const isSorted = sortedSet.has(idx);
              const pointers = getPointersForIndex(idx);

              let barClass = 'bg-cyan-600/80 border-cyan-400/30';
              let transformStyle = '';

              if (isSwapping) {
                barClass = 'bg-rose-500 shadow-[0_0_16px_rgba(244,63,94,0.9)] border-rose-300 z-20';
                transformStyle = 'translate-y-[-6px] scale-y-[1.03] scale-x-[1.02]';
              } else if (isComparing) {
                barClass = 'bg-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.9)] border-yellow-200 z-20';
                transformStyle = 'translate-y-[-4px] scale-y-[1.02]';
              } else if (isSorted) {
                barClass = 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)] border-emerald-300/50';
              }

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center justify-end h-full relative"
                  style={{ maxWidth: array.length > 35 ? '20px' : '48px' }}
                >
                  {/* Floating Pointer tags */}
                  {pointers.length > 0 && (
                    <div className="absolute -top-7 flex flex-col items-center z-30 animate-bounce">
                      <div className="bg-amber-400 text-slate-950 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow-md whitespace-nowrap">
                        {pointers.join(', ')}
                      </div>
                      <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-amber-400" />
                    </div>
                  )}

                  {/* Value tag */}
                  {array.length <= 32 && (
                    <span
                      className={`text-[10px] font-mono mb-1 transition-all select-none tabular-nums ${
                        isComparing
                          ? 'text-amber-300 font-bold scale-110'
                          : isSwapping
                          ? 'text-rose-300 font-bold scale-110'
                          : isSorted
                          ? 'text-emerald-300 font-semibold'
                          : 'text-slate-400'
                      }`}
                    >
                      {val}
                    </span>
                  )}

                  {/* Moving Bar */}
                  <div
                    className={`w-full rounded-t-sm border border-b-0 transition-all duration-150 ${barClass} ${transformStyle}`}
                    style={{ height: `${heightPercent}%` }}
                  />

                  {/* Array index label */}
                  {array.length <= 25 && (
                    <span className="text-[9px] font-mono text-slate-500 mt-1 select-none tabular-nums">
                      {idx}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* View 2: High-Fidelity Color Spectrum View */}
        {viewMode === 'spectrum' && (
          <div className="w-full h-full flex items-end justify-center gap-0.5 sm:gap-1 relative z-10 px-1">
            {array.map((val, idx) => {
              // Hue spans from 0 (Red) to 300 (Magenta) based on value
              const range = maxVal - minVal || 1;
              const normalized = Math.max(0, Math.min(1, (val - minVal) / range));
              const hue = Math.round(normalized * 300);

              const isComparing = activeSet.has(idx) && (type === 'compare' || type === 'pivot');
              const isSwapping = activeSet.has(idx) && (type === 'swap' || type === 'overwrite');
              const isSorted = sortedSet.has(idx);
              const pointers = getPointersForIndex(idx);

              // Proportional height with solid minimum so ribbons fill the display beautifully
              const heightPercent = 25 + normalized * 72;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center justify-end h-full relative group transition-all duration-150"
                  style={{
                    transform: isSwapping
                      ? 'translateY(-14px) scale(1.04)'
                      : isComparing
                      ? 'translateY(-8px) scale(1.02)'
                      : 'translateY(0)',
                    zIndex: isSwapping ? 30 : isComparing ? 20 : 1,
                  }}
                >
                  {/* Active pointer tags */}
                  {pointers.length > 0 && (
                    <div className="absolute -top-7 flex flex-col items-center z-40 animate-bounce">
                      <div className="bg-white text-slate-950 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap">
                        {pointers.join(', ')}
                      </div>
                      <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-white" />
                    </div>
                  )}

                  {/* Value label */}
                  {array.length <= 30 && (
                    <span
                      className={`text-[9px] font-mono mb-1 select-none tabular-nums ${
                        isComparing || isSwapping ? 'text-white font-bold' : 'text-slate-300'
                      }`}
                    >
                      {val}
                    </span>
                  )}

                  {/* Full Spectrum Column */}
                  <div
                    className={`w-full rounded-t-sm transition-all duration-150 ${
                      isSwapping
                        ? 'ring-2 ring-white shadow-[0_0_20px_rgba(255,255,255,1)] brightness-125'
                        : isComparing
                        ? 'ring-2 ring-amber-300 shadow-[0_0_14px_rgba(253,224,71,0.9)] brightness-115'
                        : isSorted
                        ? 'opacity-100 hover:brightness-110 shadow-[0_0_6px_rgba(0,0,0,0.4)]'
                        : 'opacity-90 hover:opacity-100'
                    }`}
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: `hsl(${hue}, 92%, 52%)`,
                      boxShadow: isSwapping
                        ? '0 0 20px rgba(255,255,255,0.9)'
                        : isComparing
                        ? '0 0 14px rgba(253,224,71,0.9)'
                        : `0 0 8px hsla(${hue}, 90%, 50%, 0.35)`,
                    }}
                  />

                  {/* Index badge */}
                  {array.length <= 25 && (
                    <span className="text-[9px] font-mono text-slate-400 mt-1 select-none tabular-nums">
                      {idx}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* View 3: Pulse Scatter Plot */}
        {viewMode === 'scatter' && (
          <div className="w-full h-full relative z-10 flex items-center justify-center">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 300">
              <polyline
                fill="none"
                stroke="rgba(56, 189, 248, 0.3)"
                strokeWidth="2"
                points={array
                  .map((val, i) => {
                    const x = (i / (array.length - 1 || 1)) * 960 + 20;
                    const y = 280 - (val / (maxVal || 1)) * 240;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
              {array.map((val, idx) => {
                const x = (idx / (array.length - 1 || 1)) * 960 + 20;
                const y = 280 - (val / (maxVal || 1)) * 240;
                const isComparing = activeSet.has(idx) && (type === 'compare' || type === 'pivot');
                const isSwapping = activeSet.has(idx) && (type === 'swap' || type === 'overwrite');
                const isSorted = sortedSet.has(idx);

                let dotColor = '#06b6d4';
                let radius = 5;

                if (isSwapping) {
                  dotColor = '#f43f5e';
                  radius = 8;
                } else if (isComparing) {
                  dotColor = '#f59e0b';
                  radius = 8;
                } else if (isSorted) {
                  dotColor = '#10b981';
                }

                return (
                  <g key={idx}>
                    <circle
                      cx={x}
                      cy={y}
                      r={radius}
                      fill={dotColor}
                      stroke="#0f172a"
                      strokeWidth="2"
                      className="transition-all duration-150"
                    />
                    {array.length <= 25 && (
                      <text
                        x={x}
                        y={y - 10}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        {val}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>

      {/* Step Natural Language Explanation Bar */}
      <div className="mt-2 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded shrink-0">
            Current Action
          </span>
          <p className="text-xs text-slate-200 font-mono truncate">{description}</p>
        </div>
        <div className="text-xs font-mono text-slate-400 shrink-0 tabular-nums">
          Sorted: <span className="text-emerald-400 font-semibold">{sortedIndices.length}</span> / {array.length}
        </div>
      </div>
    </div>
  );
};
