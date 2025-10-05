import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaHome,
  FaChartBar,
  FaSignOutAlt,
  FaTools,
  FaSignInAlt,
  FaUserPlus,
  FaLightbulb,
  FaExclamationTriangle,
  FaChevronDown,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import NotificationIcon from './NotificationIcon';
import { useTranslation } from 'react-i18next';


const Navbar = ({ user, logout }) => {
  const { t } = useTranslation();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
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
    <motion.nav
      style={{
        ...styles.nav,
        boxShadow: scrolled ? '0 4px 20px rgba(214, 156, 90, 0.15)' : 'var(--shadow-md)',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        backgroundColor: scrolled ? 'rgba(249, 246, 243, 0.9)' : 'var(--color-bg-elevated)',
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Logo */}
      <Link to="/" style={styles.logoLink}>
        <motion.span
          style={styles.logo}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          turbo<span style={{ fontWeight: 'normal' }}>Referral</span>
        </motion.span>
      </Link>

      {/* Mobile menu toggle */}
      <button
        style={styles.mobileToggle}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={t('navigation.toggleMenu')}
      >
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Navigation Links */}
      <div style={{
        ...styles.navContent,
        ...(mobileMenuOpen ? styles.navContentMobile : {})
      }}>
        <div style={styles.linksGroup}>
          <Link to="/" style={styles.link} title={t('common.home')}>
            <FaHome />
            <span style={styles.linkText}>{t('common.home')}</span>
          </Link>

          {user && (
            <>
              <Link to="/dashboard" style={styles.link} title={t('common.dashboard')}>
                <FaChartBar />
                <span style={styles.linkText}>{t('common.dashboard')}</span>
              </Link>
              
              {user.role === 'admin' && (
                <div style={styles.dropdownContainer}>
                  <button
                    onClick={() => setAdminMenuOpen(prev => !prev)}
                    style={styles.adminLink}
                    title={t('common.admin')}
                  >
                    <FaTools />
                    <span style={styles.linkText}>{t('common.admin')}</span>
                    <FaChevronDown style={{
                      ...styles.chevron,
                      transform: adminMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }} />
                  </button>
                  {adminMenuOpen && (
                    <div style={styles.dropdownMenu}>
                      <Link
                        to="/admin"
                        style={styles.dropdownItem}
                        onClick={() => {
                          setAdminMenuOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <FaTools />
                        <span>{t('common.dashboard')}</span>
                      </Link>
                      <Link
                        to="/admin/referrals"
                        style={styles.dropdownItem}
                        onClick={() => {
                          setAdminMenuOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <FaChartBar />
                        <span>{t('common.referrals')}</span>
                      </Link>
                      <Link
                        to="/categories"
                        style={styles.dropdownItem}
                        onClick={() => {
                          setAdminMenuOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <FaLightbulb />
                        <span>{t('common.categories')}</span>
                      </Link>
                      <Link
                        to="/pending-reports"
                        style={styles.dropdownItem}
                        onClick={() => {
                          setAdminMenuOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <FaExclamationTriangle />
                        <span>{t('common.reports')}</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* User Section */}
        <div style={styles.userSection}>
          {user ? (
            <>
              <NotificationIcon />
              <span style={styles.email}>{user.email}</span>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                style={styles.logoutButton}
                title={t('common.logout')}
              >
                <FaSignOutAlt />
                <span style={styles.linkText}>{t('common.logout')}</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link} title={t('common.login')}>
                <FaSignInAlt />
                <span style={styles.linkText}>{t('common.login')}</span>
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" style={styles.authButton} title={t('common.register')}>
                  <FaUserPlus />
                  <span style={styles.linkText}>{t('common.register')}</span>
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'var(--color-bg-elevated)',
    padding: '0 var(--space-xl)',
    height: '70px',
    boxShadow: 'var(--shadow-md)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid var(--color-border-light)',
  },
  logoLink: {
    textDecoration: 'none',
    zIndex: 1001,
  },
  logo: {
    fontSize: 'var(--font-size-xl)',
    background: 'linear-gradient(135deg, var(--color-primary) 0%, #D4A574 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 'var(--font-weight-bold)',
    letterSpacing: '-0.5px',
  },
  mobileToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: 'var(--font-size-xl)',
    color: 'var(--color-text-primary)',
    cursor: 'pointer',
    padding: 'var(--space-sm)',
    zIndex: 1001,
  },
  navContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    marginLeft: 'var(--space-2xl)',
  },
  navContentMobile: {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: '70px',
    left: 0,
    right: 0,
    backgroundColor: 'var(--color-bg-elevated)',
    boxShadow: 'var(--shadow-lg)',
    padding: 'var(--space-lg)',
    gap: 'var(--space-lg)',
    zIndex: 1000,
  },
  linksGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    textDecoration: 'none',
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-medium)',
    padding: 'var(--space-sm) var(--space-md)',
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--transition-base)',
  },
  linkText: {
    display: 'inline',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)',
  },
  email: {
    fontWeight: 'var(--font-weight-medium)',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    maxWidth: '180px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    border: 'none',
    backgroundColor: 'var(--color-secondary)',
    color: 'var(--color-text-inverse)',
    fontWeight: 'var(--font-weight-medium)',
    padding: 'var(--space-sm) var(--space-lg)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    fontSize: 'var(--font-size-sm)',
    transition: 'all var(--transition-base)',
  },
  authButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    textDecoration: 'none',
    background: 'linear-gradient(135deg, var(--color-primary) 0%, #D4A574 100%)',
    color: 'var(--color-text-inverse)',
    fontWeight: 'var(--font-weight-medium)',
    padding: 'var(--space-sm) var(--space-lg)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-sm)',
    transition: 'all var(--transition-base)',
    boxShadow: '0 2px 8px rgba(214, 156, 90, 0.2)',
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    backgroundColor: 'var(--color-bg-elevated)',
    boxShadow: 'var(--shadow-lg)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-sm)',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '200px',
    zIndex: 999,
    border: '1px solid var(--color-border-light)',
  },
  dropdownItem: {
    padding: 'var(--space-sm) var(--space-md)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    transition: 'all var(--transition-base)',
    cursor: 'pointer',
    borderRadius: 'var(--radius-sm)',
  },
  adminLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    background: 'none',
    border: 'none',
    padding: 'var(--space-sm) var(--space-md)',
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
    cursor: 'pointer',
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-medium)',
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--transition-base)',
  },
  chevron: {
    fontSize: 'var(--font-size-xs)',
    marginLeft: 'var(--space-xs)',
    transition: 'transform var(--transition-base)',
  },
};

// Add media query styles
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @media (max-width: 768px) {
      nav > div:not(.mobile-toggle) {
        display: none !important;
      }
      
      nav button[aria-label="Toggle menu"] {
        display: block !important;
      }
      
      .navContentMobile {
        display: flex !important;
      }
      
      nav .linksGroup,
      nav .userSection {
        flex-direction: column;
        align-items: stretch !important;
        width: 100%;
      }
      
      nav .email {
        max-width: 100%;
      }
    }
    
    nav .link:hover,
    nav .dropdownItem:hover,
    nav .adminLink:hover {
      background-color: var(--color-bg-hover);
      color: var(--color-primary);
    }
    
    nav .logoutButton:hover {
      background-color: var(--color-primary-dark);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }
    
    nav .authButton:hover {
      background-color: var(--color-primary-dark);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }
  `;
  if (!document.getElementById('navbar-styles')) {
    styleSheet.id = 'navbar-styles';
    document.head.appendChild(styleSheet);
  }
}

export default Navbar;
