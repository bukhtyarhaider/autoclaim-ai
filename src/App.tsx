import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
// Sidebar removed
import TopBar from './components/layout/TopBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ReportPage from './pages/ReportPage';
import AssessmentsPage from './pages/AssessmentsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';

function App() {

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={
            <AppLayout 
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
          <Route path="/scan" element={<Navigate to="/" replace />} />
          <Route path="/assessments" element={<AssessmentsPage />} />

          <Route path="/assessments" element={<AssessmentsPage />} />

          {/* Report Routes */}
          <Route path="/report" element={<Navigate to="/assessments" replace />} />
          <Route path="/report/:id" element={<ReportPage />} />
        <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>

      {/* Fallback for outside protected routes? None needed if above catches inside. 
          But if user is logged out and goes to /unknown, we might want to show 404 or redirect. 
          Actually ProtectedRoute wraps wrapping route, so unauth users go to /auth. 
          Let's add a public catch-all just in case. 
      */}
      <Route path="*" element={<NotFoundPage />} />
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
        <UIProvider>
          <App />
        </UIProvider>
      </AuthProvider>

    </BrowserRouter>
  );
}
