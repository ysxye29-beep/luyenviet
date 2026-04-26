import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  user?: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  } | null;
  onSignOut?: () => void;
  onSignIn?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, isDarkMode, onToggleTheme, user, onSignOut, onSignIn }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200 dark:shadow-none">
              V
            </div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Writing Coach</h1>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            {user ? (
              <div className="flex items-center gap-2 pr-4 border-r border-slate-100 dark:border-slate-700">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-7 h-7 rounded-full" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                    {user.displayName?.[0] || 'U'}
                  </div>
                )}
                <button 
                  onClick={onSignOut}
                  className="text-xs font-semibold text-slate-500 hover:text-red-500 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pr-4 border-r border-slate-100 dark:border-slate-700">
                <button 
                  onClick={onSignIn}
                  className="text-xs font-bold px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}
            <nav className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              <span>Informal Letter</span>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
              <span>Essay</span>
            </nav>
            
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-none">
        {children}
      </main>
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 text-center text-slate-400 dark:text-slate-500 text-sm transition-colors duration-200 print:hidden">
        <p>Powered by Google Gemini • Practice for B1 Preliminary</p>
      </footer>
    </div>
  );
};