import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function JungleMap({ levels }) {
  const navigate = useNavigate();
  // Find the first incomplete level index
  const firstIncompleteIdx = levels.findIndex(lvl => !lvl.completed);
  // If all completed, allow all
  const unlockedIdx = firstIncompleteIdx === -1 ? levels.length : firstIncompleteIdx + 1;

  return (
    <div className="flex overflow-x-auto py-8 gap-4">
      {levels.map((level, idx) => {
        const isUnlocked = idx <= unlockedIdx - 1;
        return (
          <div key={level._id} className="relative flex flex-col items-center">
            <button
              disabled={!isUnlocked}
              onClick={() => {
                if (isUnlocked) {
                  console.log('Navigating to level:', level._id, `/levels/${level._id}`);
                  navigate(`/levels/${level._id}`);
                }
              }}
              className={`rounded-full w-20 h-20 flex items-center justify-center shadow-tech border-4 font-inter text-lg font-bold transition-all duration-200
                ${level.completed ? 'bg-green-400 border-green-600 text-white' : isUnlocked ? 'bg-accent-cyan border-accent-purple text-tech-900' : 'bg-tech-700 border-tech-500 text-tech-400 opacity-60 cursor-not-allowed'}
                ${isUnlocked ? 'hover:scale-105' : ''}`}
            >
              {`Level ${idx + 1}`}
            </button>
            <div className="mt-2 text-xs font-inter text-tech-200">
              {level.completed ? 'Completed' : isUnlocked ? 'Available' : 'Locked'}
            </div>
            {idx < levels.length - 1 && (
              <div className="absolute top-1/2 left-full w-16 h-2 bg-tech-500 rounded-full -translate-y-1/2 z-0"></div>
            )}
          </div>
        );
      })}
    </div>
  );
} 