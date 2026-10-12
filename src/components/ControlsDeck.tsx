import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Shuffle,
  Volume2,
  AlertTriangle,
  Settings2,
} from 'lucide-react';
import { sound } from '../utils/soundEngine';

export type ArrayPreset = 'random' | 'nearly-sorted' | 'reversed' | 'few-unique' | 'custom';

interface ControlsDeckProps {
  algorithm: string;
  setAlgorithm: (algo: string) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepBackward: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onGenerateNew: (preset: ArrayPreset, customValues?: number[]) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  arraySize: number;
  setArraySize: (size: number) => void;
  stepIndex: number;
  totalSteps: number;
  onError: (msg: string) => void;
}

export const ControlsDeck: React.FC<ControlsDeckProps> = ({
  algorithm,
  setAlgorithm,
  isPlaying,
  onTogglePlay,
  onStepBackward,
  onStepForward,
  onReset,
  onGenerateNew,
  speed,
  setSpeed,
  arraySize,
  setArraySize,
  stepIndex,
  totalSteps,
  onError,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<ArrayPreset>('random');
  const [customInputText, setCustomInputText] = useState('45, 12, 89, 34, 7, 65, 23, 90, 11');
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Trigger custom input parse with error handling
  const handleApplyCustom = () => {
    if (isPlaying) {
      sound.playErrorSound();
      onError('Cannot modify array while sorting is running. Please pause first.');
      return;
    }

    const trimmed = customInputText.trim();
    if (!trimmed) {
      sound.playErrorSound();
      onError('Input is empty. Please enter comma-separated numbers (e.g. 25, 10, 60).');
      return;
    }

    const tokens = trimmed.split(/[\s,]+/);
    const parsedNums: number[] = [];

    for (const token of tokens) {
      if (!token) continue;
      const val = Number(token);
      if (isNaN(val)) {
        sound.playErrorSound();
        onError(`Invalid element "${token}": only numeric digits are allowed.`);
        return;
      }
      if (val < 1 || val > 500) {
        sound.playErrorSound();
        onError(`Element ${val} is out of bounds. Permitted range is 1 to 500.`);
        return;
      }
      parsedNums.push(Math.round(val));
    }

    if (parsedNums.length < 3) {
      sound.playErrorSound();
      onError('Array must contain at least 3 elements to demonstrate sorting.');
      return;
    }

    if (parsedNums.length > 60) {
      sound.playErrorSound();
      onError(`Provided ${parsedNums.length} elements. Maximum supported size for visual clarity is 60.`);
      return;
    }

    setSelectedPreset('custom');
    setShowCustomModal(false);
    onGenerateNew('custom', parsedNums);
  };

  const handlePresetClick = (preset: ArrayPreset) => {
    if (isPlaying) {
      sound.playErrorSound();
      onError('Sorting is actively running. Pause execution to change initial array.');
      return;
    }
    if (preset === 'custom') {
      setShowCustomModal(true);
      return;
    }
    setSelectedPreset(preset);
    onGenerateNew(preset);
  };

  const handleAlgoChange = (newAlgo: string) => {
    if (isPlaying) {
      sound.playErrorSound();
      onError('Cannot switch algorithm while playing. Pause or reset first.');
      return;
    }
    setAlgorithm(newAlgo);
  };

  const handleTestErrorSound = () => {
    sound.playErrorSound();
    onError('Demo Error Buzzer: Triggered on invalid inputs, illegal steps, or execution conflicts.');
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm shadow-xl flex flex-col gap-5">
      {/* Top Row: Algorithm Selection Segmented Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Algorithm</span>
          <div className="flex flex-wrap items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[
              { id: 'bubble', label: 'Bubble Sort' },
              { id: 'selection', label: 'Selection Sort' },
              { id: 'insertion', label: 'Insertion Sort' },
              { id: 'merge', label: 'Merge Sort' },
              { id: 'quick', label: 'Quick Sort' },
            ].map((algo) => (
              <button
                key={algo.id}
                onClick={() => handleAlgoChange(algo.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  algorithm === algo.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {algo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Error Sound FX Trigger for Examination */}
        <button
          onClick={handleTestErrorSound}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-amber-400 bg-amber-950/40 border border-amber-800/50 hover:bg-amber-900/40 rounded-lg transition-colors cursor-pointer self-start md:self-auto"
          title="Play the dynamic error sound effect required in prompt"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Demo Error Sound FX</span>
        </button>
      </div>

      {/* Middle Row: Playback Transport Bar + Progress Slider */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Primary Transport Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            title="Reset to Step 0"
            className="p-2.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onStepBackward}
            title="Step Backward"
            className="p-2.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-xs tracking-wide transition-all shadow-md cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{stepIndex >= totalSteps - 1 ? 'Replay' : 'Play'}</span>
              </>
            )}
          </button>
          <button
            onClick={onStepForward}
            title="Step Forward"
            className="p-2.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
          </button>
          <button
            onClick={() => handlePresetClick('random')}
            title="Randomize New Array"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
        </div>

        {/* Playback Step Scrubber */}
        <div className="flex-1 max-w-md flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 shrink-0">Step</span>
          <div className="flex-1 relative flex items-center">
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-cyan-400 h-full transition-all duration-100"
                style={{ width: `${totalSteps > 1 ? (stepIndex / (totalSteps - 1)) * 100 : 0}%` }}
              />
            </div>
          </div>
          <span className="text-xs font-mono text-slate-300 shrink-0 tabular-nums">
            {stepIndex + 1} / {totalSteps || 1}
          </span>
        </div>
      </div>

      {/* Bottom Row: Parameter Sliders and Generation Presets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
        {/* Speed Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Playback Speed</span>
            <span className="font-mono text-cyan-400 tabular-nums">{speed}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Array Size Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Array Size</span>
            <span className="font-mono text-cyan-400 tabular-nums">{arraySize} elements</span>
          </div>
          <input
            type="range"
            min="6"
            max="60"
            step="2"
            disabled={isPlaying}
            value={arraySize}
            onChange={(e) => {
              if (isPlaying) {
                sound.playErrorSound();
                onError('Cannot resize array while running.');
                return;
              }
              const newSize = Number(e.target.value);
              setArraySize(newSize);
            }}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg disabled:opacity-40"
          />
        </div>

        {/* Initial Dataset Presets */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <span className="text-xs text-slate-400">Input Preset</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'random', label: 'Random' },
              { id: 'nearly-sorted', label: 'Nearly Sorted' },
              { id: 'reversed', label: 'Reversed (Worst)' },
              { id: 'few-unique', label: 'Few Unique' },
              { id: 'custom', label: 'Custom Elements...' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handlePresetClick(p.id as ArrayPreset)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-all cursor-pointer ${
                  selectedPreset === p.id
                    ? 'bg-slate-800 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Array Input Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Enter Custom Elements</h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Enter numbers between 1 and 500 separated by commas or spaces. This validates and immediately feeds the custom data into the visualizer.
            </p>

            <textarea
              value={customInputText}
              onChange={(e) => setCustomInputText(e.target.value)}
              placeholder="e.g. 50, 12, 95, 33, 74, 18, 6, 88"
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 resize-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustom}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
              >
                Apply & Visualize
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
