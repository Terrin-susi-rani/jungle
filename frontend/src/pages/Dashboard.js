// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import JungleMap from '../components/JungleMap';
// import ProfileBox from '../components/ProfileBox';

// const Dashboard = () => {
//   const { user, token } = useAuth();
//   const [levels, setLevels] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

//   useEffect(() => {
//     fetchLevels();
//   }, [user]);

//   const fetchLevels = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/levels`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setLevels(data.levels);
//       } else {
//         setError('Failed to load levels');
//       }
//     } catch (error) {
//       setError('Failed to load levels');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate progress percent for ProfileBox
//   const getCompletedLevels = () => user.progress.filter(p => p.completed).length;
//   const progressPercent = levels.length > 0 ? Math.round((getCompletedLevels() / levels.length) * 100) : 0;

//   // Map levels to include completed status
//   // const levelsWithStatus = levels.map(lvl => ({
//   //   ...lvl,
//   //   completed: user.progress.some(p => p.levelId && p.levelId.toString() === lvl._id.toString() && p.completed)
//   // }));
// const levelsWithStatus = levels.map(lvl => ({
//   ...lvl,
//   completed: user.progress.some(p => 
//     (p.levelId && (p.levelId.toString() === lvl._id.toString()))
//   )
// }));
//   // Separate available and completed levels
//   const completedLevels = levelsWithStatus.filter(lvl => lvl.completed);
//   const availableLevels = levelsWithStatus.filter(lvl => !lvl.completed);
  

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-white text-2xl font-comic">Loading your jungle adventure...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {/* Profile and Map */}
//       <div className="flex flex-col md:flex-row gap-8 items-start">
//         <div className="w-full md:w-1/3">
//           <ProfileBox user={{ ...user, progressPercent }} />
//         </div>
//         {/* <div className="flex-1">
//           <JungleMap levels={levelsWithStatus} />
//         </div> */}
//       </div>

