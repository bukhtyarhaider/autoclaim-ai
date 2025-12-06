import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ScanPage from './pages/ScanPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={
            <AppLayout 
              sidebar={<Sidebar />} 
              header={<TopBar />}
            >
              <React.Suspense fallback={<div>Loading...</div>}>
                {/* Check Outlet is handled by AppLayout? No, AppLayout expects children. 
                    We need a Wrapper component that passes Outlet as child. */}
                <RouterOutlet /> 
              </React.Suspense>
            </AppLayout>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Helper to render Outlet inside AppLayout
import { Outlet } from 'react-router-dom';
const RouterOutlet = () => <Outlet />;

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
}
