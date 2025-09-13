import React, { useState } from 'react';
import BookIcon from './icons/BookIcon';
import SparkleIcon from './icons/SparkleIcon';

interface LoginProps {
  onLogin: (identifier: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    onLogin(identifier.trim());
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="text-center mb-10 animate-slide-down">
        <div className="inline-flex items-center justify-center gap-3">
          <SparkleIcon className="w-8 h-8 text-yellow-400 animate-sparkle" style={{ animationDelay: '0.5s' }} />
          <BookIcon className="w-12 h-12 text-indigo-500"/>
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 whitespace-nowrap">
            AI Study Buddy
          </h1>
          <SparkleIcon className="w-8 h-8 text-yellow-400 animate-sparkle" style={{ animationDelay: '0.8s' }} />
        </div>
         <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Sign in to begin your AI-powered study session.
         </p>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email or Phone
              </label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:text-slate-200"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:text-slate-200"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          <button
            type="submit"
            className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-all duration-300 transform hover:scale-105"
          >
            Sign In & Start Studying
          </button>
           <p className="text-xs text-center text-slate-500 mt-4">
              (This is a demo. Any email and password will work.)
           </p>
        </form>
      </div>
    </div>
  );
};

export default Login;