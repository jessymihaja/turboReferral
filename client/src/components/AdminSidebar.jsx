import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTools,
  FaChartBar,
  FaLightbulb,
  FaExclamationTriangle,
  FaUsers,
  FaCog,
  FaHome,
  FaTimes,
  FaBars,
  FaBox
} from 'react-icons/fa';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import './AdminSidebar.css';

const AdminSidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const { t } = useTranslation();

  const adminMenuItems = [
    {
      path: '/admin',
      label: t('admin.adminDashboard'),
      icon: FaTools,
      color: '--color-primary-600'
    },
    {
      path: '/admin/referrals',
      label: t('common.referrals'),
      icon: FaChartBar,
      color: '--color-primary-600'
    },
    {
      path: '/admin/services',
      label: t('common.services'),
      icon: FaBox,
      color: '--color-primary-600'
    },
    {
      path: '/categories',
      label: t('common.categories'),
      icon: FaLightbulb,
      color: '--color-primary-600'
    },
    {
      path: '/pending-reports',
      label: t('common.reports'),
      icon: FaExclamationTriangle,
      color: '--color-primary-600'
    },
    {
      path: '/admin/users',
      label: t('common.users'),
      icon: FaUsers,
      color: '--color-primary-600'
    }
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: -280,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    open: { opacity: 1, pointerEvents: 'auto' },
    closed: { opacity: 0, pointerEvents: 'none' }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
              display: window.innerWidth <= 768 ? 'block' : 'none'
            }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className="admin-sidebar"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
      >
        {/* Header */}
        <div style={{
          padding: 'var(--space-lg)',
          borderBottom: '1px solid var(--color-border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-primary-50)',
          background: 'linear-gradient(135deg, var(--color-primary-100) 0%, var(--color-primary-50) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <FaCog size={20} />
            </div>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)'
              }}>
                {t('common.admin')}
              </h3>
              <p style={{
                margin: 0,
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-muted)'
              }}>
                {t('common.dashboard')}
              </p>
            </div>
          </div>
          <button
            onClick={onToggle}
            style={{
              background: 'none',
              border: 'none',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              transition: 'all var(--transition-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav style={{
          flex: 1,
          padding: 'var(--space-md) 0',
          overflowY: 'auto'
        }}>
          {/* Quick access to home */}
          <div style={{ padding: '0 var(--space-lg) var(--space-md)' }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                padding: 'var(--space-sm) var(--space-md)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                fontSize: 'var(--font-size-sm)',
                transition: 'all var(--transition-base)',
                backgroundColor: 'var(--color-bg-muted)'
              }}
            >
              <FaHome size={16} />
              <span>{t('common.back')}</span>
            </Link>
          </div>

          <div style={{ padding: '0 var(--space-lg)' }}>
            <h4 style={{
              margin: '0 0 var(--space-sm) 0',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {t('admin.overviewAnalytics')}
            </h4>
          </div>

          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.path}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                style={{ padding: '0 var(--space-lg) var(--space-1)' }}
              >
                <Link
                  to={item.path}
                  onClick={() => window.innerWidth <= 768 && onToggle()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-md)',
                    padding: 'var(--space-md)',
                    borderRadius: 'var(--radius-lg)',
                    color: isActive ? '#ffffff' : 'var(--color-text-primary)',
                    textDecoration: 'none',
                    fontSize: 'var(--font-size-base)',
                    fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                    transition: 'all var(--transition-base)',
                    backgroundColor: isActive ? `var(${item.color})` : 'transparent',
                    border: isActive ? 'none' : '1px solid transparent',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = 'var(--color-bg-hover)';
                      e.target.style.borderColor = 'var(--color-border-light)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.borderColor = 'transparent';
                    }
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={16} />
                  </div>
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      style={{
                        position: 'absolute',
                        right: 'var(--space-md)',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)'
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Language Switcher */}
        <div style={{
          padding: 'var(--space-lg)',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <LanguageSwitcher variant="navbar" />
        </div>

        {/* Footer */}
        <div style={{
          padding: 'var(--space-lg)',
          borderTop: '1px solid var(--color-border-light)',
          backgroundColor: 'var(--color-bg-subtle)'
        }}>
          <div style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-muted)',
            textAlign: 'center'
          }}>
            RefPush Admin
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default AdminSidebar;