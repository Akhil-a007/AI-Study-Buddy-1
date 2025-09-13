import React from 'react';

const PptIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 2.25A2.25 2.25 0 016 0h12a2.25 2.25 0 012.25 2.25v19.5A2.25 2.25 0 0118 24H6a2.25 2.25 0 01-2.25-2.25V2.25z" fill="currentColor" fillOpacity="0.1"/>
</svg>
);

export default PptIcon;