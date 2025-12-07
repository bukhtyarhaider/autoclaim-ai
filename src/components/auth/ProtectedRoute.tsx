import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
    <Loader fullScreen={true} darkBg={true} />
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
