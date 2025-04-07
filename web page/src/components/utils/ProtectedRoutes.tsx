import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { checkToken } from '@/services/login';
import { useAuth } from './AuthProvider';

export const ProtectedRoutes = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await checkToken(token);
      } catch (err) {
        navigate('/login', { replace: true });
      }
    };

    verifyToken();
  }, [token, navigate, checkToken]);

  return <Outlet />;
};

// const user = null;
// return user ? <Outlet /> : <Navigate to="/login" />;
