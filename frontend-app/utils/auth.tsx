import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from './api';
import React from 'react';

// Hook auth
export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
    setIsAuthenticated(api.isAuthenticated());
    setLoading(false);
    }, []);

    const logout = () => {
    api.logout();
    setIsAuthenticated(false);
    router.push('/login');
    };

    return { isAuthenticated, loading, logout };
}

// HOC requireAuth tanpa any
export function requireAuth<P extends React.JSX.IntrinsicAttributes>(
  Component: React.ComponentType<P>
) {
  const ProtectedRoute: React.FC<P> = (props) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push('/login');
      }
    }, [isAuthenticated, loading, router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      );
    }

    if (!isAuthenticated) return null;

    return <Component {...props} />;
  };

  return ProtectedRoute;
}

