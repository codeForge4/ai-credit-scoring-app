import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreditAnalysis from './pages/CreditAnalysis';
import FinancialTracking from './pages/FinancialTracking';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin()) return <Navigate to="/dashboard" />;
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user, isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={isAdmin() ? "/admin" : "/dashboard"} /> : <Login />} />
      <Route path="/" element={<Navigate to={user ? (isAdmin() ? "/admin" : "/dashboard") : "/login"} />} />
      
      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Layout>
              <AdminDashboard />
            </Layout>
          </AdminRoute>
        }
      />
      
      {/* User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/credit-analysis"
        element={
          <ProtectedRoute>
            <Layout>
              <CreditAnalysis />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/financial-tracking"
        element={
          <ProtectedRoute>
            <Layout>
              <FinancialTracking />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <AppRoutes />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;