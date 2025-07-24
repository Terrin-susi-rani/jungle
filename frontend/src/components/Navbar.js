import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-jungle-900/90 backdrop-blur-sm border-b-2 border-jungle-400 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="text-2xl">🌿</div>
            <span className="text-white font-comic text-xl font-bold">
              Jungle Quest
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-jungle-200 hover:text-white transition-colors duration-200 font-nunito"
                >
                  Dashboard
                </Link>
                
                {user.role === 'admin' && (
                  <>
                    <Link 
                      to="/admin/create-level" 
                      className="text-jungle-200 hover:text-white transition-colors duration-200 font-nunito"
                    >
                      Create Level
                    </Link>
                    <Link 
                      to="/admin/levels" 
                      className="text-jungle-200 hover:text-white transition-colors duration-200 font-nunito"
                    >
                      Manage Levels
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="hidden md:flex items-center space-x-2">
                  <div className="w-8 h-8 bg-jungle-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {(user && user.name && user.name.charAt) ? user.name.charAt(0).toUpperCase() : '?'}
                    </span>
                  </div>
                  <div className="text-white">
                    <div className="font-nunito text-sm">{user.name}</div>
                    <div className="text-jungle-300 text-xs capitalize">{user.role}</div>
                  </div>
                </div>

                {/* Score Badge */}
                <div className="tech-button px-3 py-1 rounded-full text-sm font-bold !shadow-none !py-1 !px-4">
                  {user.totalScore || 0} pts
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="tech-button text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="bg-accent-cyan hover:bg-accent-purple text-white px-4 py-2 rounded-lg font-inter text-sm transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="tech-button text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 