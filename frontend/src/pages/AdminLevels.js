import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLevels = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/levels/admin/all`, {
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
    fetchLevels();
    // eslint-disable-next-line
  }, [token, API_BASE_URL]);

  const handleDelete = async (levelId) => {
    if (!window.confirm('Are you sure you want to delete this level?')) {
      return;
    }

    setDeleteLoading(levelId);

    try {
      const response = await fetch(`${API_BASE_URL}/levels/${levelId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setLevels(levels.filter(level => level._id !== levelId));
      } else {
        setError('Failed to delete level');
      }
    } catch (error) {
      setError('Failed to delete level');
    } finally {
      setDeleteLoading(null);
    }
  };

  const toggleLevelStatus = async (levelId, currentStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/levels/${levelId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        setLevels(levels.map(level => 
          level._id === levelId 
            ? { ...level, isActive: !currentStatus }
            : level
        ));
      } else {
        setError('Failed to update level status');
      }
    } catch (error) {
      setError('Failed to update level status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-2xl font-comic">Loading levels...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="jungle-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-comic font-bold text-jungle-800 mb-2">
              🌿 Manage Challenges
            </h1>
            <p className="text-jungle-600 font-nunito">
              Create, edit, and manage Python coding challenges
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/create-level')}
            className="jungle-button"
          >
            + Create New Level
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Levels List */}
      <div className="jungle-card p-6">
        <h2 className="text-xl font-comic font-bold text-jungle-800 mb-4">
          All Challenges ({levels.length})
        </h2>

        {levels.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🌿</div>
            <p className="text-jungle-600 font-nunito mb-4">No challenges created yet.</p>
            <button
              onClick={() => navigate('/admin/create-level')}
              className="jungle-button"
            >
              Create Your First Challenge
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {levels.map((level) => (
              <div key={level._id} className="border border-jungle-200 rounded-lg p-4 hover:bg-jungle-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-jungle-800 font-nunito">
                        {level.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        level.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        level.difficulty === 'intermediate' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {level.difficulty}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        level.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {level.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <p className="text-jungle-600 text-sm mb-2 line-clamp-2">
                      {level.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-jungle-500">
                      <span>Order: {level.order}</span>
                      <span>Points: {level.points}</span>
                      <span>Created: {new Date(level.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleLevelStatus(level._id, level.isActive)}
                      className={`px-3 py-1 rounded text-sm font-bold ${
                        level.isActive 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {level.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    
                    <button
                      onClick={() => navigate(`/admin/edit-level/${level._id}`)}
                      className="bg-jungle-500 hover:bg-jungle-600 text-white px-3 py-1 rounded text-sm font-bold"
                    >
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDelete(level._id)}
                      disabled={deleteLoading === level._id}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-bold disabled:opacity-50"
                    >
                      {deleteLoading === level._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="jungle-card p-6">
        <h2 className="text-xl font-comic font-bold text-jungle-800 mb-4">
          📊 Statistics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-jungle-600">{levels.length}</div>
            <div className="text-jungle-500 text-sm">Total Levels</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {levels.filter(l => l.isActive).length}
            </div>
            <div className="text-jungle-500 text-sm">Active Levels</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {levels.filter(l => l.difficulty === 'beginner').length}
            </div>
            <div className="text-jungle-500 text-sm">Beginner</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {levels.filter(l => l.difficulty === 'advanced').length}
            </div>
            <div className="text-jungle-500 text-sm">Advanced</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLevels; 