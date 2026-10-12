import React from 'react';
import { Download, Volume2, VolumeX, Flame, BarChart3 } from 'lucide-react';
import { COMPLETE_PYTHON_FILE } from '../data/pythonCode';

interface HeaderProps {
  activeTab: 'visualizer' | 'race';
  setActiveTab: (tab: 'visualizer' | 'race') => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  onToggleMute,
}) => {
  const handleDownloadPython = () => {
    const blob = new Blob([COMPLETE_PYTHON_FILE], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sorting_algorithms.py');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Brand wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a href="/" className="text-xl font-bold tracking-tight text-white whitespace-nowrap flex items-center gap-2">
          <span className="text-cyan-400 font-mono text-2xl font-black">&lt;/&gt;</span>
          <span>AlgoPulse</span>
        </a>
      </div>

      {/* Zone 2: Navigation Links (Clean 2-tab view requested by user) */}
      <nav className="flex items-center gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('visualizer')}
          className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 py-1.5 px-3 rounded-lg cursor-pointer ${
            activeTab === 'visualizer'
              ? 'text-cyan-300 font-semibold bg-cyan-950/50 border border-cyan-800/60 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Dynamic Visualizer</span>
        </button>
        <button
          onClick={() => setActiveTab('race')}
          className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 py-1.5 px-3 rounded-lg cursor-pointer ${
            activeTab === 'race'
              ? 'text-rose-300 font-semibold bg-rose-950/50 border border-rose-800/60 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Flame className="w-4 h-4 text-rose-400" />
          <span>Algorithm Race</span>
        </button>
      </nav>

      {/* Zone 3: Primary Action & Sound control */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
            isMuted
              ? 'border-slate-800 text-slate-500 hover:text-slate-300'
              : 'border-cyan-500/30 text-cyan-400 bg-cyan-950/30 hover:bg-cyan-900/40'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <button
          onClick={handleDownloadPython}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-cyan-500/20 cursor-pointer"
          title="Download the standalone comment-free Python sorting algorithms file"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download .py File</span>
        </button>
      </div>
    </header>
  );
};
