import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

export default function ProtectedRoute({ children }) {
  const { user, token } = useContext(UserContext);

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
