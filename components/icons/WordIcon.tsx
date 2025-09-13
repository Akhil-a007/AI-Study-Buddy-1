import React from 'react';

const WordIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12.75h.008v.008H9v-.008zm.75-4.5h.008v.008h-.008v-.008zm.75 2.25h.008v.008h-.008V12zm2.25-4.5h.008v.008h-.008V9.75zm.75 2.25h.008v.008h-.008V12zm.75 2.25h.008v.008h-.008v-.008zm.75-6h.008v.008h-.008v-.008zm-5.25 6h.008v.008h-.008v-.008z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 2.25A2.25 2.25 0 016 0h12a2.25 2.25 0 012.25 2.25v19.5A2.25 2.25 0 0118 24H6a2.25 2.25 0 01-2.25-2.25V2.25z" fill="currentColor" fillOpacity="0.1"/>
</svg>
);

export default WordIcon;