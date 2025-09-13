
import React from 'react';
import XIcon from './icons/XIcon';
import BookIcon from './icons/BookIcon';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto p-8 relative transform animate-slide-down"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          aria-label="Close modal"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center">
            <BookIcon className="w-12 h-12 text-indigo-500 mb-4" />
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">About AI Study Buddy</h2>
            <p className="text-slate-600 dark:text-slate-300">
                This application leverages the power of the Google Gemini API to help you study more effectively.
            </p>

            <div className="text-left mt-6 space-y-3">
                 <p className="text-slate-600 dark:text-slate-400">
                    Simply paste your study material—whether it's from notes, an article, or a textbook—and our AI will instantly generate a multiple-choice quiz based on the key information in the text.
                </p>
                 <p className="text-slate-600 dark:text-slate-400">
                    It's a quick and powerful way to test your comprehension and reinforce your learning.
                </p>
            </div>

            <button
                onClick={onClose}
                className="mt-8 w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
            >
                Got it, thanks!
            </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
