import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateSortSteps, SortStep } from '../utils/sortingEngine';
import { sound } from '../utils/soundEngine';
import { Play, Pause, RotateCcw, Shuffle, Trophy, Flame } from 'lucide-react';

interface RaceModeProps {
  initialArray: number[];
  onGenerateNewArray: () => void;
  speed: number;
}

export const RaceMode: React.FC<RaceModeProps> = ({
  initialArray,
  onGenerateNewArray,
  speed,
}) => {
  const [algoA, setAlgoA] = useState<string>('bubble');
  const [algoB, setAlgoB] = useState<string>('merge');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [stepAIndex, setStepAIndex] = useState<number>(0);
  const [stepBIndex, setStepBIndex] = useState<number>(0);

  const stepsARef = useRef<SortStep[]>([]);
  const stepsBRef = useRef<SortStep[]>([]);
  const stepAIndexRef = useRef<number>(0);
  const stepBIndexRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const timerRef = useRef<number | null>(null);

  // Synchronize ref indices with state
  useEffect(() => {
    stepAIndexRef.current = stepAIndex;
  }, [stepAIndex]);

  useEffect(() => {
    stepBIndexRef.current = stepBIndex;
  }, [stepBIndex]);

  // Generate steps whenever algorithms or input data changes
  const resetRaceData = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    isPlayingRef.current = false;
    setIsPlaying(false);

    const generatedA = generateSortSteps(algoA, initialArray);
    const generatedB = generateSortSteps(algoB, initialArray);

    stepsARef.current = generatedA;
    stepsBRef.current = generatedB;

    stepAIndexRef.current = 0;
    stepBIndexRef.current = 0;
    setStepAIndex(0);
    setStepBIndex(0);
  }, [algoA, algoB, initialArray]);

  useEffect(() => {
    resetRaceData();
  }, [resetRaceData]);

  const maxVal = Math.max(...initialArray, 1);

  // Stop running race
  const stopRace = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
  }, []);

  // Continuous Race Execution Loop
  const startRaceLoop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    isPlayingRef.current = true;
    setIsPlaying(true);

    const intervalMs = Math.max(16, Math.round(350 / speed));

    timerRef.current = window.setInterval(() => {
      if (!isPlayingRef.current) return;

      const totalA = stepsARef.current.length;
      const totalB = stepsBRef.current.length;

      let nextA = stepAIndexRef.current;
      let nextB = stepBIndexRef.current;

      let laneAUpdated = false;
      let laneBUpdated = false;

      // Advance Lane A if not finished
      if (nextA < totalA - 1) {
        nextA++;
        stepAIndexRef.current = nextA;
        setStepAIndex(nextA);
        laneAUpdated = true;

        const currentStepA = stepsARef.current[nextA];
        if (currentStepA && currentStepA.indices.length > 0) {
          const val = currentStepA.array[currentStepA.indices[0]] || 25;
          sound.playComparisonTone(val);
        }
      }

      // Advance Lane B if not finished
      if (nextB < totalB - 1) {
        nextB++;
        stepBIndexRef.current = nextB;
        setStepBIndex(nextB);
        laneBUpdated = true;
      }

      // Check if BOTH lanes have fully finished sorting
      const aDone = stepAIndexRef.current >= totalA - 1;
      const bDone = stepBIndexRef.current >= totalB - 1;

      if (aDone && bDone) {
        // Both are completely sorted!
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        isPlayingRef.current = false;
        setIsPlaying(false);
        sound.playVictoryChime();
      }
    }, intervalMs);
  }, [speed]);

  // Toggle Start / Pause
  const handleTogglePlay = () => {
    if (isPlaying) {
      stopRace();
    } else {
      const totalA = stepsARef.current.length;
      const totalB = stepsBRef.current.length;

      // If either has reached the end, reset both so the race starts clean
      if (stepAIndexRef.current >= totalA - 1 || stepBIndexRef.current >= totalB - 1) {
        stepAIndexRef.current = 0;
        stepBIndexRef.current = 0;
        setStepAIndex(0);
        setStepBIndex(0);
      }

      startRaceLoop();
    }
  };

  const handleReset = () => {
    stopRace();
    stepAIndexRef.current = 0;
    stepBIndexRef.current = 0;
    setStepAIndex(0);
    setStepBIndex(0);
  };

  const handleShuffle = () => {
    stopRace();
    onGenerateNewArray();
  };

  // Cleanup on unmount or speed change
  useEffect(() => {
    if (isPlayingRef.current) {
      startRaceLoop();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [speed, startRaceLoop]);

  const currentStepA = stepsARef.current[stepAIndex] || {
    array: initialArray,
    indices: [],
    sortedIndices: [],
    comparisons: 0,
    swaps: 0,
    type: 'initial',
  };

  const currentStepB = stepsBRef.current[stepBIndex] || {
    array: initialArray,
    indices: [],
    sortedIndices: [],
    comparisons: 0,
    swaps: 0,
    type: 'initial',
  };

  const totalA = stepsARef.current.length || 1;
  const totalB = stepsBRef.current.length || 1;
  const aFinished = stepAIndex >= totalA - 1;
  const bFinished = stepBIndex >= totalB - 1;

  const algosList = [
    { id: 'bubble', name: 'Bubble Sort' },
    { id: 'selection', name: 'Selection Sort' },
    { id: 'insertion', name: 'Insertion Sort' },
    { id: 'merge', name: 'Merge Sort' },
    { id: 'quick', name: 'Quick Sort' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Race Setup Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> Dual Head-to-Head Race
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">Continuous Algorithm Performance Race</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click Start Race to run both algorithms continuously until both arrays are completely sorted.
          </p>
        </div>

        {/* Transport controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="p-2.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Reset Race to Step 0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleShuffle}
            className="p-2.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Shuffle Shared Array"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-xs tracking-wide transition-all shadow-md cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Race</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{aFinished && bFinished ? 'Replay Race' : 'Start Race'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Side-by-Side Dual Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Racer A */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400 font-mono">Lane A:</span>
              <select
                value={algoA}
                disabled={isPlaying}
                onChange={(e) => setAlgoA(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 cursor-pointer disabled:opacity-50"
              >
                {algosList.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {aFinished ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                <Trophy className="w-3.5 h-3.5" /> Finished ({stepAIndex} steps)
              </span>
            ) : isPlaying ? (
              <span className="text-xs font-mono text-cyan-400 animate-pulse">Running...</span>
            ) : (
              <span className="text-xs font-mono text-slate-400">Ready</span>
            )}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
              <div className="text-slate-400 text-[10px]">Comparisons</div>
              <div className="text-amber-400 font-bold text-sm tabular-nums">
                {currentStepA.comparisons}
              </div>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
              <div className="text-slate-400 text-[10px]">Swaps / Writes</div>
              <div className="text-fuchsia-400 font-bold text-sm tabular-nums">
                {currentStepA.swaps}
              </div>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
              <div className="text-slate-400 text-[10px]">Progress</div>
              <div className="text-cyan-400 font-bold text-sm tabular-nums">
                {Math.round((stepAIndex / (totalA - 1 || 1)) * 100)}%
              </div>
            </div>
          </div>

          {/* Visual Bars with dynamic movement */}
          <div className="h-64 flex items-end justify-center gap-1 px-3 pt-4 bg-slate-950/60 rounded-lg border border-slate-800/70 relative overflow-hidden">
            {currentStepA.array.map((val, idx) => {
              const heightPercent = Math.max(8, (val / maxVal) * 92);
              const isComparing = currentStepA.indices.includes(idx);
              const isSorted = currentStepA.sortedIndices.includes(idx);

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center justify-end h-full relative"
                  style={{ maxWidth: '28px' }}
                >
                  <div
                    className={`w-full rounded-t-xs transition-all duration-100 ${
                      isComparing
                        ? 'bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.9)] scale-y-[1.03] z-10'
                        : isSorted
                        ? 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.4)]'
                        : 'bg-cyan-600/80'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  {currentStepA.array.length <= 25 && (
                    <span className="text-[9px] font-mono text-slate-500 mt-0.5 tabular-nums select-none">
                      {val}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Racer B */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-fuchsia-400 font-mono">Lane B:</span>
              <select
                value={algoB}
                disabled={isPlaying}
                onChange={(e) => setAlgoB(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-fuchsia-400 cursor-pointer disabled:opacity-50"
              >
                {algosList.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {bFinished ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                <Trophy className="w-3.5 h-3.5" /> Finished ({stepBIndex} steps)
              </span>
            ) : isPlaying ? (
              <span className="text-xs font-mono text-fuchsia-400 animate-pulse">Running...</span>
            ) : (
              <span className="text-xs font-mono text-slate-400">Ready</span>
            )}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
              <div className="text-slate-400 text-[10px]">Comparisons</div>
              <div className="text-amber-400 font-bold text-sm tabular-nums">
                {currentStepB.comparisons}
              </div>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
              <div className="text-slate-400 text-[10px]">Swaps / Writes</div>
              <div className="text-fuchsia-400 font-bold text-sm tabular-nums">
                {currentStepB.swaps}
              </div>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
              <div className="text-slate-400 text-[10px]">Progress</div>
              <div className="text-fuchsia-400 font-bold text-sm tabular-nums">
                {Math.round((stepBIndex / (totalB - 1 || 1)) * 100)}%
              </div>
            </div>
          </div>

          {/* Visual Bars with dynamic movement */}
          <div className="h-64 flex items-end justify-center gap-1 px-3 pt-4 bg-slate-950/60 rounded-lg border border-slate-800/70 relative overflow-hidden">
            {currentStepB.array.map((val, idx) => {
              const heightPercent = Math.max(8, (val / maxVal) * 92);
              const isComparing = currentStepB.indices.includes(idx);
              const isSorted = currentStepB.sortedIndices.includes(idx);

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center justify-end h-full relative"
                  style={{ maxWidth: '28px' }}
                >
                  <div
                    className={`w-full rounded-t-xs transition-all duration-100 ${
                      isComparing
                        ? 'bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.9)] scale-y-[1.03] z-10'
                        : isSorted
                        ? 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.4)]'
                        : 'bg-fuchsia-600/80'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  {currentStepB.array.length <= 25 && (
                    <span className="text-[9px] font-mono text-slate-500 mt-0.5 tabular-nums select-none">
                      {val}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
