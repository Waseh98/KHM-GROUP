import { Navigate, Outlet } from 'react-router-dom';
import { isAdminAuthed, validateAdminToken } from './adminAuth';

export default function AdminProtectedRoute() {
  if (!isAdminAuthed()) return <Navigate to="/admin/login" replace />;
  if (!validateAdminToken()) return null;
  return <Outlet />;
}

