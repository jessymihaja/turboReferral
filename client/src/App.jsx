import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ServiceDetail from './pages/ServiceDetail';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider, UserContext } from './contexts/UserContext';
import { MaintenanceProvider, useMaintenance } from './contexts/MaintenanceContext';
import { useContext, useEffect } from 'react';
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
import ServicesManagement from './pages/ServicesManagement';
import Profile from './pages/Profile';
import Maintenance from './pages/Maintenance';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import ConnectionStatus from './components/ConnectionStatus';
import api from './services/api';
import './App.css';
import './assets/css/mobile.css';

function AppContent() {
  const location = useLocation();
  const { isMaintenanceMode, enableMaintenanceMode } = useMaintenance();
  const { user, logout } = useContext(UserContext);

  useEffect(() => {
    api.setServerUnavailableCallback(() => {
      enableMaintenanceMode();
    });
  }, [enableMaintenanceMode]);

  if (isMaintenanceMode) {
    return <Maintenance />;
  }

  const isAdminPath = (
    /^\/admin(\/|$)/.test(location.pathname) ||
    location.pathname.startsWith('/pending-reports') ||
    location.pathname.startsWith('/categories')
  );

  return (
    <>
      <ConnectionStatus />
      {!isAdminPath && <Navbar user={user} logout={logout} />}
      <main>
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
          path="/admin/services"
          element={
            <AdminRoute>
              <ServicesManagement />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
      </main>
      {!isAdminPath && <Footer />}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <MaintenanceProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </MaintenanceProvider>
    </ErrorBoundary>
  );
}

export default App;
