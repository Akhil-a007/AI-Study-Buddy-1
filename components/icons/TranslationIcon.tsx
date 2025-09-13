import React from 'react';

const TranslationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.965 14.28 9 15.625 9c1.506 0 2.723-1.035 3.166-2.416m-1.833 2.416v3.75m-3.75-3.75c.621 1.035 1.666 1.666 2.75 1.666s2.129-.631 2.75-1.666m-2.75 0V5.25m-3.75 0c.621 1.035 1.666 1.666 2.75 1.666s2.129-.631 2.75-1.666m0 0V3.375c0-.621-.504-1.125-1.125-1.125H10.125c-.621 0-1.125.504-1.125 1.125v1.875m-3.75 0c.621 1.035 1.666 1.666 2.75 1.666s2.129-.631 2.75-1.666M9 5.25V3m0 2.25h.008v.008H9V5.25z" />
  </svg>
);

export default TranslationIcon;