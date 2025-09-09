import { Routes, Route } from 'react-router-dom';
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
import './app.css';

function NavbarComp() {
  const { user, logout } = useContext(UserContext);

  return (
    <Navbar user={user} logout={logout} />
  );
}

function App() {
  return (
    <UserProvider>
      <NavbarComp />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notifications" element={<Notifications />} />
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
        <Route path='/categories' element={<CategoryForm />} />
        <Route path='/pending-reports' element={<PendingReports />} />
        <Route path='/admin/referrals' element={<AdminReferralsPage />} />
      </Routes>
      <Footer />
    </UserProvider>
  );
}

export default App;
