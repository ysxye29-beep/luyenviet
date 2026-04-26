import React from 'react';

interface WordCounterProps {
  text: string;
  min: number;
  max: number;
}

export const WordCounter: React.FC<WordCounterProps> = ({ text, min, max }) => {
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  
  let statusColor = 'text-slate-500 dark:text-slate-400';
  let progressColor = 'bg-slate-300 dark:bg-slate-600';
  
  if (wordCount > 0) {
    if (wordCount < min) {
      statusColor = 'text-amber-500 dark:text-amber-400'; // Too short
      progressColor = 'bg-amber-400';
    } else if (wordCount > max) {
      statusColor = 'text-rose-500 dark:text-rose-400'; // Too long
      progressColor = 'bg-rose-400';
    } else {
      statusColor = 'text-emerald-600 dark:text-emerald-400'; // Good
      progressColor = 'bg-emerald-500';
    }
  }

  const percentage = Math.min(100, Math.max(0, (wordCount / max) * 100));

  return (
    <div className="flex flex-col gap-1 w-full max-w-xs">
      <div className="flex justify-between items-baseline text-sm font-medium">
        <span className="text-slate-400 dark:text-slate-500">Word Count</span>
        <span className={`${statusColor}`}>
          {wordCount} <span className="text-slate-300 dark:text-slate-600">/ {min}-{max}</span>
        </span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${progressColor}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};