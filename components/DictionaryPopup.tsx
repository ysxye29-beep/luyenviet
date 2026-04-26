import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { lookupWord } from '../services/geminiService';
import { DictionaryResult, SavedItem } from '../types';
import { Volume2, Bookmark, BookmarkCheck, X, Loader2 } from 'lucide-react';

interface DictionaryPopupProps {
  word: string;
  onClose: () => void;
  onSave: (item: Omit<SavedItem, 'id' | 'date'>) => void;
  isSaved?: boolean;
}

export const DictionaryPopup: React.FC<DictionaryPopupProps> = ({ word, onClose, onSave, isSaved = false }) => {
  const [data, setData] = useState<DictionaryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await lookupWord(word);
        setData(result);
      } catch (err) {
        setError("Could not find definition.");
      } finally {
        setLoading(false);
      }
    };

    if (word) fetchData();
  }, [word]);

  const handleSave = () => {
    if (!data) return;
    onSave({
      type: 'word',
      content: data.word,
      source: 'Dictionary Lookup',
      meaning: data.vietnameseDefinition,
      phonetic: data.phonetic,
      example: data.example
    });
  };

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-[100]"
    >
      <div className="bg-white dark:bg-slate-800 border-2 border-indigo-500 shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-4 relative">
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="animate-spin text-indigo-500 mb-2" size={32} />
              <p className="text-slate-500 dark:text-slate-400 font-medium">Looking up "{word}"...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-red-500 font-medium">{error}</p>
              <button 
                onClick={onClose}
                className="mt-2 text-indigo-500 hover:underline"
              >
                Close
              </button>
            </div>
          ) : data && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
                    {data.word}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">
                      {data.phonetic}
                    </span>
                    <button 
                      onClick={speak}
                      className="p-1 text-slate-400 hover:text-indigo-500 transition-colors"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                </div>
                {!isSaved && (
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all border border-indigo-100 dark:border-indigo-800"
                  >
                    <Bookmark size={16} />
                    Save Word
                  </button>
                )}
                {isSaved && (
                  <div className="flex items-center gap-2 px-3 py-1.5 text-green-600 dark:text-green-400 font-semibold">
                    <BookmarkCheck size={16} />
                    Saved
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-slate-700 dark:text-slate-200">
                  <span className="font-bold text-indigo-500 dark:text-indigo-400 underline underline-offset-4 mr-2">Meaning:</span>
                  {data.vietnameseDefinition}
                </p>
                <p className="text-slate-600 dark:text-slate-300 italic text-sm leading-relaxed">
                  "{data.definition}"
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Example</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {data.example}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
