import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBars } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children, title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg-main)'
    }}>
      <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <main style={{
        flex: 1,
        marginLeft: sidebarOpen && window.innerWidth > 768 ? '280px' : '0',
        transition: 'margin-left 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'var(--color-bg-elevated)',
          borderBottom: '1px solid var(--color-border-light)',
          padding: 'var(--space-lg) var(--space-xl)',
          boxShadow: 'var(--shadow-sm)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleSidebar}
                style={{
                  background: 'var(--color-primary-100)',
                  border: '1px solid var(--color-primary-300)',
                  padding: 'var(--space-sm)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-primary-600)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all var(--transition-base)'
                }}
              >
                <FaBars size={16} />
              </motion.button>
              
              <div>
                <h1 style={{
                  margin: 0,
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                  background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {title}
                </h1>
                {subtitle && (
                  <p style={{
                    margin: 0,
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-muted)'
                  }}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{
          flex: 1,
          padding: 'var(--space-xl)',
          maxWidth: '100%',
          overflow: 'auto'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;