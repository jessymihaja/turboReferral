import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ServiceDetail from './pages/ServiceDetail';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider, UserContext } from './contexts/UserContext';
import { useContext } from 'react';
import AdminRoute from './components/AdminRoute';

function Navbar() {
  const { user, logout } = useContext(UserContext);

  return (
    <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>🏠 Accueil</Link>

      {user ? (
        <>
          <span style={{ marginRight: '1rem' }}>👋 Bonjour {user.username}</span>
          <Link to="/dashboard" style={{ marginRight: '1rem' }}>⚙️ Mon dashboard</Link>
          
          {/* Affiche lien Admin Dashboard seulement si rôle admin */}
          {user.role === 'admin' && (
            <Link to="/admin" style={{ marginRight: '1rem' }}>🛠️ Admin dashboard</Link>
          )}

          <button onClick={logout}>🚪 Déconnexion</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: '1rem' }}>🔐 Se connecter</Link>
          <Link to="/register">🆕 S'inscrire</Link>
        </>
      )}
    </nav>
  );
}

function App() {
  return (
    <UserProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
    path="/admin"
    element={
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    }
  />
      </Routes>
    </UserProvider>
  );
}

export default App;
