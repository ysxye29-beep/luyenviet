
import React from 'react';
import { PDF_TASKS } from '../data/pdfTasks';
import { TaskType, PdfTask } from '../types';
import { Button } from '../components/Button';

interface ExamLibraryProps {
  onSelectTask: (task: PdfTask) => void;
  onBack: () => void;
}

export const ExamLibrary: React.FC<ExamLibraryProps> = ({ onSelectTask, onBack }) => {
  const letters = PDF_TASKS.filter(t => t.type === TaskType.InformalLetter);
  const essays = PDF_TASKS.filter(t => t.type === TaskType.Essay);

  const renderTaskGroup = (title: string, tasks: PdfTask[], colorClass: string, icon: string) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h3>
        <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded-full">{tasks.length}</span>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map(task => (
          <div 
            key={task.id}
            onClick={() => onSelectTask(task)}
            className="group bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col"
          >
            <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${colorClass}`}>
              {task.type === TaskType.InformalLetter ? 'Part 1' : 'Part 2'}
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {task.title}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 flex-1">
              {task.content}
            </p>
            <div className="mt-auto">
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                Start Practice 
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={onBack} className="px-3 py-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Button>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Exam Library (Đề thi PDF)</h2>
          <p className="text-slate-600 dark:text-slate-400">Practice with real tasks from your course material.</p>
        </div>
      </div>

      {renderTaskGroup("Informal Letters (Part 1)", letters, "text-blue-600 dark:text-blue-400", "✉️")}
      {renderTaskGroup("Essays & Paragraphs (Part 2)", essays, "text-emerald-600 dark:text-emerald-400", "📝")}
    </div>
  );
};
