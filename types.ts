export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizData {
  keyEntities: string[];
  quiz: QuizQuestion[];
}

export interface Flashcard {
  term: string;
  definition: string;
}

export interface FlashcardData {
  keyConcepts: string[];
  flashcards: Flashcard[];
}

export interface SummaryData {
    title: string;
    summary: string;
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING_QUIZ = 'GENERATING_QUIZ',
  TAKING_QUIZ = 'TAKING_QUIZ',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR',
  SUMMARIZING = 'SUMMARIZING',
  SUMMARY_DISPLAY = 'SUMMARY_DISPLAY',
  GENERATING_FLASHCARDS = 'GENERATING_FLASHCARDS',
  FLASHCARDS_DISPLAY = 'FLASHCARDS_DISPLAY',
}

export interface HistoryItem {
  id: string;
  title: string;
  timestamp: number;
  quizData: QuizData;
  userAnswers: (string | null)[];
}

export interface User {
  identifier: string; // email or phone
}
