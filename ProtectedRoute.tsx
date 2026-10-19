import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { mockAuthService } from '@/services/mockAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = mockAuthService.isLoggedIn();
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to login page, but save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

interface PublicRouteProps {
  children: ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const isLoggedIn = mockAuthService.isLoggedIn();
  const location = useLocation();

  if (isLoggedIn) {
    // If logged in and trying to access login/register, redirect to dashboard
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
