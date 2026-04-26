
import React, { useState } from 'react';
import { TOPIC_DATA } from '../data/vocabularyData';
import { Button } from '../components/Button';
import { VocabItem, StructureItem, ModelSentence } from '../types';

interface TopicBankProps {
  onBack: () => void;
}

export const TopicBank: React.FC<TopicBankProps> = ({ onBack }) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const selectedTopic = TOPIC_DATA.find(t => t.id === selectedTopicId);

  const renderVocabList = (title: string, items: VocabItem[], colorClass: string, icon: string) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
      <div className={`px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2 ${colorClass}`}>
        <span className="text-xl">{icon}</span>
        <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-sm">{title}</h3>
      </div>
      <div className="p-4 grid gap-3 sm:grid-cols-2">
        {items.map((item, idx) => (
          <div key={idx} className="group relative p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
            <div className="flex justify-between items-start">
               <span className="font-bold text-slate-900 dark:text-slate-100">{item.word}</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 italic">{item.definition}</p>
            {item.example && (
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded">
                "{item.example}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStructures = (items: StructureItem[]) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
      <div className="bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 px-4 py-3 border-b border-violet-100 dark:border-violet-800/50 flex items-center gap-2">
        <span className="text-xl">🏗️</span>
        <h3 className="font-bold uppercase tracking-wider text-sm">Useful Structures</h3>
      </div>
      <div className="p-4 space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="p-3 rounded-lg border border-violet-100 dark:border-violet-900/50 bg-violet-50/50 dark:bg-violet-900/10">
            <div className="font-mono font-bold text-violet-600 dark:text-violet-300 mb-1">{item.pattern}</div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{item.explanation}</p>
            <div className="text-sm italic text-slate-500 dark:text-slate-500 border-l-2 border-violet-300 dark:border-violet-700 pl-2">
              Example: {item.example}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderModelSentences = (items: ModelSentence[]) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
      <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-4 py-3 border-b border-emerald-100 dark:border-emerald-800/50 flex items-center gap-2">
        <span className="text-xl">📝</span>
        <h3 className="font-bold uppercase tracking-wider text-sm">Model Sentences</h3>
      </div>
      <div className="p-4 space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
            <p className="font-medium text-slate-800 dark:text-slate-200 mb-1">"{item.english}"</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">{item.vietnamese}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 min-h-[80vh] flex flex-col md:flex-row gap-8">
      
      {/* Sidebar / Topic List */}
      <div className="w-full md:w-1/3 lg:w-1/4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
           <Button variant="outline" onClick={onBack} className="px-3 py-2 h-10 w-10 !p-0 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
           </Button>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Topic Bank</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Essential B1 vocabulary sorted by common exam topics.
        </p>
        
        <div className="space-y-2">
          {TOPIC_DATA.map(topic => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopicId(topic.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 border ${
                selectedTopicId === topic.id 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <span className="text-2xl">{topic.icon}</span>
              <div>
                <span className="font-bold block">{topic.name}</span>
                <span className={`text-xs ${selectedTopicId === topic.id ? 'text-indigo-200' : 'text-slate-400'} line-clamp-1`}>
                  {topic.description}
                </span>
              </div>
              {selectedTopicId === topic.id && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto"><path d="m9 18 6-6-6-6"/></svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl md:border md:border-slate-200 md:dark:border-slate-800 p-0 md:p-6 lg:p-8">
        {selectedTopic ? (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <div className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
              <div className="flex items-center gap-4 mb-2">
                 <span className="text-4xl">{selectedTopic.icon}</span>
                 <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">{selectedTopic.name}</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                {selectedTopic.description}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {renderVocabList("Common Nouns", selectedTopic.nouns, "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300", "📦")}
              {renderVocabList("Action Verbs", selectedTopic.verbs, "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300", "⚡")}
              {renderVocabList("Useful Adjectives", selectedTopic.adjectives, "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300", "✨")}
              {renderVocabList("Phrases & Collocations", selectedTopic.phrases, "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300", "💬")}
            </div>

            <div className="mt-6 grid lg:grid-cols-2 gap-6">
               {renderStructures(selectedTopic.structures)}
               {renderModelSentences(selectedTopic.modelSentences)}
            </div>

          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 dark:text-slate-500">
            <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Select a Topic</h3>
            <p className="max-w-md">
              Choose a topic from the sidebar to view essential B1/B2 vocabulary, definitions, and examples.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
