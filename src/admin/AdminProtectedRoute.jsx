import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAdminAuthed } from './adminAuth';

export default function AdminProtectedRoute() {
  if (!isAdminAuthed()) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}

