import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { improveSentence } from '../services/geminiService';
import { SentenceImprovement } from '../types';

interface QuickAssistModalProps {
  initialText: string;
  onClose: () => void;
  onApply: (newText: string) => void;
}

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const QuickAssistModal: React.FC<QuickAssistModalProps> = ({ initialText, onClose, onApply }) => {
  const [inputText, setInputText] = useState(initialText);
  const [result, setResult] = useState<SentenceImprovement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If text was passed in, automatically analyze it if it's long enough
    if (initialText && initialText.trim().length > 3) {
      handleAnalyze();
    }
  }, []); // Only run on mount

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await improveSentence(inputText);
      setResult(data);
    } catch (err) {
      setError("Failed to improve sentence. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter (or Cmd+Enter)
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!loading && inputText.trim()) {
        handleAnalyze();
      }
    }
  };

  const renderDiffMarkup = (markup: string) => {
    // Regex to match [-...-] or {+...+}
    // We used a non-greedy match (.*?) to handle multiple tags on one line correctly
    const regex = /\[-(.*?)-\]|{\+(.*?)\+}/g;
    let lastIndex = 0;
    const parts = [];
    let match;

    while ((match = regex.exec(markup)) !== null) {
      // Text before the match
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${lastIndex}`}>{markup.substring(lastIndex, match.index)}</span>);
      }

      if (match[1]) { // Deletion [-...-]
        parts.push(
          <span key={`del-${match.index}`} className="line-through text-rose-500 dark:text-rose-400 mx-1 decoration-2 opacity-80">
            {match[1]}
          </span>
        );
      } else if (match[2]) { // Addition {+...+}
        parts.push(
          <span key={`add-${match.index}`} className="font-bold text-emerald-600 dark:text-emerald-400 mx-1 bg-emerald-50 dark:bg-emerald-900/30 px-1 rounded">
            {match[2]}
          </span>
        );
      }

      lastIndex = regex.lastIndex;
    }

    // Remaining text
    if (lastIndex < markup.length) {
      parts.push(<span key={`text-end`}>{markup.substring(lastIndex)}</span>);
    }

    return parts;
  };

  // Fallback if diffMarkup is missing (backwards compatibility)
  const renderHighlightedText = (text: string, highlights: string[]) => {
    if (!highlights || highlights.length === 0) return text;
    const validHighlights = highlights
      .filter(h => h && h.trim().length > 0)
      .map(escapeRegExp)
      .sort((a, b) => b.length - a.length);
    if (validHighlights.length === 0) return text;
    const pattern = new RegExp(`(${validHighlights.join('|')})`, 'gi');
    const parts = text.split(pattern);
    return parts.map((part, index) => {
      const isHighlight = validHighlights.some(h => new RegExp(`^${h}$`, 'i').test(part));
      if (isHighlight) {
        return (
          <span key={index} className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-1 rounded-md font-bold mx-0.5">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <span className="text-xl">✨</span> Magic Improver
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Your Sentence
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none h-24 text-base"
              placeholder="Type or paste a sentence here..."
              autoFocus={!initialText}
            />
            <div className="flex justify-end">
               <Button 
                onClick={handleAnalyze} 
                disabled={loading || !inputText.trim()}
                className="py-2 px-4 text-sm"
                title="Press Ctrl + Enter"
              >
                {loading ? 'Analyzing...' : 'Fix & Improve'}
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-rose-600 bg-rose-50 dark:bg-rose-900/30 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Result Section */}
          {result && !loading && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Spelling Corrections - Optional now as diff shows it, but kept for details */}
              {result.spellingCorrections && result.spellingCorrections.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="m18 5-3-3H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2"/></svg>
                     <span className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400">Spelling Checks</span>
                  </div>
                  <ul className="space-y-1">
                    {result.spellingCorrections.map((fix, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        <span className="line-through text-rose-500/70">{fix.original}</span>
                        <span>→</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{fix.correction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improved Version with Diff View */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4">
                <label className="text-xs font-semibold uppercase text-indigo-600 dark:text-indigo-300 mb-2 block">
                  Correction Preview
                </label>
                <div className="text-lg font-medium text-slate-800 dark:text-indigo-100 mb-2 leading-relaxed">
                  {result.diffMarkup 
                    ? renderDiffMarkup(result.diffMarkup)
                    : renderHighlightedText(result.improved, result.highlightedChanges)
                  }
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                  <span className="font-semibold text-indigo-700 dark:text-indigo-300">Tutor Note:</span> {result.explanation}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={() => onApply(result.improved)}
                  fullWidth
                  variant="secondary"
                >
                  Apply Changes
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};