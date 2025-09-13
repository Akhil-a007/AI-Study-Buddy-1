import React from 'react';
import BrainIcon from './icons/BrainIcon';
import BookIcon from './icons/BookIcon';

const IntroScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="relative flex flex-col items-center justify-center" style={{ perspective: '1000px' }}>
        {/* Animated Brain in the background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-20">
          <BrainIcon className="w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] text-indigo-500 animate-rotate-brain" />
        </div>

        {/* Content in the foreground */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
           <div className="opacity-0 animate-slide-down">
                <BookIcon className="w-16 h-16 text-indigo-400"/>
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mt-4 opacity-0 animate-slide-down" style={{ animationDelay: '0.3s' }}>
              AI Study Buddy
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto opacity-0 animate-slide-down" style={{ animationDelay: '0.6s' }}>
                Preparing your personal learning space...
            </p>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;
