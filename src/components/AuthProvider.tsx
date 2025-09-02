import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '@/store/auth';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setIsAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        await axios.get('/api/auth/me');
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, [setIsAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading application...</div>
      </div>
    );
  }

  return <>{children}</>;
};
