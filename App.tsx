
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './views/Home';
import { Workspace } from './views/Workspace';
import { Result } from './views/Result';
import { TopicBank } from './views/TopicBank';
import { Notebook } from './views/Notebook';
import { ExamLibrary } from './views/ExamLibrary';
import { SmartReview } from './views/SmartReview';
import { AppState, TaskType, FeedbackResult, HistoryItem, SavedItem, AppliedCorrection, PdfTask, DictionaryResult } from './types';
import { generateWritingTask, evaluateWriting } from './services/geminiService';
import { DictionaryPopup } from './components/DictionaryPopup';
import { AnimatePresence, motion } from 'motion/react';
import { auth, db, googleProvider, OperationType, handleFirestoreError } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, onSnapshot, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentView: 'home',
    selectedTaskType: null,
    currentTask: null,
    userText: '',
    currentOutline: [],
    feedback: null,
    isLoading: false,
    error: null,
    user: null,
    authReady: false,
  });

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  
  // Dictionary State
  const [lookupWord, setLookupWord] = useState<string | null>(null);

  // New: Track corrections applied in Workspace
  const [sessionCorrections, setSessionCorrections] = useState<AppliedCorrection[]>([]);
  // New: Track session time
  const [sessionTime, setSessionTime] = useState<number>(0);

  // Theme Logic
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Load Data & Sync with Firebase
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setState(prev => ({
          ...prev,
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          authReady: true
        }));
      } else {
        setState(prev => ({ ...prev, user: null, authReady: true, history: [], savedItems: [] }));
        setHistory([]);
        setSavedItems([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!state.user) return;

    // Sync History
    const qHistory = query(
      collection(db, 'writingHistory'),
      where('userId', '==', state.user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribeHistory = onSnapshot(qHistory, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HistoryItem));
      setHistory(items);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'writingHistory'));

    // Sync Notebook
    const qNotebook = query(
      collection(db, 'notebookItems'),
      where('userId', '==', state.user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribeNotebook = onSnapshot(qNotebook, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedItem));
      setSavedItems(items);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'notebookItems'));

    return () => {
      unsubscribeHistory();
      unsubscribeNotebook();
    };
  }, [state.user]);

  const handleSignIn = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Upsert user profile
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: Date.now()
      }, { merge: true });

      setState(prev => ({ ...prev, isLoading: false }));
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false, error: "Sign in failed." }));
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      handleHome();
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  const saveToHistory = async (item: Omit<HistoryItem, 'id'>) => {
    if (!state.user) return;
    try {
      await addDoc(collection(db, 'writingHistory'), {
        ...item,
        userId: state.user.uid
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'writingHistory');
    }
  };

  const handleClearHistory = async () => {
    if (!state.user) return;
    if (window.confirm("Are you sure you want to clear your writing history?")) {
      try {
        const q = query(collection(db, 'writingHistory'), where('userId', '==', state.user.uid));
        const snapshot = await getDocs(q);
        const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, 'writingHistory', d.id)));
        await Promise.all(deletePromises);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, 'writingHistory');
      }
    }
  };

  const handleSaveItem = async (itemData: Omit<SavedItem, 'id' | 'date'>) => {
    if (!state.user) return;
    const exists = savedItems.some(i => i.content === itemData.content && i.type === itemData.type);
    if (exists) {
      alert("This item is already in your notebook!");
      return;
    }

    try {
      await addDoc(collection(db, 'notebookItems'), {
        ...itemData,
        userId: state.user.uid,
        date: Date.now()
      });
      alert("Saved to Notebook & Added to Smart Review!");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'notebookItems');
    }
  };

  const handleUpdateSavedItem = async (updatedItem: SavedItem) => {
    try {
      const { id, ...rest } = updatedItem;
      await updateDoc(doc(db, 'notebookItems', id), rest as any);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'notebookItems');
    }
  }

  const handleRemoveSavedItem = async (id: string) => {
    if (window.confirm("Remove this item?")) {
      try {
        await deleteDoc(doc(db, 'notebookItems', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, 'notebookItems');
      }
    }
  };

  const handleRegisterCorrection = (correction: Omit<AppliedCorrection, 'id' | 'timestamp'>) => {
    const newCorrection: AppliedCorrection = {
      id: Date.now().toString() + Math.random().toString().slice(2, 6),
      timestamp: Date.now(),
      ...correction
    };
    setSessionCorrections(prev => [...prev, newCorrection]);
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleSelectTask = async (type: TaskType) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, selectedTaskType: type }));
    setSessionCorrections([]); // Reset session corrections
    setSessionTime(0);
    try {
      const promptText = await generateWritingTask(type);
      setState(prev => ({
        ...prev,
        currentView: 'workspace',
        currentTask: {
          id: Date.now().toString(),
          type,
          promptText
        },
        userText: '',
        currentOutline: [], // Reset outline
        feedback: null,
        isLoading: false
      }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: "Could not generate task. Please check your connection." 
      }));
    }
  };

  const handleStartPdfTask = (task: PdfTask) => {
    setSessionCorrections([]);
    setSessionTime(0);
    setState(prev => ({
        ...prev,
        currentView: 'workspace',
        currentTask: {
          id: task.id,
          type: task.type,
          promptText: task.content,
          sampleAnswer: task.sampleAnswer // Pass the sample answer
        },
        userText: '',
        currentOutline: [],
        feedback: null,
        isLoading: false
    }));
  };

  const handleStartCustomTask = (type: TaskType, promptText: string) => {
    setSessionCorrections([]); // Reset session corrections
    setSessionTime(0);
    setState(prev => ({
      ...prev,
      currentView: 'workspace',
      currentTask: {
        id: Date.now().toString(),
        type,
        promptText
      },
      userText: '',
      currentOutline: [], // Reset outline
      feedback: null,
      isLoading: false
    }));
  };

  const handleSubmit = async (timeSpentSeconds: number) => {
    if (!state.currentTask || !state.userText) return;

    setSessionTime(timeSpentSeconds);
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await evaluateWriting(
        state.currentTask.type,
        state.currentTask.promptText,
        state.userText
      );

      // Save to history including session corrections and outline
      const historyItem: Omit<HistoryItem, 'id'> = {
        timestamp: Date.now(),
        taskType: state.currentTask.type,
        promptText: state.currentTask.promptText,
        userText: state.userText,
        feedback: result,
        sessionCorrections: sessionCorrections, 
        outline: state.currentOutline, 
        timeSpentSeconds: timeSpentSeconds 
      };
      await saveToHistory(historyItem);

      setState(prev => ({
        ...prev,
        currentView: 'result',
        feedback: result,
        isLoading: false
      }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: "Failed to evaluate text. Please try again." 
      }));
    }
  };

  const handleViewHistoryItem = (item: HistoryItem) => {
    setSessionCorrections(item.sessionCorrections || []); // Restore tracked corrections
    setSessionTime(item.timeSpentSeconds || 0); // Restore time
    setState(prev => ({
      ...prev,
      currentView: 'result',
      currentTask: {
        id: item.id,
        type: item.taskType,
        promptText: item.promptText
      },
      userText: item.userText,
      currentOutline: item.outline || [], // Restore outline
      feedback: item.feedback,
      isLoading: false,
      selectedTaskType: item.taskType
    }));
  };

  const handleRetry = () => {
    setState(prev => ({ ...prev, currentView: 'workspace' }));
  };

  const handleHome = () => {
    setState(prev => ({ 
      ...prev, 
      currentView: 'home', 
      userText: '', 
      currentTask: null, 
      currentOutline: [],
      feedback: null,
      selectedTaskType: null
    }));
    setSessionCorrections([]);
    setSessionTime(0);
  };

  const handleWordLookup = (word: string) => {
    // Clean word: remove punctuation and whitespace
    const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").trim();
    if (cleanWord) {
      setLookupWord(cleanWord);
    }
  };

  if (!state.authReady) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Layout isDarkMode={darkMode} onToggleTheme={toggleTheme} user={state.user} onSignOut={handleSignOut} onSignIn={handleSignIn}>
      <AnimatePresence>
        {lookupWord && (
          <DictionaryPopup 
            word={lookupWord} 
            onClose={() => setLookupWord(null)}
            onSave={handleSaveItem}
            isSaved={savedItems.some(i => i.content.toLowerCase() === lookupWord.toLowerCase())}
          />
        )}
      </AnimatePresence>

      {state.isLoading && (
        <div className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-900 dark:border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-indigo-900 dark:text-indigo-200 font-medium animate-pulse">
              {state.currentView === 'home' ? 'Creating your task...' : 'Analyzing your writing...'}
            </p>
          </div>
        </div>
      )}

      {state.error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
          <p>{state.error}</p>
          <button onClick={() => setState(prev => ({ ...prev, error: null }))} className="text-red-500 hover:text-red-700 dark:hover:text-red-300">✕</button>
        </div>
      )}

      {state.currentView === 'home' && (
        <Home 
          onSelectTask={handleSelectTask} 
          onStartCustomTask={handleStartCustomTask}
          onOpenTopicBank={() => setState(prev => ({ ...prev, currentView: 'topic-bank' }))}
          onOpenNotebook={() => setState(prev => ({ ...prev, currentView: 'notebook' }))}
          onOpenExamLibrary={() => setState(prev => ({ ...prev, currentView: 'exam-library' }))}
          onOpenSmartReview={() => setState(prev => ({ ...prev, currentView: 'smart-review' }))}
          history={history}
          savedItems={savedItems}
          onViewHistory={handleViewHistoryItem}
          onClearHistory={handleClearHistory}
        />
      )}

      {state.currentView === 'topic-bank' && (
        <TopicBank onBack={handleHome} />
      )}

      {state.currentView === 'notebook' && (
        <Notebook 
          items={savedItems}
          onRemoveItem={handleRemoveSavedItem}
          onBack={handleHome}
        />
      )}
      
      {state.currentView === 'exam-library' && (
        <ExamLibrary 
          onSelectTask={handleStartPdfTask}
          onBack={handleHome}
        />
      )}

      {state.currentView === 'smart-review' && (
        <SmartReview 
          items={savedItems}
          onUpdateItem={handleUpdateSavedItem}
          onBack={handleHome}
        />
      )}

      {state.currentView === 'workspace' && (
        <Workspace 
          task={state.currentTask} 
          text={state.userText} 
          outline={state.currentOutline}
          onTextChange={(text) => setState(prev => ({ ...prev, userText: text }))}
          onOutlineChange={(outline) => setState(prev => ({ ...prev, currentOutline: outline }))}
          onSubmit={handleSubmit}
          isSubmitting={state.isLoading}
          onBack={handleHome}
          onSaveItem={handleSaveItem}
          onRegisterCorrection={handleRegisterCorrection}
          onLookup={handleWordLookup}
        />
      )}

      {state.currentView === 'result' && state.feedback && state.currentTask && (
        <Result 
          feedback={state.feedback} 
          taskType={state.currentTask.type}
          userText={state.userText}
          promptText={state.currentTask.promptText}
          outline={state.currentOutline}
          onRetry={handleRetry}
          onNewTask={handleHome}
          onSaveItem={handleSaveItem}
          sessionCorrections={sessionCorrections}
          timeSpentSeconds={sessionTime} 
          officialAnswer={state.currentTask.sampleAnswer} // Pass official model answer
          onLookup={handleWordLookup}
        />
      )}
    </Layout>
  );
};

export default App;
