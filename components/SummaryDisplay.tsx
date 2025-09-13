import React from 'react';
import { SummaryData } from '../types';

interface SummaryDisplayProps {
  summaryData: SummaryData;
  onRestart: () => void;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summaryData, onRestart }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 sm:p-8 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-center text-slate-800 dark:text-slate-100">
        {summaryData.title}
      </h2>
      
      <div className="mt-6 prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
        {summaryData.summary}
      </div>

      <button
        onClick={onRestart}
        className="mt-10 w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition-colors transform hover:scale-105"
      >
        Summarize Something Else
      </button>
    </div>
  );
};

export default SummaryDisplay;
