import { Link } from 'react-router-dom';
import React, { useState } from 'react';
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
} from 'react-icons/fa';
import NotificationIcon from './NotificationIcon';


const Navbar = ({ user, logout }) => {
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <Link to="/" style={styles.logoLink}>
        <span style={styles.logo}>turbo<span style={{ fontWeight: 'normal' }}>Referral</span></span>
      </Link>

      {/* Liens à gauche */}
      <div style={styles.linksGroup}>
        <Link to="/" style={styles.link}><FaHome /> Accueil</Link>
        {user && (
          <>
            <Link to="/dashboard" style={styles.link}><FaChartBar /> Dashboard</Link>
            {user.role === 'admin' && (
              <div style={styles.dropdownContainer}>
                <button
                  onClick={() => setAdminMenuOpen(prev => !prev)}
                  style={styles.adminLink}
                >
                  <span style={styles.iconText}>
                    <FaTools style={{ marginRight: 8 }} />
                    Administration
                  </span>
                  <FaChevronDown style={styles.chevron} />
                </button>
                {adminMenuOpen && (
                  <div style={styles.dropdownMenu}>
                    <Link to="/admin" style={styles.dropdownItem} onClick={() => setAdminMenuOpen(false)}>
                      <FaTools /> Admin
                    </Link>
                    <Link to="/categories" style={styles.dropdownItem} onClick={() => setAdminMenuOpen(false)}>
                      <FaLightbulb /> Catégories
                    </Link>
                    <Link to="/pending-reports" style={styles.dropdownItem} onClick={() => setAdminMenuOpen(false)}>
                      <FaExclamationTriangle /> Signalements
                    </Link>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Liens à droite */}
      <div style={styles.userSection}>
        {user ? (
          <>
            <div style={styles.userInfo}>
              <NotificationIcon />
              <span style={styles.email}>{user.email}</span>
            </div>
            <button onClick={logout} style={styles.logoutButton}>
              <FaSignOutAlt /> Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}><FaSignInAlt /> Connexion</Link>
            <Link to="/register" style={styles.link}><FaUserPlus /> Inscription</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '0 2rem',
    height: '70px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
    fontFamily: 'Segoe UI, sans-serif',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logoLink: {
    textDecoration: 'none',
  },
  logo: {
    fontSize: '1.5rem',
    color: '#2ecc71',
    fontWeight: 700,
    letterSpacing: '-0.5px',
  },
  linksGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    textDecoration: 'none',
    color: '#2c3e50',
    fontSize: '1rem',
    fontWeight: 500,
    transition: 'color 0.2s ease',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.95rem',
    color: '#34495e',
  },
  email: {
    fontWeight: 500,
    maxWidth: '180px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    border: 'none',
    backgroundColor: '#e74c3c',
    color: '#fff',
    fontWeight: 500,
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  dropdownContainer: {
  position: 'relative',
},

dropdownMenu: {
  position: 'absolute',
  top: '100%',
  left: 0,
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  borderRadius: '4px',
  padding: '0.5rem 0',
  display: 'flex',
  flexDirection: 'column',
  minWidth: '200px',
  zIndex: 999,
},

dropdownItem: {
  padding: '0.5rem 1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: '#2c3e50',
  textDecoration: 'none',
  fontSize: '0.95rem',
  fontWeight: 500,
  transition: 'background 0.2s ease',
  cursor: 'pointer',
},
 adminLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "none",
    border: "none",
    padding: "10px 15px",
    width: "100%",
    color: "#2c3e50",
    textDecoration: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontFamily: "inherit",
    outline: "none",
    transition: "background 0.2s ease",
    borderRadius: "5px",
  },
  iconText: {
    display: "flex",
    alignItems: "center",
  },
  chevron: {
    marginLeft: "auto",
    fontSize: "12px",
  },

};

export default Navbar;
