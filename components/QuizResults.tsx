import React from 'react';
import { QuizQuestion } from '../types';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';

interface QuizResultsProps {
  quiz: QuizQuestion[];
  userAnswers: (string | null)[];
  onRestart: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ quiz, userAnswers, onRestart }) => {
  const correctAnswersCount = quiz.filter((q, i) => q.correctAnswer === userAnswers[i]).length;
  const score = (correctAnswersCount / quiz.length) * 100;

  const scoreColor = score >= 80 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 sm:p-8">
      <h2 className="text-3xl font-extrabold text-center text-slate-800 dark:text-slate-100 opacity-0 animate-fade-in">Quiz Complete!</h2>
      
      <div className="text-center my-6 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg opacity-0 animate-fade-in-slow" style={{ animationDelay: '200ms' }}>
        <p className="text-lg text-slate-600 dark:text-slate-300">Your Score</p>
        <p className={`text-7xl font-bold my-2 ${scoreColor}`}>
          {score.toFixed(0)}%
        </p>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          You answered {correctAnswersCount} out of {quiz.length} questions correctly.
        </p>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-6 text-center opacity-0 animate-fade-in" style={{ animationDelay: '400ms' }}>Review Your Answers</h3>
        <div className="space-y-8">
          {quiz.map((q, index) => {
            const isCorrect = userAnswers[index] === q.correctAnswer;
            return (
              <div 
                key={index} 
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-5 opacity-0 animate-slide-up"
                style={{ animationDelay: `${500 + index * 200}ms` }}
              >
                <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">{index + 1}. {q.question}</p>
                
                <div className={`mt-4 flex items-start p-3 rounded-md ${isCorrect ? 'bg-green-50 dark:bg-green-900/40' : 'bg-red-50 dark:bg-red-900/40'}`}>
                  {isCorrect ? <CheckIcon className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-green-600 dark:text-green-400" /> : <XIcon className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-red-600 dark:text-red-400" />}
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-300">Your answer: <span className={isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>{userAnswers[index] || "Not answered"}</span></p>
                    {!isCorrect && (
                      <p className="font-medium text-slate-700 dark:text-slate-300 mt-1">Correct answer: <span className="text-green-700 dark:text-green-300">{q.correctAnswer}</span></p>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-700/60 rounded-md">
                   <p className="font-semibold text-slate-700 dark:text-slate-200">Explanation:</p>
                   <p className="text-slate-600 dark:text-slate-300 mt-1">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={onRestart}
        className="mt-10 w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition-colors transform hover:scale-105"
      >
        Create Another Quiz
      </button>
    </div>
  );
};

export default QuizResults;