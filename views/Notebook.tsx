
import React, { useState } from 'react';
import { SavedItem } from '../types';
import { Button } from '../components/Button';

interface NotebookProps {
  items: SavedItem[];
  onRemoveItem: (id: string) => void;
  onBack: () => void;
}

export const Notebook: React.FC<NotebookProps> = ({ items, onRemoveItem, onBack }) => {
  const [filter, setFilter] = useState<'all' | 'vocabulary' | 'structure'>('all');

  const filteredItems = items.filter(item => filter === 'all' || item.type === filter);

  // Sort by date (newest first)
  filteredItems.sort((a, b) => b.date - a.date);

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto min-h-[80vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="space-y-1">
          <button 
            onClick={onBack}
            className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-medium flex items-center gap-1 transition-colors mb-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Home
          </button>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-3xl">📓</span> My Notebook
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Your collection of useful words and structures saved from practice sessions.
          </p>
        </div>

        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          {(['all', 'structure', 'vocabulary'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-3xl">
            📝
          </div>
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">No items saved yet</h3>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm">
            When you view your results or check the outline, click the bookmark icon <span className="inline-block"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg></span> to save useful structures and vocabulary here.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className={`p-5 rounded-xl border transition-all hover:shadow-md flex flex-col h-full ${
                item.type === 'structure' 
                  ? 'bg-violet-50 dark:bg-violet-900/10 border-violet-100 dark:border-violet-800/30'
                  : 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/30'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  item.type === 'structure'
                    ? 'bg-violet-200 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300'
                    : 'bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                }`}>
                  {item.type}
                </span>
                <button 
                  onClick={() => onRemoveItem(item.id)}
                  className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                  title="Remove"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>

              <div className={`font-bold text-lg mb-2 ${
                item.type === 'structure' ? 'font-mono text-violet-700 dark:text-violet-300' : 'text-blue-700 dark:text-blue-300'
              }`}>
                {item.content}
              </div>

              {item.note && (
                <p className="text-sm text-slate-600 dark:text-slate-400 italic border-l-2 border-slate-300 dark:border-slate-600 pl-3 mb-4">
                  {item.note}
                </p>
              )}
              
              <div className="mt-auto pt-3 border-t border-slate-200 dark:border-slate-700/50 flex flex-col gap-1">
                {item.source && (
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1" title={item.source}>
                    <span className="font-semibold">Source: </span> {item.source}
                  </div>
                )}
                <div className="text-[10px] text-slate-400 text-right">
                  Saved: {new Date(item.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
