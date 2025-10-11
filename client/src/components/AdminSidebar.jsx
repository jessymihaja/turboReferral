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
  FaBars
} from 'react-icons/fa';
import { useState } from 'react';

const AdminSidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const adminMenuItems = [
    {
      path: '/admin',
      label: 'Dashboard',
      icon: FaTools,
      color: '--color-primary-600'
    },
    {
      path: '/admin/referrals',
      label: 'Référencements',
      icon: FaChartBar,
      color: '--color-info-600'
    },
    {
      path: '/categories',
      label: 'Catégories',
      icon: FaLightbulb,
      color: '--color-warning-600'
    },
    {
      path: '/pending-reports',
      label: 'Signalements',
      icon: FaExclamationTriangle,
      color: '--color-error-600'
    },
    {
      path: '/admin/users',
      label: 'Utilisateurs',
      icon: FaUsers,
      color: '--color-success-600'
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
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '280px',
          backgroundColor: 'var(--color-bg-elevated)',
          borderRight: '1px solid var(--color-border-light)',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          padding: '0'
        }}
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
                Administration
              </h3>
              <p style={{
                margin: 0,
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-muted)'
              }}>
                Panneau de contrôle
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
              <span>Retour au site</span>
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
              Gestion
            </h4>
          </div>

          {adminMenuItems.map((item, index) => {
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
                    color: isActive ? 'white' : 'var(--color-text-primary)',
                    textDecoration: 'none',
                    fontSize: 'var(--font-size-base)',
                    fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                    transition: 'all var(--transition-base)',
                    backgroundColor: isActive ? `var(${item.color})` : 'transparent',
                    border: isActive ? 'none' : '1px solid transparent',
                    position: 'relative',
                    overflow: 'hidden'
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
            TurboReferral Admin
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default AdminSidebar;