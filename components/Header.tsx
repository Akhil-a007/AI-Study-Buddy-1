import React, { useState, useEffect, useRef } from 'react';
import BookIcon from './icons/BookIcon';
import SparkleIcon from './icons/SparkleIcon';
import MenuIcon from './icons/MenuIcon';
import UserIcon from './icons/UserIcon';
import InfoIcon from './icons/InfoIcon';
import LogoutIcon from './icons/LogoutIcon';
import { HistoryItem, User } from '../types';
import AboutModal from './AboutModal';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  history: HistoryItem[];
  onLoadHistoryItem: (item: HistoryItem) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, history, onLoadHistoryItem }) => {
  const [isHistoryDropdownOpen, setIsHistoryDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const historyDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (historyDropdownRef.current && !historyDropdownRef.current.contains(event.target as Node)) {
        setIsHistoryDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleHistoryItemClick = (item: HistoryItem) => {
    onLoadHistoryItem(item);
    setIsHistoryDropdownOpen(false);
  };

  const handleAboutClick = () => {
    setIsAboutModalOpen(true);
    setIsHistoryDropdownOpen(false);
  }

  return (
    <header className="relative">
      <nav className="flex justify-between items-center">
        {/* History Dropdown */}
        <div ref={historyDropdownRef} className="relative opacity-0 animate-slide-down" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={() => setIsHistoryDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
            aria-haspopup="true"
            aria-expanded={isHistoryDropdownOpen}
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          {isHistoryDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-2xl ring-1 ring-black ring-opacity-5 dark:ring-slate-700 z-10 py-2">
              <div className="px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">Quiz History</div>
              <ul className="max-h-80 overflow-y-auto">
                {history.length > 0 ? (
                  history.map(item => (
                    <li key={item.id}>
                      <button onClick={() => handleHistoryItemClick(item)} className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <span className="font-semibold block truncate">{item.title}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{new Date(item.timestamp).toLocaleString()}</span>
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">No history yet.</li>
                )}
              </ul>
               <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2">
                  <button onClick={handleAboutClick} className="w-full flex items-center gap-3 text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <InfoIcon className="w-5 h-5" />
                      <span>About AI Study Buddy</span>
                  </button>
              </div>
            </div>
          )}
        </div>
        
        {/* User Dropdown */}
        <div ref={userDropdownRef} className="relative opacity-0 animate-slide-down" style={{ animationDelay: '0.6s' }}>
          <button onClick={() => setIsUserDropdownOpen(prev => !prev)} className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
            <div className="w-8 h-8 rounded-full bg-indigo-200 dark:bg-indigo-700 flex items-center justify-center overflow-hidden">
                <UserIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
            </div>
          </button>
           {isUserDropdownOpen && (
             <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-2xl ring-1 ring-black ring-opacity-5 dark:ring-slate-700 z-10 py-2">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Signed in as</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{user.identifier}</p>
                </div>
                <div className="py-1">
                   <button onClick={onLogout} className="w-full flex items-center gap-3 text-left px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors">
                      <LogoutIcon className="w-5 h-5" />
                      <span>Logout</span>
                  </button>
                </div>
            </div>
          )}
        </div>
      </nav>

      <div className="text-center mt-4">
        <div className="opacity-0 animate-slide-down">
          <div className="inline-flex items-center justify-center gap-3">
            <SparkleIcon className="w-8 h-8 text-yellow-400 opacity-0 animate-sparkle" style={{ animationDelay: '0.8s' }} />
            <BookIcon className="w-10 h-10 text-indigo-500"/>
            <h1 className="text-4xl sm:text-5xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              AI Study Buddy
            </h1>
            <SparkleIcon className="w-8 h-8 text-yellow-400 opacity-0 animate-sparkle" style={{ animationDelay: '1s' }} />
          </div>
        </div>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto opacity-0 animate-slide-down-delay-1">
          Your AI learning assistant to create quizzes, summarize notes, and generate flashcards, supercharging your study sessions.
        </p>
      </div>
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </header>
  );
};

export default Header;
