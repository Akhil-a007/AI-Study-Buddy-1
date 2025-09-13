import React from 'react';

const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a15.045 15.045 0 01-7.5 0C4.505 20.995 2.25 18.288 2.25 15c0-1.562.505-2.94 1.35-4.125m15.09 0c.845 1.185 1.35 2.563 1.35 4.125 0 3.288-2.255 5.995-5.04 6.689m-1.5.189a5.981 5.981 0 01-1.5.189M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default LightbulbIcon;
