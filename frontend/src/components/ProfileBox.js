// import React from 'react';

// export default function ProfileBox({ user }) {
//   return (
//     <div className="tech-card flex flex-col items-center p-6 bg-tech-800/80 rounded-2xl shadow-tech">
//       <div className="w-20 h-20 rounded-full bg-accent-cyan flex items-center justify-center mb-2 border-4 border-accent-purple">
//         <span className="text-5xl">🧑‍💻</span>
//       </div>
//       <div className="text-xl font-inter font-bold text-tech-100 mb-1">{user.name}</div>
//       <div className="text-tech-300 font-inter text-sm mb-2">{user.role}</div>
//       <div className="flex gap-2 mb-2">
//         {user.badges && user.badges.map((badge, idx) => (
//           <span key={idx} className="bg-accent-purple text-white px-2 py-1 rounded-full text-xs font-bold">🏅 {badge.name}</span>
//         ))}
//       </div>
      
//       <div className="w-full bg-tech-700 rounded-full h-3 mb-2">
//         <div className="progress-bar h-3 rounded-full transition-all duration-500" style={{ width: `${user.progressPercent || 0}%` }}></div>
//       </div>
//       <div className="text-xs text-tech-200">Progress: {user.progressPercent || 0}%</div>
//     </div>
//   );
// } 

import React from 'react';
import PropTypes from 'prop-types';

export default function ProfileBox({ user }) {
  // Default values for missing user properties
  const {
    name = 'Anonymous',
    role = 'guest',
    badges = [],
    progressPercent = 0,
    email = ''
  } = user || {};

  return (
    <div className="tech-card flex flex-col items-center p-6 bg-tech-800/80 rounded-2xl shadow-tech hover:shadow-tech-lg transition-shadow duration-300">
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center mb-4 border-4 border-tech-700 hover:border-accent-purple transition-all duration-300">
        <span className="text-5xl hover:scale-110 transition-transform duration-300">
          {role === 'admin' ? '👑' : role === 'mentor' ? '🧑‍🏫' : '🧑‍💻'}
        </span>
      </div>

      {/* User Info */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-inter font-bold text-tech-100 mb-1">{name}</h2>
        <p className="text-tech-300 font-inter text-sm mb-1">{email}</p>
        <span className="inline-block px-3 py-1 bg-tech-700 text-tech-200 text-xs font-bold rounded-full">
          {role.toUpperCase()}
        </span>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-4 max-w-xs">
          {badges.map((badge, idx) => (
            <div 
              key={idx} 
              className="relative group"
              title={badge.description || badge.name}
            >
              <span className="bg-accent-purple/90 hover:bg-accent-purple text-white px-3 py-1 rounded-full text-xs font-bold flex items-center transition-colors duration-200">
                🏅 {badge.name}
              </span>
              {badge.description && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-tech-900 text-tech-100 text-xs p-2 rounded shadow-lg z-10 min-w-[200px]">
                  {badge.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Progress (only for students) */}
      {role === 'student' && (
        <div className="w-full mt-2"> 
          <div className="flex justify-between text-xs text-tech-300 mb-1">
            <span>Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-tech-700 rounded-full h-2.5">
            <div 
              className="progress-bar h-2.5 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple transition-all duration-700 ease-out" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

ProfileBox.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.oneOf(['student', 'admin', 'mentor', 'guest']),
    email: PropTypes.string,
    badges: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string,
        earnedAt: PropTypes.string
      })
    ),
    progressPercent: PropTypes.number
  })
};