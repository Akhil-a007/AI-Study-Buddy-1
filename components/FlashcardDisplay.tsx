import React, { useState } from 'react';
import { FlashcardData } from '../types';
import KeyEntitiesDisplay from './KeyEntitiesDisplay';

interface FlashcardDisplayProps {
  flashcardData: FlashcardData;
  onRestart: () => void;
}

const FlashcardDisplay: React.FC<FlashcardDisplayProps> = ({ flashcardData, onRestart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { flashcards, keyConcepts } = flashcardData;
  const currentCard = flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    }, 150); // Delay to allow card to flip back
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };
  
  const cardContent = (
    <div
      className="w-full h-80 rounded-xl shadow-lg cursor-pointer transition-transform duration-500"
      style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* Front of Card */}
      <div className="absolute w-full h-full bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center p-6" style={{ backfaceVisibility: 'hidden' }}>
        <p className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100">{currentCard.term}</p>
      </div>
      {/* Back of Card */}
      <div className="absolute w-full h-full bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center p-6" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
        <p className="text-lg text-center text-slate-700 dark:text-slate-200">{currentCard.definition}</p>
      </div>
    </div>
  );


  return (
    <div className="animate-fade-in">
        <KeyEntitiesDisplay entities={keyConcepts} />
        <div className="mt-8">
            <div style={{ perspective: '1000px' }}>
                {cardContent}
            </div>

            <div className="flex justify-between items-center mt-6">
                <button onClick={handlePrev} className="bg-slate-200 dark:bg-slate-700 font-bold py-3 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                    Previous
                </button>
                <p className="font-semibold text-slate-600 dark:text-slate-300">
                    {currentIndex + 1} / {flashcards.length}
                </p>
                <button onClick={handleNext} className="bg-slate-200 dark:bg-slate-700 font-bold py-3 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                    Next
                </button>
            </div>
        </div>

      <button
        onClick={onRestart}
        className="mt-10 w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition-colors transform hover:scale-105"
      >
        Create a New Set
      </button>
    </div>
  );
};

export default FlashcardDisplay;
