import React from 'react';

const SpeechIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-12 0v1.5a6 6 0 006 6zM12 12.75v6.75a3 3 0 01-3-3v-3.75a3 3 0 013-3zM12 12.75v-1.5a3 3 0 00-3-3H9a3 3 0 00-3 3v1.5a3 3 0 003 3h.75m6-6h.75a3 3 0 013 3v1.5a3 3 0 01-3 3h-.75m-6-6v-1.5a3 3 0 013-3h1.5a3 3 0 013 3v1.5m-6 0h1.5m-1.5 0h-1.5m0 0v6.75m0-6.75v-1.5a3 3 0 00-3-3H9a3 3 0 00-3 3v1.5a3 3 0 003 3h.75" />
  </svg>
);

export default SpeechIcon;