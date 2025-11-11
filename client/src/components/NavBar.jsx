import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {
  FaHome,
  FaChartBar,
  FaSignOutAlt,
  FaTools,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import NotificationIcon from './NotificationIcon';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import './NavBar.css';


const Navbar = ({ user, logout }) => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="main-navbar"
      style={{
        boxShadow: scrolled ? '0 4px 20px rgba(214, 156, 90, 0.15)' : 'var(--shadow-md)',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        backgroundColor: scrolled ? 'rgba(249, 246, 243, 0.9)' : 'var(--color-bg-elevated)',
      }}
    >
      {/* Logo */}
      <Link to="/" className="nav-logo-link">
        <span className="nav-logo">
          turbo<span style={{ fontWeight: 'normal' }}>Referral</span>
        </span>
      </Link>

      {/* Mobile menu toggle */}
      <button
        className="nav-mobile-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={t('navigation.toggleMenu')}
      >
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Navigation Links */}
      <div className={`nav-content ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="nav-links-group">
          <Link to="/" className="nav-link" title={t('common.home')}>
            <FaHome />
            <span>{t('common.home')}</span>
          </Link>

          {user && (
            <>
              <Link to="/dashboard" className="nav-link" title={t('common.dashboard')}>
                <FaChartBar />
                <span>{t('common.dashboard')}</span>
              </Link>
              
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link" title={t('common.admin')}>
                  <FaTools />
                  <span>{t('common.admin')}</span>
                </Link>
              )}
            </>
          )}
        </div>

        {/* User Section */}
        <div className="nav-user-section">
          <LanguageSwitcher />
          {user ? (
            <>
              <NotificationIcon />
              <Link to="/profile" className="nav-profile-link" title="Profil">
                {user.profilePhoto ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${user.profilePhoto}`}
                    alt={user.username}
                    className="nav-profile-photo"
                  />
                ) : (
                  <div className="nav-profile-initial">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="nav-logout-button"
                title={t('common.logout')}
              >
                <FaSignOutAlt />
                <span>{t('common.logout')}</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" title={t('common.login')}>
                <FaSignInAlt />
                <span>{t('common.login')}</span>
              </Link>
              <Link to="/register" className="nav-auth-button" title={t('common.register')}>
                <FaUserPlus />
                <span>{t('common.register')}</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
