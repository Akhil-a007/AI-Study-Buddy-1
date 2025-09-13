import React, { useState, useRef, useEffect } from 'react';
import DocumentIcon from './icons/DocumentIcon';
import LightbulbIcon from './icons/LightbulbIcon';
import CopyIcon from './icons/CopyIcon';
import PdfIcon from './icons/PdfIcon';
import WordIcon from './icons/WordIcon';
import PptIcon from './icons/PptIcon';
import ImageIcon from './icons/ImageIcon';
import SpeechIcon from './icons/SpeechIcon';
import TranslationIcon from './icons/TranslationIcon';
import { translateText } from '../services/geminiService';
import { extractTextFromFile } from '../services/fileExtractorService';
import Spinner from './Spinner';

interface InteractionHubProps {
  studyText: string;
  setStudyText: (value: React.SetStateAction<string>) => void;
  onGenerateQuestions: (studentLevel: string) => void;
  onSummarize: () => void;
  onGenerateFlashcards: () => void;
}

type FeatureTab = 'questions' | 'summarize' | 'flashcards';

// @ts-ignore
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
}

const TabButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
    disabled?: boolean;
}> = ({ icon, label, isActive, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex-1 flex items-center justify-center gap-2 p-3 font-semibold text-sm rounded-t-lg transition-colors border-b-2 ${
            isActive 
            ? 'text-indigo-600 dark:text-indigo-400 border-indigo-500 bg-white dark:bg-slate-800' 
            : 'text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-700/50'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
        {icon}
        {label}
    </button>
);

const InteractionHub: React.FC<InteractionHubProps> = ({ studyText, setStudyText, onGenerateQuestions, onSummarize, onGenerateFlashcards }) => {
  const [activeTab, setActiveTab] = useState<FeatureTab>('questions');
  const [studentLevel, setStudentLevel] = useState('High School');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Input Tools State
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [processingError, setProcessingError] = useState<string | null>(null);

  // Speech Recognition State
  const [isRecording, setIsRecording] = useState(false);
  const finalTranscriptRef = useRef(''); // To store the final transcript part

  // Translation State
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [translationError, setTranslationError] = useState('');

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: any) => {
        let interim_transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscriptRef.current += event.results[i][0].transcript.trim() + ' ';
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        setStudyText(finalTranscriptRef.current + interim_transcript);
    };

    recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setProcessingError(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
    };

    recognition.onend = () => {
        setIsRecording(false);
    };

    return () => {
        if(recognition) {
            recognition.stop();
        }
    };
  }, [setStudyText]);

  useEffect(() => {
    // Clear processing error when user starts typing
    if (processingError) {
      setProcessingError(null);
    }
  }, [studyText]);

  const handleToggleRecording = () => {
      if (isRecording) {
          recognition?.stop();
      } else {
          finalTranscriptRef.current = studyText.trim() ? studyText.trim() + ' ' : '';
          setStudyText(finalTranscriptRef.current);
          recognition?.start();
      }
      setIsRecording(!isRecording);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProcessingError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setIsProcessingFile(true);
    const fileTypeName = file.name.split('.').pop()?.toUpperCase() || 'File';
    setProcessingMessage(`Processing ${fileTypeName}...`);
    
    try {
        const extractedText = await extractTextFromFile(file);
        if (extractedText && extractedText.trim()) {
            setStudyText(extractedText);
        } else {
            setProcessingError(`Could not extract any text from ${file.name}. The document might be empty or is an image-only file.`);
        }
    } catch (err) {
        setProcessingError(err instanceof Error ? err.message : 'An unknown error occurred while processing the file.');
    } finally {
        setIsProcessingFile(false);
        setProcessingMessage('');
    }
  };


  const handleTranslate = async () => {
    if (!studyText.trim()) {
        setTranslationError("There's nothing to translate.");
        return;
    }
    setIsTranslating(true);
    setTranslationError('');
    try {
        const translated = await translateText(studyText, targetLanguage);
        setStudyText(translated);
    } catch (err) {
        setTranslationError(err instanceof Error ? err.message : 'Translation failed.');
    } finally {
        setIsTranslating(false);
    }
  };

  useEffect(() => {
    if (translationError && studyText) {
        setTranslationError('');
    }
  }, [studyText, translationError]);


  const renderActionButton = () => {
    const isDisabled = !studyText.trim() || isProcessingFile;
    switch(activeTab) {
      case 'questions':
        return (
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-auto">
              <label htmlFor="student-level" className="sr-only">Student Level</label>
              <select 
                id="student-level"
                value={studentLevel} 
                onChange={(e) => setStudentLevel(e.target.value)} 
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                disabled={isProcessingFile}
              >
                <option>Middle School</option>
                <option>High School</option>
                <option>University</option>
                <option>Expert</option>
              </select>
            </div>
            <button
              onClick={() => onGenerateQuestions(studentLevel)}
              disabled={isDisabled}
              className="w-full sm:flex-1 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-wait"
            >
              Generate Questions
            </button>
          </div>
        );
      case 'summarize':
        return (
           <button
            onClick={onSummarize}
            disabled={isDisabled}
            className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-wait"
          >
            Summarize Text
          </button>
        );
      case 'flashcards':
        return (
          <button
            onClick={onGenerateFlashcards}
            disabled={isDisabled}
            className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-wait"
          >
            Generate Flashcards
          </button>
        );
    }
  }

  const inputButtonStyles = "flex flex-col items-center justify-center gap-2 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-wait disabled:transform-none";

  return (
    <div className="bg-transparent opacity-0 animate-fade-in" style={{ animationDelay: '0.5s' }}>
      <div className="flex bg-slate-200/50 dark:bg-slate-900/50 p-1 rounded-t-lg">
        <TabButton icon={<DocumentIcon className="w-5 h-5"/>} label="Practice Questions" isActive={activeTab === 'questions'} onClick={() => setActiveTab('questions')} disabled={isProcessingFile}/>
        <TabButton icon={<LightbulbIcon className="w-5 h-5"/>} label="Summarize" isActive={activeTab === 'summarize'} onClick={() => setActiveTab('summarize')} disabled={isProcessingFile}/>
        <TabButton icon={<CopyIcon className="w-5 h-5"/>} label="Flashcards" isActive={activeTab === 'flashcards'} onClick={() => setActiveTab('flashcards')} disabled={isProcessingFile}/>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-b-xl shadow-lg p-6 sm:p-8 transition-shadow hover:shadow-2xl">
          <div>
            <label htmlFor="study-material" className="block text-lg font-semibold mb-3 text-slate-700 dark:text-slate-200 text-center">
              Paste Text or Upload a File
            </label>
            <div className="relative">
              {isProcessingFile && (
                <div className="absolute inset-0 bg-slate-100/80 dark:bg-slate-900/80 z-10 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm">
                  <Spinner />
                  <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{processingMessage}</p>
                </div>
              )}
              <textarea
                id="study-material"
                value={studyText}
                onChange={(e) => setStudyText(e.target.value)}
                placeholder="Paste your lecture notes, article, or any text here..."
                className="w-full h-60 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors dark:text-slate-200"
                disabled={isProcessingFile}
              />
            </div>
          </div>

          <div className="mt-4">
             <div className="h-6 text-center text-sm">
                {processingError && <p className="text-red-500 animate-fade-in">{processingError}</p>}
             </div>
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white dark:bg-slate-800 px-3 text-base font-semibold leading-6 text-slate-700 dark:text-slate-300">Input Tools</span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx,.png,.jpg,.jpeg,.webp" />
                <button onClick={() => fileInputRef.current?.click()} disabled={isProcessingFile} className={inputButtonStyles}>
                    <PdfIcon className="w-7 h-7 text-red-500"/>
                    <span className="text-sm font-medium">PDF</span>
                </button>
                 <button onClick={() => fileInputRef.current?.click()} disabled={isProcessingFile} className={inputButtonStyles}>
                    <WordIcon className="w-7 h-7 text-blue-500"/>
                    <span className="text-sm font-medium">Word</span>
                </button>
                 <button onClick={() => fileInputRef.current?.click()} disabled={isProcessingFile} className={inputButtonStyles}>
                    <PptIcon className="w-7 h-7 text-orange-500"/>
                    <span className="text-sm font-medium">PPT</span>
                </button>
                <button onClick={() => fileInputRef.current?.click()} disabled={isProcessingFile} className={inputButtonStyles}>
                    <ImageIcon className="w-7 h-7 text-green-500"/>
                    <span className="text-sm font-medium">Image</span>
                </button>
                <button 
                    onClick={handleToggleRecording}
                    disabled={!recognition || isProcessingFile}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-wait disabled:transform-none ${
                        isRecording 
                        ? 'bg-red-100 dark:bg-red-900/50' 
                        : 'bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                >
                    <SpeechIcon className={`w-7 h-7 ${isRecording ? 'text-red-500' : 'text-purple-500'}`}/>
                    <span className="text-sm font-medium">{isRecording ? 'Stop Recording' : 'Record Audio'}</span>
                    {isRecording && <span className="text-xs text-red-500 animate-pulse">Listening...</span>}
                    {!recognition && <span className="text-xs text-slate-500">Not Supported</span>}
                </button>
                <div className={`${inputButtonStyles} items-stretch`}>
                    <div className="flex items-center gap-2">
                        <TranslationIcon className="w-7 h-7 text-cyan-500 flex-shrink-0"/>
                        <select
                            value={targetLanguage}
                            onChange={(e) => setTargetLanguage(e.target.value)}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-sm"
                            aria-label="Target language for translation"
                            disabled={isProcessingFile}
                        >
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                            <option>Japanese</option>
                            <option>Mandarin</option>
                            <option>Hindi</option>
                        </select>
                    </div>
                    <button onClick={handleTranslate} disabled={isTranslating || !studyText.trim() || isProcessingFile} className="w-full text-center mt-2 p-2 bg-cyan-500 text-white rounded-md text-sm font-semibold hover:bg-cyan-600 disabled:bg-slate-400 dark:disabled:bg-slate-500 transition-colors disabled:cursor-wait">
                        {isTranslating ? 'Translating...' : 'Translate Text'}
                    </button>
                    {translationError && <p className="text-xs text-red-500 mt-1">{translationError}</p>}
                </div>
            </div>
          </div>
          
          {renderActionButton()}
      </div>
    </div>
  );
};

export default InteractionHub;