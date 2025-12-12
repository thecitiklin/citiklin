import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/routes';
import { Loader2 } from 'lucide-react';

export default function DashboardRedirect() {
  const { user, isAuthenticated, isLoading, getDashboardRoute } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Navigate to={getDashboardRoute()} replace />;
}
