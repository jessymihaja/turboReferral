import { Link } from 'react-router-dom';
import {
  FaHome,
  FaChartBar,
  FaSignOutAlt,
  FaTools,
  FaSignInAlt,
  FaUserPlus,
  FaUser,
  FaLightbulb,
  FaExclamationTriangle
} from 'react-icons/fa';
import NotificationIcon from './NotificationIcon';

const Navbar = ({ user, logout }) => {
  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <Link to="/" style={styles.logoLink}>
        <span style={styles.logo}>turboReferral</span>
      </Link>

      {/* Liens de gauche */}
      <div style={styles.leftLinks}>
        <Link to="/" style={styles.link}><FaHome /> Accueil</Link>
        {user && (
          <>
            <Link to="/dashboard" style={styles.link}><FaChartBar /> Dashboard</Link>
            {user.role === 'admin' && (
              <>
              <Link to="/admin" style={styles.link}><FaTools /> Admin</Link>
              <Link to="/categories" style={styles.link}><FaLightbulb /> Categories</Link>
              <Link to="/pending-reports" style={styles.link}><FaExclamationTriangle/> Signalements</Link>
              </>
            )}
          </>
        )}
      </div>

      {/* Liens de droite */}
      <div style={styles.rightLinks}>
        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <button onClick={logout} style={styles.button}><FaSignOutAlt /> Déconnexion</button>
            <div style={styles.username}><NotificationIcon />{user.email}</div>
            
          </div>
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
    width: '100%',
    height: '70px',
    background: '#d7ccc8', // café au lait
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
    boxSizing: 'border-box',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    fontFamily: 'sans-serif',
  },
  logoLink: {
    textDecoration: 'none',
  },
  logo: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#27ae60',
  },
  leftLinks: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  rightLinks: {
    display: 'flex',
    gap: '1.2rem',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontWeight: 500,
    transition: 'color 0.3s ease',
  },
  button: {
    background: 'transparent',
    border: 'none',
    color: '#333',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    padding: 0,
  },
  username: {
    marginTop: '5px',
    fontSize: '0.9rem',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500,
    gap: '0.8rem',
  }
};

export default Navbar;
