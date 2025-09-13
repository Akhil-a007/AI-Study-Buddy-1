import React from 'react';

const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="0.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-2.5-2.5"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 2.5-2.5"/>
    <path d="M5 12a2.5 2.5 0 0 0-2.5-2.5c-3 0-3 5 0 5A2.5 2.5 0 0 0 5 12Z"/>
    <path d="M19 12a2.5 2.5 0 0 1 2.5-2.5c3 0 3 5 0 5A2.5 2.5 0 0 1 19 12Z"/>
    <path d="M9.5 2c-1.5 0-2.5 1-2.5 2.5S8 7 9.5 7"/>
    <path d="M14.5 2c1.5 0 2.5 1 2.5 2.5S16 7 14.5 7"/>
    <path d="M9.5 17c-1.5 0-2.5 1-2.5 2.5S8 22 9.5 22"/>
    <path d="M14.5 17c1.5 0 2.5 1 2.5 2.5S16 22 14.5 22"/>
    <path d="M5 12c-1.5 0-2.5 1-2.5 2.5S3.5 17 5 17"/>
    <path d="M19 12c1.5 0 2.5 1 2.5 2.5S20.5 17 19 17"/>
    <path d="M5 12c-1.5 0-2.5-1-2.5-2.5S3.5 7 5 7"/>
    <path d="M19 12c1.5 0 2.5-1 2.5-2.5S20.5 7 19 7"/>
    <path d="M9.5 2c0 1.5-1 2.5-2.5 2.5S4.5 3.5 4.5 2"/>
    <path d="M14.5 2c0 1.5 1 2.5 2.5 2.5S19.5 3.5 19.5 2"/>
    <path d="M9.5 22c0-1.5-1-2.5-2.5-2.5S4.5 20.5 4.5 22"/>
    <path d="M14.5 22c0-1.5 1 2.5 2.5 2.5S19.5 20.5 19.5 22"/>
  </svg>
);

export default BrainIcon;
