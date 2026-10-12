import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { VisualizerStage, VisualizerViewMode } from './components/VisualizerStage';
import { ControlsDeck, ArrayPreset } from './components/ControlsDeck';
import { ComplexityDashboard } from './components/ComplexityDashboard';
import { RaceMode } from './components/RaceMode';
import { ErrorToast } from './components/ErrorToast';
import { generateSortSteps, SortStep } from './utils/sortingEngine';
import { ALGORITHMS } from './data/pythonCode';
import { sound } from './utils/soundEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'race'>('visualizer');
  const [algorithm, setAlgorithm] = useState<string>('bubble');
  const [viewMode, setViewMode] = useState<VisualizerViewMode>('bars');
  const [arraySize, setArraySize] = useState<number>(18);
  const [speed, setSpeed] = useState<number>(8); // 1x to 30x
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Array and steps state
  const [initialArray, setInitialArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const stepIndexRef = useRef<number>(0);
  const stepsRef = useRef<SortStep[]>([]);
  const isPlayingRef = useRef<boolean>(false);
  const playbackTimerRef = useRef<number | null>(null);

  useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);

  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  // Array generation helpers
  const generateArrayData = useCallback((size: number, preset: ArrayPreset, customValues?: number[]): number[] => {
    if (preset === 'custom' && customValues && customValues.length > 0) {
      return [...customValues];
    }

    const min = 12;
    const max = 98;

    switch (preset) {
      case 'nearly-sorted': {
        const sorted = Array.from({ length: size }, (_, i) => Math.round(min + (i / size) * (max - min)));
        for (let s = 0; s < Math.max(1, Math.floor(size / 6)); s++) {
          const idx = Math.floor(Math.random() * (size - 1));
          const tmp = sorted[idx];
          sorted[idx] = sorted[idx + 1];
          sorted[idx + 1] = tmp;
        }
        return sorted;
      }
      case 'reversed': {
        return Array.from({ length: size }, (_, i) => Math.round(max - (i / size) * (max - min)));
      }
      case 'few-unique': {
        const distinctPool = [22, 45, 68, 88];
        return Array.from({ length: size }, () => distinctPool[Math.floor(Math.random() * distinctPool.length)]);
      }
      case 'random':
      default: {
        return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
      }
    }
  }, []);

  // Initialize initial array on mount
  useEffect(() => {
    const initial = generateArrayData(arraySize, 'random');
    setInitialArray(initial);
  }, [arraySize, generateArrayData]);

  // Recalculate sorting steps whenever algorithm or initialArray changes
  useEffect(() => {
    if (initialArray.length === 0) return;
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
    isPlayingRef.current = false;
    setIsPlaying(false);

    const generated = generateSortSteps(algorithm, initialArray);
    stepsRef.current = generated;
    setSteps(generated);
    stepIndexRef.current = 0;
    setStepIndex(0);
  }, [algorithm, initialArray]);

  // Continuous playback loop using ref tracking
  const startPlaybackLoop = useCallback(() => {
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
    }

    isPlayingRef.current = true;
    setIsPlaying(true);

    const interval = Math.max(16, Math.round(400 / speed));

    playbackTimerRef.current = window.setInterval(() => {
      if (!isPlayingRef.current) return;

      const total = stepsRef.current.length;
      if (stepIndexRef.current < total - 1) {
        const next = stepIndexRef.current + 1;
        stepIndexRef.current = next;
        setStepIndex(next);

        const currentStep = stepsRef.current[next];
        if (currentStep) {
          if (currentStep.type === 'compare' && currentStep.indices.length > 0) {
            const val = currentStep.array[currentStep.indices[0]] || 40;
            sound.playComparisonTone(val);
          } else if (currentStep.type === 'swap' && currentStep.indices.length >= 2) {
            const valA = currentStep.array[currentStep.indices[0]] || 40;
            const valB = currentStep.array[currentStep.indices[1]] || 40;
            sound.playSwapTone(valA, valB);
          }
        }
      } else {
        // Complete
        if (playbackTimerRef.current) {
          clearInterval(playbackTimerRef.current);
          playbackTimerRef.current = null;
        }
        isPlayingRef.current = false;
        setIsPlaying(false);
        sound.playVictoryChime();
      }
    }, interval);
  }, [speed]);

  const stopPlayback = useCallback(() => {
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
  }, []);

  // Update speed dynamically if already playing
  useEffect(() => {
    if (isPlayingRef.current) {
      startPlaybackLoop();
    }
    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, [speed, startPlaybackLoop]);

  // Handle Play/Pause
  const handleTogglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      if (stepIndexRef.current >= stepsRef.current.length - 1) {
        stepIndexRef.current = 0;
        setStepIndex(0);
      }
      startPlaybackLoop();
    }
  };

  // Handle Step Backward
  const handleStepBackward = () => {
    stopPlayback();
    if (stepIndex <= 0) {
      sound.playErrorSound();
      setErrorMessage('Already at step 0 (initial state). Cannot step backward.');
      return;
    }
    const prev = stepIndex - 1;
    stepIndexRef.current = prev;
    setStepIndex(prev);
  };

  // Handle Step Forward
  const handleStepForward = () => {
    stopPlayback();
    if (stepIndex >= steps.length - 1) {
      sound.playErrorSound();
      setErrorMessage('Array is already fully sorted. Click Reset or Shuffle to start over.');
      return;
    }
    const next = stepIndex + 1;
    stepIndexRef.current = next;
    setStepIndex(next);

    const step = steps[next];
    if (step && step.indices.length > 0) {
      sound.playComparisonTone(step.array[step.indices[0]] || 30);
    }
  };

  // Handle Reset to step 0
  const handleReset = () => {
    stopPlayback();
    stepIndexRef.current = 0;
    setStepIndex(0);
  };

  // Generate new array
  const handleGenerateNew = (preset: ArrayPreset, customValues?: number[]) => {
    stopPlayback();
    const newArr = generateArrayData(arraySize, preset, customValues);
    setInitialArray(newArr);
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    sound.setMuted(nextMute);
  };

  const currentStep: SortStep = steps[stepIndex] || {
    array: initialArray,
    type: 'initial',
    indices: [],
    sortedIndices: [],
    activePointers: {},
    description: 'Ready to sort.',
    pythonLineNumber: 1,
    comparisons: 0,
    swaps: 0,
    arrayAccesses: 0,
  };

  const meta = ALGORITHMS[algorithm] || ALGORITHMS.bubble;
  const maxVal = Math.max(...(currentStep.array.length > 0 ? currentStep.array : [100]), 1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Bar Navigation (Clean 2-tab view: Dynamic Visualizer & Algorithm Race) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* TAB 1: Dynamic Visualizer */}
        {activeTab === 'visualizer' && (
          <div className="flex flex-col gap-6">
            {/* Live Complexity Dashboard */}
            <ComplexityDashboard meta={meta} currentStep={currentStep} />

            {/* Interactive Stage Canvas with moving bars & fixed color spectrum */}
            <VisualizerStage
              step={currentStep}
              viewMode={viewMode}
              setViewMode={setViewMode}
              maxVal={maxVal}
            />

            {/* Comprehensive Control Deck */}
            <ControlsDeck
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onStepBackward={handleStepBackward}
              onStepForward={handleStepForward}
              onReset={handleReset}
              onGenerateNew={handleGenerateNew}
              speed={speed}
              setSpeed={setSpeed}
              arraySize={arraySize}
              setArraySize={setArraySize}
              stepIndex={stepIndex}
              totalSteps={steps.length}
              onError={(msg) => setErrorMessage(msg)}
            />
          </div>
        )}

        {/* TAB 2: Algorithm Race Mode (Runs continuously until sorted) */}
        {activeTab === 'race' && (
          <RaceMode
            initialArray={initialArray}
            onGenerateNewArray={() => handleGenerateNew('random')}
            speed={speed}
          />
        )}
      </main>

      {/* Audio & Input Error Notification Toast */}
      <ErrorToast message={errorMessage} onClose={() => setErrorMessage(null)} />

      {/* Clean footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        AlgoPulse College Project · Pure Python Algorithm Logic in <code className="text-slate-400">sorting_algorithms.py</code>
      </footer>
    </div>
  );
}