//       {/* Available Levels Section */}
//       <div className="tech-card p-6">
//         <h2 className="text-xl font-inter font-bold text-accent-cyan mb-4">Available Challenges</h2>
//         {availableLevels.length === 0 && (
//           <div className="text-tech-300 font-inter">No available challenges. Try completed below!</div>
//         )}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {availableLevels.map((level) => (
//             <Link 
//               key={level._id} 
//               to={`/levels/${level._id}`}
//               className="block transition-transform duration-200 hover:scale-105"
//             >
//               <div className="tech-card p-6 h-full">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-bold text-tech-100 font-inter">
//                     {level.title}
//                   </h3>
//                 </div>
//                 <p className="text-tech-300 text-sm mb-4 line-clamp-2">
//                   {level.description}
//                 </p>
//                 <div className="flex items-center justify-between">
//                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                     level.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
//                     level.difficulty === 'intermediate' ? 'bg-accent-cyan text-tech-900' :
//                     'bg-accent-purple text-tech-900'
//                   }`}>
//                     {level.difficulty}
//                   </span>
//                   <span className="text-accent-cyan font-bold">
//                     {level.points} pts
//                   </span>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* Completed Levels Section */}
//       <div className="tech-card p-6">
//         <h2 className="text-xl font-inter font-bold text-accent-purple mb-4">Completed Challenges</h2>
//         {completedLevels.length === 0 && (
//           <div className="text-tech-300 font-inter">No completed challenges yet.</div>
//         )}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {completedLevels.map((level) => (
//             <div key={level._id} className="tech-card p-6 h-full opacity-70">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-bold text-tech-100 font-inter">
//                   {level.title}
//                 </h3>
//                 <div className="text-2xl">✅</div>
//               </div>
//               <p className="text-tech-300 text-sm mb-4 line-clamp-2">
//                 {level.description}
//               </p>
//               <div className="flex items-center justify-between">
//                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                   level.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
//                   level.difficulty === 'intermediate' ? 'bg-accent-cyan text-tech-900' :
//                   'bg-accent-purple text-tech-900'
//                 }`}>
//                   {level.difficulty}
//                 </span>
//                 <span className="text-accent-purple font-bold">
//                   {level.points} pts
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard; 


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import JungleMap from '../components/JungleMap';
import ProfileBox from '../components/ProfileBox';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchLevels();
  }, [user]);

  const fetchLevels = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/levels`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLevels(data.levels);
      } else {
        setError('Failed to load levels');
      }
    } catch (error) {
      setError('Failed to load levels');
    } finally {
      setLoading(false);
    }
  };

  const normalizeId = (id) => {
    if (!id) return null;
    if (typeof id === 'object') {
      return id.$oid || id._id || id.toString();
    }
    return id.toString();
  };

  // Calculate progress percent for ProfileBox
  const getCompletedLevels = () => user?.progress?.filter(p => p.completed).length || 0;
  const progressPercent = levels.length > 0 ? Math.round((getCompletedLevels() / levels.length) * 100) : 0;

  // Map levels to include completed status
  const levelsWithStatus = levels.map(level => {
    const isCompleted = user?.progress?.some(progress => {
      // Handle both the ID and full object cases
      const progressLevelId = progress.levelId?._id || progress.levelId;
      const normalizedProgressId = normalizeId(progressLevelId);
      const normalizedLevelId = normalizeId(level._id);
      
      return normalizedProgressId === normalizedLevelId && progress.completed;
    });

    return {
      ...level,
      completed: !!isCompleted
    };
  });

  // Separate available and completed levels
  const completedLevels = levelsWithStatus.filter(lvl => lvl.completed);
  const availableLevels = levelsWithStatus.filter(lvl => !lvl.completed);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-2xl font-comic">Loading your jungle adventure...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile and Map */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3">
          <ProfileBox user={{ ...user, progressPercent }} />
        </div>
        {user.role === 'student' && (
          <div className="flex-1">
          <JungleMap levels={levelsWithStatus} />
        </div>
        )
        }
      </div>

      {/* Available Levels Section */}
      <div className="tech-card p-6">
        <h2 className="text-xl font-inter font-bold text-accent-cyan mb-4">Available Challenges</h2>
        {availableLevels.length === 0 ? (
          <div className="text-tech-300 font-inter">No available challenges. Try completing more levels!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableLevels.map((level) => (
              <Link 
                key={level._id} 
                to={`/levels/${level._id}`}
                className="block transition-transform duration-200 hover:scale-105"
              >
                <div className="tech-card p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-tech-100 font-inter">
                      {level.title}
                    </h3>
                  </div>
                  <p className="text-tech-300 text-sm mb-4 line-clamp-2">
                    {level.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      level.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      level.difficulty === 'intermediate' ? 'bg-accent-cyan text-tech-900' :
                      'bg-accent-purple text-tech-900'
                    }`}>
                      {level.difficulty}
                    </span>
                    <span className="text-accent-cyan font-bold">
                      {level.points} pts
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      
      {/* Completed Levels Section */}
      {/* <div className="tech-card p-6">
        <h2 className="text-xl font-inter font-bold text-accent-purple mb-4">Completed Challenges</h2>
        {completedLevels.length === 0 ? (
          <div className="text-tech-300 font-inter">No completed challenges yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedLevels.map((level) => (
              <div key={level._id} className="tech-card p-6 h-full opacity-70">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-tech-100 font-inter">
                    {level.title}
                  </h3>
                  <div className="text-2xl">✅</div>
                </div>
                <p className="text-tech-300 text-sm mb-4 line-clamp-2">
                  {level.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    level.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    level.difficulty === 'intermediate' ? 'bg-accent-cyan text-tech-900' :
                    'bg-accent-purple text-tech-900'
                  }`}>
                    {level.difficulty}
                  </span>
                  <span className="text-accent-purple font-bold">
                    {level.points} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div> */}

      {completedLevels.length > 0 && (
  <div className="tech-card p-6">
    <h2 className="text-xl font-inter font-bold text-accent-purple mb-4">Completed Challenges</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {completedLevels.map((level) => (
        <div key={level._id} className="tech-card p-6 h-full opacity-70">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-tech-100 font-inter">
              {level.title}
            </h3>
            <div className="text-2xl">✅</div>
          </div>
          <p className="text-tech-300 text-sm mb-4 line-clamp-2">
            {level.description}
          </p>
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              level.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
              level.difficulty === 'intermediate' ? 'bg-accent-cyan text-tech-900' :
              'bg-accent-purple text-tech-900'
            }`}>
              {level.difficulty}
            </span>
            <span className="text-accent-purple font-bold">
              {level.points} pts
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
    </div>
  );
};

export default Dashboard;