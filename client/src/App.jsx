import { Routes, Route, useLocation } from 'react-router-dom';
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
import Navbar from './components/NavBar';
import CategoryForm from './pages/CategoryForm';
import PendingReports from './pages/PendingReports';
import Notifications from './pages/Notifications';
import Footer from './components/Footer';
import AdminReferralsPage from './components/AdminReferralsPage';
import PolitiqueConfidentialité from './pages/PolitiqueConfidentialité';
import MentionsLegales from './pages/MentionsLegales';
import ConditionsGenerales from './pages/ConditionsGenerales';
import UsersManagement from './pages/UsersManagement';
import UserDetails from './pages/UserDetails';
import Profile from './pages/Profile';
import './App.css';

function NavbarComp() {
  const { user, logout } = useContext(UserContext);

  return (
    <Navbar user={user} logout={logout} />
  );
}

function App() {
  const location = useLocation();
  const isAdminPath = (
    /^\/admin(\/|$)/.test(location.pathname) ||
    location.pathname.startsWith('/pending-reports') ||
    location.pathname.startsWith('/categories')
  );
  return (
    <UserProvider>
      {!isAdminPath && <NavbarComp />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/politique-confidentialite" element={<PolitiqueConfidentialité />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/conditions-generales" element={<ConditionsGenerales />} />
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
  <Route path='/categories' element={<AdminRoute><CategoryForm /></AdminRoute>} />
  <Route path='/pending-reports' element={<AdminRoute><PendingReports /></AdminRoute>} />
  <Route path='/admin/referrals' element={<AdminRoute><AdminReferralsPage /></AdminRoute>} />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UsersManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <AdminRoute>
              <UserDetails />
            </AdminRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!isAdminPath && <Footer />}
    </UserProvider>
  );
}

export default App;
