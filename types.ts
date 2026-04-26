
export enum TaskType {
  InformalLetter = 'informal_letter',
  Essay = 'essay',
  Translation = 'translation',
}

export interface WritingTask {
  id: string;
  type: TaskType;
  promptText: string;
  sampleAnswer?: string; // Pre-written sample for PDF tasks
}

export interface Correction {
  original: string;
  correction: string;
  explanation: string; // Now in Vietnamese
  grammarStructure?: string; // e.g., "S + V + Adv"
}

export interface FeedbackResult {
  score: number; // 0-10
  generalComment: string;
  grammarCorrections: Correction[];
  betterVocabulary: string[];
  structureFeedback: string;
  sampleVersion: string; // AI generated sample (Generic Model Answer)
  improvedVersion?: string; // New: Rewritten version of USER'S text
  markupText: string; // New: Full text with inline tags [type|original|correction]
}

export interface SpellingCorrection {
  original: string;
  correction: string;
  explanation: string;
}

export interface SentenceImprovement {
  original: string;
  improved: string;
  explanation: string;
  highlightedChanges: string[]; // List of words/phrases that were changed
  diffMarkup?: string; // String with [-del-] and {+add+} markup
  spellingCorrections?: SpellingCorrection[]; // Specific spelling fixes
}

export interface InlineSuggestion {
  id: string;
  original: string; // The specific segment to replace
  replacement: string;
  type: 'grammar' | 'spelling' | 'vocabulary';
  reason: string; // Now in Vietnamese
  grammarStructure?: string; // e.g., "Conditionals Type 2: If + S + V-ed, S + would + V"
}

export interface OutlineSection {
  sectionTitle: string; // e.g., "Introduction", "Paragraph 1"
  points: string[]; // Bullet points of what to include
  structures?: string[]; // Suggested sentence structures/templates
}

// New: Track corrections made DURING the session
export interface AppliedCorrection {
  id: string;
  original: string;
  correction: string;
  type: 'grammar' | 'spelling' | 'vocabulary' | 'style';
  explanation?: string;
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  taskType: TaskType;
  promptText: string;
  userText: string;
  feedback: FeedbackResult;
  sessionCorrections?: AppliedCorrection[]; // Persist what user fixed themselves
  outline?: OutlineSection[]; // Persist the outline/hints used
  timeSpentSeconds?: number; // Track duration
}

// Vocabulary Bank Types
export interface VocabItem {
  word: string;
  definition: string; // Short definition or Vietnamese meaning
  example?: string;
}

export interface StructureItem {
  pattern: string; // e.g., "It is crucial to + V"
  explanation: string; // Usage context
  example: string;
}

export interface ModelSentence {
  english: string;
  vietnamese: string;
}

export interface TopicVocabulary {
  id: string;
  name: string;
  icon: string; // SVG path or emoji
  description: string;
  nouns: VocabItem[];
  verbs: VocabItem[];
  adjectives: VocabItem[];
  phrases: VocabItem[];
  structures: StructureItem[];
  modelSentences: ModelSentence[];
}

// SRS (Spaced Repetition System) Data
export interface SRSData {
  level: number; // 0 to 5 (0 = New, 5 = Mastered)
  nextReviewDate: number; // Timestamp
  lastReviewed: number; // Timestamp
  interval: number; // Days until next review
}

// Notebook / Saved Items
export interface SavedItem {
  id: string;
  type: 'vocabulary' | 'structure';
  content: string; // The word or the structure pattern
  note?: string; // Explanation or context
  date: number;
  source?: string; // The prompt text or task ID identifying where this came from
  srs?: SRSData; // Optional SRS data for tracking learning progress
}

export interface PdfTask {
  id: string;
  title: string;
  type: TaskType;
  content: string;
  sourcePage?: string;
  sampleAnswer?: string; // The model answer for this specific task
}

export interface DictionaryResult {
  word: string;
  phonetic: string;
  definition: string;
  example: string;
  vietnameseDefinition: string;
}

export interface AppState {
  currentView: 'home' | 'workspace' | 'result' | 'topic-bank' | 'notebook' | 'exam-library' | 'smart-review';
  selectedTaskType: TaskType | null;
  currentTask: WritingTask | null;
  userText: string;
  currentOutline: OutlineSection[]; // Lifted state for outline
  feedback: FeedbackResult | null;
  isLoading: boolean;
  error: string | null;
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  } | null;
  authReady: boolean;
}
