import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

export default function AdminRoute({ children }) {
  const { user } = useContext(UserContext);

  console.log('AdminRoute - user:', user);

  if (!user) {
    console.log('AdminRoute - user non connecté, redirection vers login');
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    console.log('AdminRoute - utilisateur non admin, redirection vers dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('AdminRoute - accès admin autorisé');
  return children;
}
