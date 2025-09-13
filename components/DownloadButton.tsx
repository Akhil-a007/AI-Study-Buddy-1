
import React from 'react';
import { QuizData } from '../types';
import DownloadIcon from './icons/DownloadIcon';

interface DownloadButtonProps {
  data: QuizData;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ data }) => {
  const handleDownload = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "quiz.json";
    link.click();
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center justify-center bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-slate-700 transition-colors"
    >
      <DownloadIcon className="h-5 w-5 mr-2" />
      Download Quiz JSON
    </button>
  );
};

export default DownloadButton;
