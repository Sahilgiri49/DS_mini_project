import React, { useState } from 'react';
import { ALGORITHMS, COMPLETE_PYTHON_FILE } from '../data/pythonCode';
import { Download, Copy, Check, Terminal, BookOpen, ShieldCheck } from 'lucide-react';

interface PythonCodeViewerProps {
  currentAlgoId: string;
  activePythonLine?: number;
}

export const PythonCodeViewer: React.FC<PythonCodeViewerProps> = ({
  currentAlgoId,
  activePythonLine,
}) => {
  const [selectedAlgo, setSelectedAlgo] = useState<string>(currentAlgoId || 'bubble');
  const [viewFullFile, setViewFullFile] = useState(false);
  const [copied, setCopied] = useState(false);

  const meta = ALGORITHMS[selectedAlgo] || ALGORITHMS.bubble;
  const codeToDisplay = viewFullFile ? COMPLETE_PYTHON_FILE : meta.pythonSnippet;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeToDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
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

  const lines = codeToDisplay.split('\n');

  return (
    <div className="flex flex-col gap-6">
      {/* Overview Banner for Presentation */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              College Presentation Mode
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Zero Comments in Logic
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">Python Algorithm Source & Defense Notes</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            This code contains the pure sorting algorithms separated in <code className="text-cyan-300">sorting_algorithms.py</code> without comments, prepared specifically for direct code explanation to the professor.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg transition-colors cursor-pointer shadow-sm shadow-cyan-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download sorting_algorithms.py</span>
          </button>
        </div>
      </div>

      {/* Main Code & Explanation Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Code Viewer (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
          {/* File Tab Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-medium text-slate-200">
                {viewFullFile ? 'sorting_algorithms.py' : `${selectedAlgo}_sort.py`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewFullFile(!viewFullFile)}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                {viewFullFile ? 'Show current algorithm only' : 'View entire file'}
              </button>
            </div>
          </div>

          {/* Algorithm tabs if not full file */}
          {!viewFullFile && (
            <div className="flex items-center gap-1 px-3 py-2 bg-slate-900/40 border-b border-slate-800/80 overflow-x-auto">
              {Object.keys(ALGORITHMS).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedAlgo(key)}
                  className={`px-3 py-1 text-xs rounded-md font-mono transition-colors cursor-pointer whitespace-nowrap ${
                    selectedAlgo === key
                      ? 'bg-slate-800 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {ALGORITHMS[key].name}
                </button>
              ))}
            </div>
          )}

          {/* Code Text with line numbers and line highlights */}
          <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed max-h-[520px] overflow-y-auto">
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isHighlight =
                !viewFullFile &&
                selectedAlgo === currentAlgoId &&
                activePythonLine &&
                activePythonLine === lineNum;

              return (
                <div
                  key={idx}
                  className={`flex items-start px-2 py-0.5 rounded transition-colors ${
                    isHighlight
                      ? 'bg-cyan-500/20 text-cyan-200 border-l-2 border-cyan-400 font-semibold'
                      : 'hover:bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <span className="w-8 text-right pr-4 text-slate-600 select-none tabular-nums shrink-0">
                    {lineNum}
                  </span>
                  <span className="whitespace-pre">
                    {/* Basic keyword coloring */}
                    {line.split(/(\bdef\b|\breturn\b|\bfor\b|\bin\b|\brange\b|\blen\b|\bif\b|\belse\b|\bwhile\b|\band\b|\bnot\b|\bbreak\b|\bTrue\b|\bFalse\b)/g).map((token, tIdx) => {
                      if (/^(def|return|for|in|if|else|while|and|not|break)$/.test(token)) {
                        return <span key={tIdx} className="text-fuchsia-400 font-semibold">{token}</span>;
                      }
                      if (/^(True|False)$/.test(token)) {
                        return <span key={tIdx} className="text-amber-400 font-semibold">{token}</span>;
                      }
                      if (/^(range|len)$/.test(token)) {
                        return <span key={tIdx} className="text-cyan-400">{token}</span>;
                      }
                      return <span key={tIdx}>{token}</span>;
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Explanation Notes for Presenting to Sir (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">
                How to Explain {meta.name} to Sir
              </h3>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Core Concept
              </span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                {meta.sirExplanation.coreConcept}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                Loop Invariant (Key College Defense Point)
              </span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3 rounded-lg border border-slate-800 font-mono">
                {meta.sirExplanation.loopInvariant}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                Likely Questions from Professor
              </span>
              <div className="flex flex-col gap-2.5">
                {meta.sirExplanation.vivaQuestions.map((qa, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 flex flex-col gap-1.5"
                  >
                    <div className="text-xs font-semibold text-white">
                      Q: {qa.question}
                    </div>
                    <div className="text-xs text-slate-400 leading-relaxed">
                      A: {qa.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
