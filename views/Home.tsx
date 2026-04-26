
import React, { useState, useEffect } from 'react';
import { TaskType, HistoryItem, SavedItem } from '../types';
import { Button } from '../components/Button';
import { getItemsDueForReview } from '../services/srsService';

interface HomeProps {
  onSelectTask: (type: TaskType) => void;
  onStartCustomTask: (type: TaskType, prompt: string) => void;
  onOpenTopicBank: () => void;
  onOpenNotebook: () => void;
  onOpenExamLibrary: () => void;
  onOpenSmartReview: () => void;
  history: HistoryItem[];
  savedItems?: SavedItem[];
  onViewHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const Home: React.FC<HomeProps> = ({ 
  onSelectTask, 
  onStartCustomTask, 
  onOpenTopicBank,
  onOpenNotebook,
  onOpenExamLibrary,
  onOpenSmartReview,
  history, 
  savedItems = [],
  onViewHistory, 
  onClearHistory 
}) => {
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customType, setCustomType] = useState<TaskType>(TaskType.InformalLetter);
  const [customPrompt, setCustomPrompt] = useState('');
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    if (savedItems) {
      setDueCount(getItemsDueForReview(savedItems).length);
    }
  }, [savedItems]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCustomSubmit = () => {
    if (customPrompt.trim()) {
      onStartCustomTask(customType, customPrompt);
      setIsCustomModalOpen(false);
      setCustomPrompt('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleCustomSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 pb-12">
      <div className="space-y-4 max-w-2xl text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Master Your <span className="text-indigo-600 dark:text-indigo-400">B1 English</span>
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Prepare for the Cambridge B1 Preliminary exam with AI-powered feedback and real exam topics.
        </p>
      </div>

      <div className="flex flex-wrap w-full max-w-5xl justify-center sm:justify-end px-4 -mb-4 gap-4 sm:gap-6">
         <button 
          onClick={onOpenExamLibrary}
          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-1.5 rounded-lg transition-colors"
        >
          <span className="text-xl">🏛️</span>
          Exam Library
        </button>
        <button 
          onClick={onOpenNotebook}
          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-1.5 rounded-lg transition-colors"
        >
          <span className="text-xl">📓</span>
          Notebook
        </button>
        <button 
          onClick={onOpenTopicBank}
          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-1.5 rounded-lg transition-colors"
        >
          <span className="text-xl">📚</span>
          Topics
        </button>
      </div>

      {/* Review Banner if items due */}
      {dueCount > 0 && (
        <div className="w-full max-w-2xl animate-in slide-in-from-top-4">
          <button 
            onClick={onOpenSmartReview}
            className="w-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white p-4 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg">Daily Review Ready</h3>
                <p className="text-indigo-100 text-sm">You have {dueCount} structures to practice!</p>
              </div>
            </div>
            <div className="flex items-center gap-2 font-semibold group-hover:gap-3 transition-all">
              Start Now <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-4">
        {/* Informal Letter Card */}
        <div className="group relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Part 1: Letter</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">Email to a friend. Answer 3 distinct points. (~100w)</p>
          <Button variant="outline" fullWidth onClick={() => onSelectTask(TaskType.InformalLetter)} className="text-sm">
            Random Letter
          </Button>
        </div>

        {/* Essay Card */}
        <div className="group relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Part 2: Essay</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">Write a paragraph (Cause/Effect, Solution, etc). (~100w)</p>
          <Button variant="outline" fullWidth onClick={() => onSelectTask(TaskType.Essay)} className="text-sm">
            Random Essay
          </Button>
        </div>

        {/* Translation Card */}
        <div className="group relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Translation</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">Translate Vietnamese text to English. Improve accuracy.</p>
          <Button variant="outline" fullWidth onClick={() => onSelectTask(TaskType.Translation)} className="text-sm">
            Random Topic
          </Button>
        </div>

        {/* Custom Topic Card */}
        <div className="group relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-400 to-purple-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Custom Task</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">Have a specific homework or text? Paste it here.</p>
          <Button 
            variant="outline" 
            fullWidth 
            onClick={() => setIsCustomModalOpen(true)}
            className="border-violet-200 hover:border-violet-500 hover:text-violet-600 dark:border-slate-600 dark:hover:border-violet-400 dark:hover:text-violet-400 text-sm"
          >
            Paste Input
          </Button>
        </div>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="w-full max-w-4xl animate-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
              Recent Activity
            </h3>
            <button 
              onClick={onClearHistory}
              className="text-xs text-slate-400 hover:text-rose-500 transition-colors"
            >
              Clear History
            </button>
          </div>
          
          <div className="space-y-3">
            {history.map((item) => (
              <div 
                key={item.id}
                onClick={() => onViewHistory(item)}
                className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer transition-all hover:translate-x-1 group"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.taskType === TaskType.InformalLetter 
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' 
                          : item.taskType === TaskType.Essay 
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
                      }`}>
                        {item.taskType === TaskType.InformalLetter ? 'Letter' : item.taskType === TaskType.Essay ? 'Essay' : 'Translation'}
                      </span>
                      <span className="text-xs text-slate-400">{formatDate(item.timestamp)}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-1 mb-1">
                      {item.promptText}
                    </p>
                  </div>
                  
                  <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-full shrink-0 font-bold text-sm ${
                    item.feedback.score >= 8 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' 
                      : item.feedback.score >= 5 
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' 
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                  }`}>
                    {item.feedback.score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Task Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsCustomModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Custom Task</h3>
              <button onClick={() => setIsCustomModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Task Type</label>
                <div className="flex gap-2">
                  <label className={`flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl border-2 cursor-pointer transition-all ${customType === TaskType.InformalLetter ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 text-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                    <input 
                      type="radio" 
                      name="taskType" 
                      className="hidden"
                      checked={customType === TaskType.InformalLetter}
                      onChange={() => setCustomType(TaskType.InformalLetter)}
                    />
                    <span className="font-medium text-sm">Letter</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl border-2 cursor-pointer transition-all ${customType === TaskType.Essay ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-400 text-emerald-700 dark:text-emerald-300' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                    <input 
                      type="radio" 
                      name="taskType" 
                      className="hidden"
                      checked={customType === TaskType.Essay}
                      onChange={() => setCustomType(TaskType.Essay)}
                    />
                    <span className="font-medium text-sm">Essay</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl border-2 cursor-pointer transition-all ${customType === TaskType.Translation ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-400 text-amber-700 dark:text-amber-300' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                    <input 
                      type="radio" 
                      name="taskType" 
                      className="hidden"
                      checked={customType === TaskType.Translation}
                      onChange={() => setCustomType(TaskType.Translation)}
                    />
                    <span className="font-medium text-sm">Translation</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {customType === TaskType.Translation ? 'Vietnamese Text to Translate' : 'Prompt / Topic'}
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none h-32"
                  placeholder={customType === TaskType.Translation 
                    ? "Nhập đoạn văn tiếng Việt bạn muốn dịch sang tiếng Anh..." 
                    : "Paste your topic here (e.g., 'Write a letter to your friend...')"}
                  autoFocus
                />
              </div>

              <div className="pt-2">
                <Button 
                  onClick={handleCustomSubmit} 
                  fullWidth
                  disabled={!customPrompt.trim()}
                  title="Press Ctrl + Enter"
                >
                  Start Practice
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
