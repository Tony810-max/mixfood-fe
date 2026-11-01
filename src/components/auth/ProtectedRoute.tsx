import { useAuth } from "@/contexts/AuthContext";
import { translateUi } from "@/lib/localization";
import { ROUTES } from "@/utils/const";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('[ProtectedRoute] State:', { requireAuth, isAuthenticated, isLoading, currentPath: window.location.pathname });

  if (isLoading) {
    console.log('[ProtectedRoute] Showing loading state');
    return (
      <div className="flex min-h-screen items-center justify-center bg-background" role="status" aria-live="polite">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-border border-t-primary" aria-hidden="true"></div>
        <span className="sr-only">{translateUi('Loading content…')}</span>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    console.log('[ProtectedRoute] Redirecting to login (requireAuth=true, not authenticated)');
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    console.log('[ProtectedRoute] Redirecting to home (requireAuth=false, already authenticated)');
    return <Navigate to={ROUTES.HOME} replace />;
  }

  console.log('[ProtectedRoute] Rendering children');
  return <>{children}</>;
};
