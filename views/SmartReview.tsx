
import React, { useState, useEffect } from 'react';
import { SavedItem, SRSData } from '../types';
import { calculateNextReview, checkPracticeSentence } from '../services/srsService';
import { Button } from '../components/Button';

interface SmartReviewProps {
  items: SavedItem[];
  onUpdateItem: (updatedItem: SavedItem) => void;
  onBack: () => void;
}

export const SmartReview: React.FC<SmartReviewProps> = ({ items, onUpdateItem, onBack }) => {
  const [sessionItems, setSessionItems] = useState<SavedItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [practiceSentence, setPracticeSentence] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize session queue once on mount
    const now = Date.now();
    const due = items.filter(item => !item.srs || item.srs.nextReviewDate <= now);
    // Sort: New items first, then by date
    due.sort((a, b) => {
        if (!a.srs && b.srs) return -1;
        if (a.srs && !b.srs) return 1;
        return (a.srs?.nextReviewDate || 0) - (b.srs?.nextReviewDate || 0);
    });
    setSessionItems(due);
    setInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once to create a stable session

  const currentItem = sessionItems[currentIndex];

  const handleCheckSentence = async () => {
    if (!practiceSentence.trim()) return;
    setIsChecking(true);
    const result = await checkPracticeSentence(currentItem.content, practiceSentence);
    setFeedback({ isCorrect: result.isCorrect, message: result.feedback });
    setIsChecking(false);
    setShowAnswer(true); 
  };

  const handleRate = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    const currentLevel = currentItem.srs?.level || 0;
    const srsData = calculateNextReview(currentLevel, rating);
    
    const updatedItem: SavedItem = {
      ...currentItem,
      srs: srsData
    };
    
    // Update global state
    onUpdateItem(updatedItem);

    // Move to next item in local session
    if (currentIndex < sessionItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
      setPracticeSentence('');
      setFeedback(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!showAnswer && !isChecking && practiceSentence.trim()) {
        handleCheckSentence();
      }
    }
  };

  // Global shortcuts for rating
  useEffect(() => {
    if (!showAnswer) return;

    const handleRatingKey = (e: KeyboardEvent) => {
      // Avoid interfering if user is typing in some input (unlikely here as textarea is disabled)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; 
      }

      switch(e.key) {
        case '1': handleRate('again'); break;
        case '2': handleRate('hard'); break;
        case '3': handleRate('good'); break;
        case '4': handleRate('easy'); break;
      }
    };

    window.addEventListener('keydown', handleRatingKey);
    return () => window.removeEventListener('keydown', handleRatingKey);
  }, [showAnswer, currentIndex, sessionItems]); // Dependencies to ensure handleRate uses correct state

  if (!initialized) {
    return <div className="flex items-center justify-center min-h-[60vh]">Loading session...</div>;
  }

  if (sessionItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in zoom-in-95">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-4xl">
          🎉
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">All Caught Up!</h2>
        <p className="text-slate-600 dark:text-slate-300 text-center max-w-md">
          You have no items due for review right now. Come back later to strengthen your memory!
        </p>
        <Button onClick={onBack}>Back to Home</Button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in zoom-in-95">
        <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-4xl">
          💪
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Session Complete!</h2>
        <p className="text-slate-600 dark:text-slate-300 text-center">
          You reviewed {sessionItems.length} items. Keep up the great work!
        </p>
        <Button onClick={onBack}>Back to Home</Button>
      </div>
    );
  }

  // Safety check for currentItem
  if (!currentItem) {
     return <div>Something went wrong. Please restart the session.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 min-h-[80vh] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-700 dark:text-slate-400">
           Close
        </button>
        <div className="text-sm font-bold text-slate-400">
           {currentIndex + 1} / {sessionItems.length}
        </div>
      </div>

      <div className="flex-1 flex flex-col relative perspective-1000">
         {/* Card Content */}
         <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 flex flex-col gap-6 relative overflow-hidden transition-all">
            <div className={`absolute top-0 left-0 w-full h-1.5 ${currentItem.type === 'structure' ? 'bg-violet-500' : 'bg-blue-500'}`}></div>
            
            <div className="space-y-2 text-center">
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  currentItem.type === 'structure' 
                  ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' 
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              }`}>
                {currentItem.type === 'structure' ? 'Build a Sentence' : 'Define & Use'}
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-4">{currentItem.content}</h2>
              {currentItem.note && (
                 <p className="text-slate-500 dark:text-slate-400 italic text-sm">{currentItem.note}</p>
              )}
            </div>

            <div className="mt-4 border-t border-slate-100 dark:border-slate-700 pt-6">
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                 {currentItem.type === 'structure' 
                   ? 'Practice: Write a sentence using this structure.' 
                   : 'Practice: Write a sentence using this word.'}
               </label>
               <textarea
                 value={practiceSentence}
                 onChange={(e) => setPracticeSentence(e.target.value)}
                 onKeyDown={handleKeyDown}
                 disabled={showAnswer}
                 className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24 transition-colors"
                 placeholder="Type your sentence here..."
               />
               
               {/* Feedback Section */}
               {feedback && (
                 <div className={`mt-4 p-4 rounded-xl border ${
                   feedback.isCorrect 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300'
                 } animate-in fade-in slide-in-from-top-2`}>
                   <div className="flex items-center gap-2 font-bold mb-1">
                     {feedback.isCorrect ? (
                       <><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Correct Usage!</>
                     ) : (
                       <><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg> Needs Improvement</>
                     )}
                   </div>
                   <p className="text-sm">{feedback.message}</p>
                 </div>
               )}

               {!showAnswer && (
                  <Button 
                    fullWidth 
                    className="mt-4" 
                    onClick={handleCheckSentence}
                    disabled={isChecking || !practiceSentence.trim()}
                    title="Press Enter"
                  >
                    {isChecking ? 'Checking...' : 'Check My Sentence'}
                  </Button>
               )}
            </div>

            {showAnswer && (
               <div className="pt-2 animate-in fade-in slide-in-from-bottom-4">
                  <p className="text-center text-sm text-slate-500 mb-3 font-medium">How difficult was this for you?</p>
                  <div className="grid grid-cols-4 gap-2">
                    <button onClick={() => handleRate('again')} className="relative p-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-sm font-bold transition-colors">
                      <span className="absolute top-1 right-1.5 text-[10px] opacity-40 font-mono border border-current px-0.5 rounded">1</span>
                      Again<br/><span className="text-[10px] font-normal opacity-70">1m</span>
                    </button>
                    <button onClick={() => handleRate('hard')} className="relative p-2 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-800 text-sm font-bold transition-colors">
                      <span className="absolute top-1 right-1.5 text-[10px] opacity-40 font-mono border border-current px-0.5 rounded">2</span>
                      Hard<br/><span className="text-[10px] font-normal opacity-70">2d</span>
                    </button>
                    <button onClick={() => handleRate('good')} className="relative p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-bold transition-colors">
                      <span className="absolute top-1 right-1.5 text-[10px] opacity-40 font-mono border border-current px-0.5 rounded">3</span>
                      Good<br/><span className="text-[10px] font-normal opacity-70">4d</span>
                    </button>
                    <button onClick={() => handleRate('easy')} className="relative p-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-sm font-bold transition-colors">
                      <span className="absolute top-1 right-1.5 text-[10px] opacity-40 font-mono border border-current px-0.5 rounded">4</span>
                      Easy<br/><span className="text-[10px] font-normal opacity-70">7d</span>
                    </button>
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};
