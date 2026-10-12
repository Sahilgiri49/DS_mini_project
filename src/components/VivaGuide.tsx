import React, { useState } from 'react';
import { ALGORITHMS } from '../data/pythonCode';
import { GraduationCap, CheckCircle2, HelpCircle, Terminal, Cpu } from 'lucide-react';

export const VivaGuide: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'comparison' | 'questions' | 'execution'>('comparison');

  const vivaQuestions = [
    {
      q: 'Why is Merge Sort preferred over Quick Sort for sorting Linked Lists?',
      a: 'In linked lists, nodes can be easily merged in O(1) extra space simply by updating pointers, eliminating Merge Sort’s usual O(n) space overhead. Quick Sort requires random access for efficient partitioning, which linked lists lack (O(n) traversal).',
    },
    {
      q: 'What is a Loop Invariant and how do we use it in algorithm proofs?',
      a: 'A loop invariant is a formal property of the program that remains true before each iteration of a loop. It is verified in three steps: Initialization (true before loop starts), Maintenance (if true before an iteration, remains true before the next), and Termination (provides a useful property that proves algorithm correctness when loop ends).',
    },
    {
      q: 'Why is Insertion Sort faster in practice on small arrays (e.g. n < 20) than Merge Sort or Quick Sort?',
      a: 'Insertion Sort has very low constant factors and no recursion overhead. It executes tight loops in-place with minimal memory cache misses, which is why standard library sorts like Timsort use Insertion Sort for small partitions.',
    },
    {
      q: 'Can any comparison-based sorting algorithm beat O(n log n) in the worst case?',
      a: 'No. The decision tree lower bound proves that any comparison sort on n elements requires at least log2(n!) comparisons, which by Stirling’s approximation is Ω(n log n). Non-comparison sorts like Radix Sort can achieve O(n) by exploiting integer digit keys.',
    },
    {
      q: 'What makes an algorithm "Stable"? Give an example where stability matters.',
      a: 'An algorithm is stable if it preserves the relative order of elements that have equal sorting keys. For example, if sorting a student roster by grade where names are already alphabetically sorted, a stable sort ensures students with the same grade remain in alphabetical order.',
    },
    {
      q: 'How does the Python file sorting_algorithms.py structure its logic without comments?',
      a: 'The functions use standard idiomatic Python with clean identifier names (n, min_idx, key, mid, left_half, right_half) and follow standard academic textbook implementations so the student can explain every single line verbally during viva without relying on written comments.',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" /> College Project Viva & Defense
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">Algorithm Theory & Viva Examination Preparation</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Key theorems, complexity matrices, and standard oral examination questions for presenting to your professor.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveCategory('comparison')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeCategory === 'comparison'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Comparative Matrix
          </button>
          <button
            onClick={() => setActiveCategory('questions')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeCategory === 'questions'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Professor Viva Q&A
          </button>
          <button
            onClick={() => setActiveCategory('execution')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeCategory === 'execution'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Terminal Execution Guide
          </button>
        </div>
      </div>

      {/* Category 1: Comprehensive Comparison Matrix */}
      {activeCategory === 'comparison' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 bg-slate-950/50">
            <h3 className="text-sm font-semibold text-white">Sorting Algorithm Complexity & Properties</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Standard asymptotic bounds and behavioral classifications.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5 font-semibold text-slate-300">Algorithm</th>
                  <th className="p-3.5 font-semibold">Best Time</th>
                  <th className="p-3.5 font-semibold">Average Time</th>
                  <th className="p-3.5 font-semibold">Worst Time</th>
                  <th className="p-3.5 font-semibold">Aux Space</th>
                  <th className="p-3.5 font-semibold">Stable</th>
                  <th className="p-3.5 font-semibold">In-Place</th>
                  <th className="p-3.5 font-semibold">Method / Paradigm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3.5 font-semibold text-cyan-400">Bubble Sort</td>
                  <td className="p-3.5 text-emerald-400">O(n)</td>
                  <td className="p-3.5 text-amber-400">O(n²)</td>
                  <td className="p-3.5 text-rose-400">O(n²)</td>
                  <td className="p-3.5">O(1)</td>
                  <td className="p-3.5 text-emerald-400">Yes</td>
                  <td className="p-3.5 text-emerald-400">Yes</td>
                  <td className="p-3.5 text-slate-400">Adjacent Swapping</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3.5 font-semibold text-cyan-400">Selection Sort</td>
                  <td className="p-3.5 text-rose-400">O(n²)</td>
                  <td className="p-3.5 text-amber-400">O(n²)</td>
                  <td className="p-3.5 text-rose-400">O(n²)</td>
                  <td className="p-3.5">O(1)</td>
                  <td className="p-3.5 text-rose-400">No</td>
                  <td className="p-3.5 text-emerald-400">Yes</td>
                  <td className="p-3.5 text-slate-400">Minimum Selection</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3.5 font-semibold text-cyan-400">Insertion Sort</td>
                  <td className="p-3.5 text-emerald-400">O(n)</td>
                  <td className="p-3.5 text-amber-400">O(n²)</td>
                  <td className="p-3.5 text-rose-400">O(n²)</td>
                  <td className="p-3.5">O(1)</td>
                  <td className="p-3.5 text-emerald-400">Yes</td>
                  <td className="p-3.5 text-emerald-400">Yes</td>
                  <td className="p-3.5 text-slate-400">Incremental Insertion</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3.5 font-semibold text-cyan-400">Merge Sort</td>
                  <td className="p-3.5 text-emerald-400">O(n log n)</td>
                  <td className="p-3.5 text-emerald-400">O(n log n)</td>
                  <td className="p-3.5 text-emerald-400">O(n log n)</td>
                  <td className="p-3.5 text-amber-400">O(n)</td>
                  <td className="p-3.5 text-emerald-400">Yes</td>
                  <td className="p-3.5 text-rose-400">No</td>
                  <td className="p-3.5 text-slate-400">Divide & Conquer</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3.5 font-semibold text-cyan-400">Quick Sort</td>
                  <td className="p-3.5 text-emerald-400">O(n log n)</td>
                  <td className="p-3.5 text-emerald-400">O(n log n)</td>
                  <td className="p-3.5 text-rose-400">O(n²)</td>
                  <td className="p-3.5 text-emerald-400">O(log n)</td>
                  <td className="p-3.5 text-rose-400">No</td>
                  <td className="p-3.5 text-emerald-400">Yes</td>
                  <td className="p-3.5 text-slate-400">Partitioning</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category 2: Professor Viva Q&A */}
      {activeCategory === 'questions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vivaQuestions.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm flex flex-col gap-2.5"
            >
              <div className="flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <h4 className="text-sm font-semibold text-white leading-snug">{item.q}</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-6 border-l border-slate-800/80">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Category 3: Terminal Execution Guide */}
      {activeCategory === 'execution' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-sm flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">
              How to Run sorting_algorithms.py in Python Terminal
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            If your professor requests to see the Python code run directly in a standard Python shell or terminal without the web browser, use these exact commands:
          </p>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 flex flex-col gap-2">
            <div className="text-slate-500"># 1. Download or locate sorting_algorithms.py in current directory</div>
            <div className="text-cyan-400">$ python3 sorting_algorithms.py</div>
            <div className="text-slate-500 pt-2"># 2. Output produced by the executable block:</div>
            <div className="text-slate-400">Original: [64, 34, 25, 12, 22, 11, 90]</div>
            <div className="text-emerald-400">Bubble Sort: [11, 12, 22, 25, 34, 64, 90]</div>
            <div className="text-emerald-400">Selection Sort: [11, 12, 22, 25, 34, 64, 90]</div>
            <div className="text-emerald-400">Insertion Sort: [11, 12, 22, 25, 34, 64, 90]</div>
            <div className="text-emerald-400">Merge Sort: [11, 12, 22, 25, 34, 64, 90]</div>
            <div className="text-emerald-400">Quick Sort: [11, 12, 22, 25, 34, 64, 90]</div>
          </div>

          <div className="bg-cyan-950/30 border border-cyan-800/40 rounded-lg p-4 text-xs text-cyan-200 leading-relaxed">
            <span className="font-semibold text-cyan-300">College Viva Tip:</span> The logic does not contain comments so that when you project or show the code to the professor, you can explain each variable (<code className="text-white">swapped</code>, <code className="text-white">min_idx</code>, <code className="text-white">key</code>, <code className="text-white">mid</code>) in your own words, showing true conceptual mastery of the data structures and algorithms syllabus!
          </div>
        </div>
      )}
    </div>
  );
};
