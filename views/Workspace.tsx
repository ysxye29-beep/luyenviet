
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../components/Button';
import { WordCounter } from '../components/WordCounter';
import { QuickAssistModal } from '../components/QuickAssistModal';
import { TaskType, WritingTask, InlineSuggestion, OutlineSection, SavedItem, AppliedCorrection } from '../types';
import { quickCheckText, generateOutline, generateModelAnswer } from '../services/geminiService';

interface WorkspaceProps {
  task: WritingTask | null;
  text: string;
  outline: OutlineSection[]; // Outline passed from App state
  isSubmitting: boolean;
  onTextChange: (text: string) => void;
  onOutlineChange: (outline: OutlineSection[]) => void; // Handler to update outline in App state
  onSubmit: (timeSpentSeconds: number) => void; // UPDATED: Accepts time spent
  onBack: () => void;
  onSaveItem: (item: Omit<SavedItem, 'id' | 'date'>) => void;
  onRegisterCorrection: (correction: Omit<AppliedCorrection, 'id' | 'timestamp'>) => void;
  onLookup?: (word: string) => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({ 
  task, 
  text, 
  outline,
  isSubmitting, 
  onTextChange, 
  onOutlineChange,
  onSubmit,
  onBack,
  onSaveItem,
  onRegisterCorrection,
  onLookup
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [showAssist, setShowAssist] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  
  // Timer State
  const [seconds, setSeconds] = useState(0);

  const renderClickableText = (content: string) => {
    if (!onLookup) return content;
    const words = content.split(/(\s+)/);
    return words.map((part, i) => {
      if (part.trim() === '') return part;
      return (
        <span 
          key={i} 
          onClick={() => onLookup(part)}
          className="hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-help transition-colors rounded-sm px-px"
        >
          {part}
        </span>
      );
    });
  };

  // State for Quick Check feature
  const [suggestions, setSuggestions] = useState<InlineSuggestion[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckedText, setLastCheckedText] = useState('');

  // State for Outline generation status
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);

  // State for showing Model Answer
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [generatedSample, setGeneratedSample] = useState<string | null>(null);
  const [isGeneratingSample, setIsGeneratingSample] = useState(false);

  useEffect(() => {
    // Auto-focus textarea on mount
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Timer Logic
  useEffect(() => {
    // Stop timer when submitting
    if (isSubmitting) return;

    const timerInterval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isSubmitting]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Sync scroll between textarea and backdrop
  const handleScroll = () => {
    if (textareaRef.current && backdropRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Clear suggestions if text changes significantly from checked version
  useEffect(() => {
    if (suggestions.length > 0 && Math.abs(text.length - lastCheckedText.length) > 10) {
      // Optional: Clear suggestions if user edits heavily to avoid desync
      // setSuggestions([]);
    }
  }, [text, lastCheckedText, suggestions.length]);

  const handleOpenAssist = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      if (start !== end) {
        setSelectedText(text.substring(start, end));
      } else {
        setSelectedText('');
      }
    }
    setShowAssist(true);
  };

  const handleApplyImprovement = (improvedText: string) => {
    // Register the correction before applying
    onRegisterCorrection({
      original: selectedText || "(Whole sentence)",
      correction: improvedText,
      type: 'style',
      explanation: 'Applied via Magic Rewrite'
    });

    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    
    const before = text.substring(0, start);
    const after = text.substring(end);
    const newFullText = before + improvedText + after;
    
    onTextChange(newFullText);
    setShowAssist(false);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = start + improvedText.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleQuickCheck = async () => {
    if (!text.trim() || text.length < 10) return;
    setIsChecking(true);
    setSuggestions([]);
    try {
      const results = await quickCheckText(text);
      setSuggestions(results);
      setLastCheckedText(text);
    } catch (e) {
      console.error(e);
    } finally {
      setIsChecking(false);
    }
  };

  const handleCreateOutline = async () => {
    if (!task) return;
    setIsGeneratingOutline(true);
    try {
      const result = await generateOutline(task.type, task.promptText);
      onOutlineChange(result); // Update outline in App state
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const handleViewSample = async () => {
    if (!task) return;
    
    // Toggle off if already showing
    if (showModelAnswer) {
      setShowModelAnswer(false);
      return;
    }

    // If we already have a sample (either from PDF task or previously generated), just show it
    if (task.sampleAnswer || generatedSample) {
      setShowModelAnswer(true);
      return;
    }

    // Otherwise, generate it
    setIsGeneratingSample(true);
    try {
      const sample = await generateModelAnswer(task.type, task.promptText);
      setGeneratedSample(sample);
      setShowModelAnswer(true);
    } catch (e) {
      console.error("Failed to generate sample");
    } finally {
      setIsGeneratingSample(false);
    }
  };

  const handleInsertPoint = (pointText: string) => {
    // Clean up point text
    let textToInsert = pointText;
    const prefixes = ["Start with:", "Use:", "Idea:", "Sentence:"];
    for (const prefix of prefixes) {
      if (textToInsert.startsWith(prefix)) {
        textToInsert = textToInsert.substring(prefix.length).trim();
      }
    }

    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    
    // Add space before if needed
    const prefixSpace = (start > 0 && text[start - 1] !== ' ' && text[start - 1] !== '\n') ? ' ' : '';
    
    const before = text.substring(0, start);
    const after = text.substring(end);
    const newFullText = before + prefixSpace + textToInsert + after;
    
    onTextChange(newFullText);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = start + prefixSpace.length + textToInsert.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const applySuggestion = (suggestion: InlineSuggestion) => {
    // Capture tracking
    onRegisterCorrection({
      original: suggestion.original,
      correction: suggestion.replacement,
      type: suggestion.type,
      explanation: suggestion.reason
    });

    const newText = text.replace(suggestion.original, suggestion.replacement);
    onTextChange(newText);
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const dismissSuggestion = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Check Errors on Ctrl+Enter (or Cmd+Enter)
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isChecking && text.length >= 10) {
        handleQuickCheck();
      }
    }
  };

  const handleManualSubmit = () => {
      onSubmit(seconds);
  }

  // Logic to render highlights behind the textarea
  const renderBackdrop = () => {
    if (!suggestions.length) {
      return <div className="text-transparent whitespace-pre-wrap break-words font-sans text-lg leading-relaxed">{text + ' '}</div>;
    }

    const uniqueOriginals = Array.from(new Set(suggestions.map(s => s.original))).filter((s): s is string => !!s);
    if (uniqueOriginals.length === 0) return <div className="text-transparent whitespace-pre-wrap break-words font-sans text-lg leading-relaxed">{text + ' '}</div>;

    const escapedOriginals = uniqueOriginals.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = new RegExp(`(${escapedOriginals.join('|')})`, 'g');

    const splitText = text.split(pattern);

    return (
      <div className="text-transparent whitespace-pre-wrap break-words font-sans text-lg leading-relaxed">
        {splitText.map((part, index) => {
          const matchedSuggestion = suggestions.find(s => s.original === part);
          if (matchedSuggestion) {
            let className = '';
            if (matchedSuggestion.type === 'grammar') {
              className = 'bg-rose-500/20 dark:bg-rose-500/30 border-b-2 border-rose-400/60 rounded-sm';
            } else if (matchedSuggestion.type === 'vocabulary') {
              className = 'bg-blue-500/20 dark:bg-blue-500/30 border-b-2 border-blue-400/60 rounded-sm';
            } else if (matchedSuggestion.type === 'spelling') {
              className = 'bg-amber-500/20 dark:bg-amber-500/30 border-b-2 border-amber-400/60 rounded-sm';
            } else {
              className = 'bg-slate-200/50';
            }
            return <span key={index} className={className}>{part}</span>;
          }
          return <span key={index}>{part}</span>;
        })}
        {' '} 
      </div>
    );
  };

  if (!task) return null;

  const displayedSample = task.sampleAnswer || generatedSample;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      {/* Quick Assist Modal */}
      {showAssist && (
        <QuickAssistModal 
          initialText={selectedText} 
          onClose={() => setShowAssist(false)}
          onApply={handleApplyImprovement}
        />
      )}

      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-medium flex items-center gap-1 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Home
        </button>
        <div className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${
          task.type === TaskType.Translation 
            ? 'text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30'
            : 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30'
        }`}>
          {task.type === TaskType.InformalLetter ? 'Informal Letter' : task.type === TaskType.Essay ? 'Essay' : 'Translation Practice'}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Prompt & Outline */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 sticky top-24 transition-colors max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              {task.type === TaskType.Translation ? 'Source Text (Vietnamese)' : 'The Task'}
            </h3>
            <div className={`prose prose-sm prose-slate dark:prose-invert text-slate-600 dark:text-slate-300 mb-6 ${task.type === TaskType.Translation ? 'font-serif text-base' : ''}`}>
              <p className="whitespace-pre-line leading-relaxed">{renderClickableText(task.promptText)}</p>
            </div>

            {/* Model Answer Toggle */}
            <div className="mb-6 border-t border-slate-100 dark:border-slate-700 pt-4">
              <button 
                onClick={handleViewSample}
                disabled={isGeneratingSample}
                className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
              >
                 <span>
                    {isGeneratingSample ? 'Generating Sample...' : (showModelAnswer ? 'Hide Model Answer' : 'View Model Answer')}
                 </span>
                 {isGeneratingSample ? (
                   <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                 ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showModelAnswer ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
                 )}
              </button>
              
              {showModelAnswer && displayedSample && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-100 dark:border-indigo-800 animate-in slide-in-from-top-2">
                  <p className="text-xs text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-serif">
                    {renderClickableText(displayedSample)}
                  </p>
                </div>
              )}
            </div>

            {/* Outline Section */}
            <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
               <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {outline.length > 0 ? (task.type === TaskType.Translation ? "Vocab Hints" : "Smart Outline") : "Need Help?"}
                  </h4>
               </div>

               {outline.length === 0 ? (
                 <div className="space-y-3">
                   <p className="text-xs text-slate-500 dark:text-slate-400">
                     {task.type === TaskType.Translation 
                       ? "Stuck on a word? Generate vocabulary hints." 
                       : "Stuck? Generate specific ideas and sentence starters."}
                   </p>
                   <Button 
                      onClick={handleCreateOutline} 
                      disabled={isGeneratingOutline}
                      className="w-full text-xs py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-300 shadow-none"
                    >
                      {isGeneratingOutline ? 'Thinking...' : (task.type === TaskType.Translation ? 'Get Hints' : 'Create Outline')}
                    </Button>
                 </div>
               ) : (
                 <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
                    <p className="text-[10px] text-slate-400 italic">Click to insert.</p>
                    {outline.map((section, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-100 dark:border-slate-700/50">
                        <h5 className="font-bold text-slate-700 dark:text-slate-200 text-xs mb-2 flex items-center gap-1.5">
                          {section.sectionTitle}
                        </h5>
                        
                        {/* Content Points */}
                        <ul className="space-y-2 mb-3">
                          {section.points.map((p, pIdx) => (
                            <li 
                              key={pIdx}
                              onClick={() => handleInsertPoint(p)}
                              className="text-xs text-slate-600 dark:text-slate-400 pl-3 border-l-2 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-300 cursor-pointer transition-colors leading-normal"
                            >
                              {p}
                            </li>
                          ))}
                        </ul>

                        {/* Sentence Structures */}
                        {section.structures && section.structures.length > 0 && (
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-700/50">
                            <h6 className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase mb-1.5 tracking-wider">Useful Structures</h6>
                            <ul className="space-y-1.5">
                              {section.structures.map((s, sIdx) => (
                                <li 
                                  key={`str-${sIdx}`}
                                  className="group flex items-center gap-2"
                                >
                                  <span 
                                    onClick={() => handleInsertPoint(s)}
                                    className="flex-1 text-[11px] font-medium font-mono text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-800 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                                  >
                                    {s}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onSaveItem({
                                        type: 'structure',
                                        content: s,
                                        note: `From Outline: ${section.sectionTitle}`,
                                        source: task.promptText
                                      });
                                    }}
                                    className="p-1 text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Save to Notebook"
                                  >
                                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Center Column: Editor */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-[60vh] lg:h-[70vh] transition-colors relative">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-700/50 rounded-t-2xl relative z-20">
              <div className="flex items-center gap-2">
                 <button
                  onClick={handleOpenAssist}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold transition-colors"
                  title="Rewrite specific sentence"
                >
                  <span className="text-base">✨</span>
                  <span className="hidden sm:inline">Magic Rewrite</span>
                </button>
                <button
                  onClick={handleQuickCheck}
                  disabled={isChecking}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                  title="Scan for all errors (Ctrl + Enter)"
                >
                  {isChecking ? (
                     <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
                  )}
                  <span className="hidden sm:inline">Check Errors</span>
                  <span className="hidden sm:inline opacity-70 text-[10px] ml-1 font-normal tracking-wide">(Ctrl ↵)</span>
                </button>
              </div>
              
              <div className="flex items-center gap-3 md:gap-4">
                {/* Timer */}
                <div className="hidden sm:flex items-center gap-2 text-slate-600 dark:text-slate-300 font-mono text-sm bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>{formatTime(seconds)}</span>
                </div>
                <WordCounter 
                  text={text} 
                  min={task.type === TaskType.Essay ? 250 : 100} 
                  max={task.type === TaskType.Essay ? 350 : (task.type === TaskType.Translation ? 200 : 150)} 
                />
              </div>
            </div>
            
            <div className="flex-1 relative w-full overflow-hidden rounded-b-2xl">
              {/* Backdrop Layer for Highlights */}
              <div 
                ref={backdropRef}
                className="absolute inset-0 p-6 pointer-events-none overflow-auto w-full h-full"
                aria-hidden="true"
              >
                {renderBackdrop()}
              </div>

              {/* Foreground Input Layer */}
              <textarea
                ref={textareaRef}
                className="absolute inset-0 w-full h-full p-6 resize-none focus:outline-none text-lg leading-relaxed text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 bg-transparent font-sans z-10"
                placeholder={
                  task.type === TaskType.InformalLetter ? "Hi Alex,\n\nThanks for your letter..." : 
                  task.type === TaskType.Translation ? "Write your English translation here..." :
                  "In today's world..."
                }
                value={text}
                onChange={(e) => onTextChange(e.target.value)}
                onScroll={handleScroll}
                onKeyDown={handleKeyDown}
                spellCheck={false}
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <Button 
              onClick={handleManualSubmit} 
              disabled={isSubmitting || text.length < 20}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? 'Analyzing...' : 'Submit for Review'}
            </Button>
          </div>
        </div>

        {/* Right Column: Suggestions Panel */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl h-full min-h-[200px] border border-slate-200 dark:border-slate-700 flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Suggestions</h3>
              <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">{suggestions.length}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[60vh] lg:max-h-[65vh]">
              {suggestions.length === 0 && !isChecking && (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                  <p>No issues found yet.</p>
                  <p className="mt-1 text-xs">Click "Check Errors" or Ctrl+Enter to scan.</p>
                </div>
              )}
              
              {isChecking && (
                <div className="space-y-3">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700/50 rounded-xl animate-pulse"></div>
                   ))}
                </div>
              )}

              {suggestions.map((s) => (
                <div key={s.id} className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      s.type === 'grammar' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' :
                      s.type === 'vocabulary' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                    }`}>
                      {s.type}
                    </span>
                    <button onClick={() => dismissSuggestion(s.id)} className="text-slate-300 hover:text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                    </button>
                  </div>
                  
                  <div className="mb-2">
                    <div className="text-rose-500 line-through text-xs mb-0.5 break-words">{s.original}</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm break-words">{s.replacement}</div>
                  </div>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-tight font-medium">
                    {s.reason}
                  </p>

                  {s.grammarStructure && (
                    <div className="mt-2 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded text-[10px] border border-indigo-100 dark:border-indigo-800/50">
                      <span className="font-bold text-indigo-700 dark:text-indigo-300 block mb-0.5">Learn Structure:</span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-200">{s.grammarStructure}</span>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => applySuggestion(s)}
                    className="w-full mt-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Apply Fix
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
