import React, { useState, useCallback, useEffect } from 'react';
import { QuizData, AppState, HistoryItem, User, SummaryData, FlashcardData } from './types';
import { generatePracticeQuestions, summarizeText, generateFlashcards } from './services/geminiService';
import Header from './components/Header';
import InteractionHub from './components/QuizInput';
import KeyEntitiesDisplay from './components/KeyEntitiesDisplay';
import QuizView from './components/QuizView';
import QuizResults from './components/QuizResults';
import DownloadButton from './components/DownloadButton';
import Spinner from './components/Spinner';
import Login from './components/Login';
import SummaryDisplay from './components/SummaryDisplay';
import FlashcardDisplay from './components/FlashcardDisplay';
import IntroScreen from './components/IntroScreen';

const App: React.FC = () => {
  const [studyText, setStudyText] = useState<string>('');
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [flashcardData, setFlashcardData] = useState<FlashcardData | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // This timer controls how long the intro screen is shown
    const introTimer = setTimeout(() => {
      setShowIntro(false);
    }, 3000); // Show intro for 3 seconds

    return () => clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    // This effect runs only when the intro is finished
    if (!showIntro) {
      try {
        const storedUser = localStorage.getItem('quizUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const storedHistory = localStorage.getItem('quizHistory');
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (e) {
        console.error("Failed to load data from localStorage", e);
      }
    }
  }, [showIntro]);

  const handleLogin = (identifier: string) => {
    const userData = { identifier };
    setUser(userData);
    try {
      localStorage.setItem('quizUser', JSON.stringify(userData));
    } catch (e) {
      console.error("Failed to save user to localStorage", e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    handleRestart();
    try {
      localStorage.removeItem('quizUser');
    } catch (e) {
      console.error("Failed to remove user from localStorage", e);
    }
  };

  const saveQuizToHistory = useCallback((quizDataToSave: QuizData, answers: (string | null)[]) => {
    const newHistoryItem: HistoryItem = {
      id: new Date().toISOString(),
      title: quizDataToSave.keyEntities.slice(0, 3).join(', ') || 'General Quiz',
      timestamp: Date.now(),
      quizData: quizDataToSave,
      userAnswers: answers,
    };

    setHistory(prevHistory => {
      const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, 20); // Keep latest 20
      try {
        localStorage.setItem('quizHistory', JSON.stringify(updatedHistory));
      } catch (e) {
        console.error("Failed to save history to localStorage", e);
      }
      return updatedHistory;
    });
  }, []);

  const resetForNewTask = () => {
    setError(null);
    setQuizData(null);
    setSummaryData(null);
    setFlashcardData(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
  }

  const handleGeneratePracticeQuestions = useCallback(async (studentLevel: string) => {
    if (!studyText.trim()) {
      setError('Please enter some study material.');
      return;
    }
    resetForNewTask();
    setAppState(AppState.GENERATING_QUIZ);

    try {
      const data = await generatePracticeQuestions(studyText, studentLevel);
      if (data && data.quiz && data.quiz.length > 0) {
        setQuizData(data);
        setUserAnswers(new Array(data.quiz.length).fill(null));
        setAppState(AppState.TAKING_QUIZ);
      } else {
        throw new Error("The AI failed to generate valid questions. Please try refining your text.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setAppState(AppState.ERROR);
    }
  }, [studyText]);

  const handleSummarize = useCallback(async () => {
    if (!studyText.trim()) {
      setError('Please enter some text to summarize.');
      return;
    }
    resetForNewTask();
    setAppState(AppState.SUMMARIZING);

    try {
      const data = await summarizeText(studyText);
      setSummaryData(data);
      setAppState(AppState.SUMMARY_DISPLAY);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setAppState(AppState.ERROR);
    }
  }, [studyText]);

  const handleGenerateFlashcards = useCallback(async () => {
    if (!studyText.trim()) {
      setError('Please enter some text to generate flashcards from.');
      return;
    }
    resetForNewTask();
    setAppState(AppState.GENERATING_FLASHCARDS);

    try {
      const data = await generateFlashcards(studyText);
      setFlashcardData(data);
      setAppState(AppState.FLASHCARDS_DISPLAY);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setAppState(AppState.ERROR);
    }
  }, [studyText]);

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (quizData && currentQuestionIndex < quizData.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (quizData) {
      setAppState(AppState.RESULTS);
      saveQuizToHistory(quizData, userAnswers);
    }
  };

  const handleRestart = () => {
    setStudyText('');
    resetForNewTask();
    setAppState(AppState.IDLE);
  };

  const handleLoadQuizFromHistory = (item: HistoryItem) => {
    setQuizData(item.quizData);
    setUserAnswers(item.userAnswers);
    setAppState(AppState.RESULTS);
  }

  const renderContent = () => {
    switch (appState) {
      case AppState.GENERATING_QUIZ:
      case AppState.SUMMARIZING:
      case AppState.GENERATING_FLASHCARDS:
        return (
          <div className="text-center p-8">
            <Spinner />
            <p className="text-lg text-slate-600 dark:text-slate-300 mt-4">AI is working its magic...</p>
          </div>
        );
      case AppState.TAKING_QUIZ:
        if (!quizData) return null;
        return (
          <>
            <KeyEntitiesDisplay entities={quizData.keyEntities} />
            <QuizView
              question={quizData.quiz[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={quizData.quiz.length}
              selectedAnswer={userAnswers[currentQuestionIndex]}
              onAnswerSelect={handleAnswerSelect}
              onNext={handleNextQuestion}
            />
          </>
        );
      case AppState.RESULTS:
        if (!quizData) return null;
        return (
          <QuizResults
            quiz={quizData.quiz}
            userAnswers={userAnswers}
            onRestart={handleRestart}
          />
        );
      case AppState.SUMMARY_DISPLAY:
        if (!summaryData) return null;
        return <SummaryDisplay summaryData={summaryData} onRestart={handleRestart} />;
      case AppState.FLASHCARDS_DISPLAY:
        if (!flashcardData) return null;
        return <FlashcardDisplay flashcardData={flashcardData} onRestart={handleRestart} />;
      case AppState.ERROR:
        return (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative my-4" role="alert">
            <strong className="font-bold">Oh no! </strong>
            <span className="block sm:inline">{error}</span>
            <button onClick={handleRestart} className="ml-4 bg-red-700 text-white font-bold py-1 px-3 rounded">
              Try Again
            </button>
          </div>
        );
      case AppState.IDLE:
      default:
        return (
          <InteractionHub
            studyText={studyText}
            setStudyText={setStudyText}
            onGenerateQuestions={handleGeneratePracticeQuestions}
            onSummarize={handleSummarize}
            onGenerateFlashcards={handleGenerateFlashcards}
          />
        );
    }
  };

  if (showIntro) {
    return <IntroScreen />;
  }

  if (!user) {
    return <div className="animate-fade-in"><Login onLogin={handleLogin} /></div>;
  }

  return (
    <div className="animate-fade-in min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <Header
          user={user}
          onLogout={handleLogout}
          history={history}
          onLoadHistoryItem={handleLoadQuizFromHistory}
        />
        <main className="mt-8">
          {renderContent()}
          {quizData && (appState === AppState.RESULTS || appState === AppState.TAKING_QUIZ) && (
            <div className="mt-8 flex justify-center">
              <DownloadButton data={quizData} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;