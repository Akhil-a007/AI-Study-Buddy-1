
import React from 'react';

interface KeyEntitiesDisplayProps {
  entities: string[];
}

const KeyEntitiesDisplay: React.FC<KeyEntitiesDisplayProps> = ({ entities }) => {
  if (!entities || entities.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 my-8">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Key Concepts Identified</h2>
      <div className="flex flex-wrap gap-2">
        {entities.map((entity, index) => (
          <span
            key={index}
            className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 text-sm font-medium px-3 py-1 rounded-full"
          >
            {entity}
          </span>
        ))}
      </div>
    </div>
  );
};

export default KeyEntitiesDisplay;
