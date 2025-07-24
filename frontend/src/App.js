import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LevelDetail from './pages/LevelDetail';
import AdminCreateLevel from './pages/AdminCreateLevel';
import AdminLevels from './pages/AdminLevels';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = ['student', 'admin'] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-jungle-800 to-jungle-900 flex items-center justify-center">
        <div className="text-white text-2xl font-comic">Loading Jungle Quest...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  return <ProtectedRoute allowedRoles={['admin']}>{children}</ProtectedRoute>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-jungle-800 via-jungle-700 to-jungle-900">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/levels/:id" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <LevelDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/create-level" 
                element={
                  <AdminRoute>
                    <AdminCreateLevel />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/levels" 
                element={
                  <AdminRoute>
                    <AdminLevels />
                  </AdminRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 