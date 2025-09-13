
import React from 'react';
import { QuizQuestion } from '../types';

interface QuizViewProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  onNext: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNext,
}) => {

  const getOptionClasses = (option: string) => {
    if (option === selectedAnswer) {
      return "border-indigo-500 bg-indigo-100 dark:bg-indigo-900 dark:border-indigo-700 ring-2 ring-indigo-500";
    }
    return "border-slate-300 dark:border-slate-600 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-700";
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8 transition-shadow hover:shadow-2xl">
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
          Question {questionNumber} of {totalQuestions}
        </p>
      </div>
      <h2 className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100" dangerouslySetInnerHTML={{ __html: question.question }} />

      <div className="mt-6 space-y-4">
        {question.options.map((option, index) => (
          <div
            key={index}
            onClick={() => onAnswerSelect(option)}
            className={`flex items-center p-4 border rounded-lg transition-all duration-200 cursor-pointer ${getOptionClasses(option)}`}
          >
            <span className="flex-grow font-medium" dangerouslySetInnerHTML={{ __html: option }} />
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!selectedAnswer}
        className="mt-8 w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:transform-none"
      >
        {questionNumber === totalQuestions ? 'View Results' : 'Next Question'}
      </button>
    </div>
  );
};

export default QuizView;