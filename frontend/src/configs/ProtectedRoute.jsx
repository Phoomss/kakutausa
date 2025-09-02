import React from 'react';
import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { HOME_PATH, LOGIN_PATH } from './constants';

const ProtectedRoute = ({ role }) => {
  const { user, loading } = useAuth();

  // ถ้ายังโหลดข้อมูล user อยู่ ให้รอ (หรือโชว์ spinner)
  if (loading) return <div>Loading...</div>;

  // ยังไม่ login
  if (!user) return <Navigate to={LOGIN_PATH} replace />;

  // role ไม่ตรง
  if (role && user.role !== role) return <Navigate to={HOME_PATH} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
