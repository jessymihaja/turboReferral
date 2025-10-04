import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { authService } from '../services';

export default function Login() {
  const { user, login } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const response = await authService.login({ username, password });
      const { user, token } = response.data;
      login(user, token);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Erreur lors de la connexion');
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#fdf6fc',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        width: '800px',
        height: '500px',
        display: 'flex',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 0 20px rgba(0,0,0,0.1)',
        background: '#fff'
      }}>
        <div style={{
          backgroundColor: '#5D4037',
          color: '#fff',
          width: '50%',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h2>Bienvenue</h2>
          <p style={{ textAlign: 'center', margin: '1rem 0' }}>Rejoin notre plateforme, explore de nouvelles expériences</p>
          <Link to="/register">
            <button style={{
              padding: '0.7rem 1.5rem',
              border: 'none',
              backgroundColor: '#fff',
              color: '#5D4037',
              borderRadius: '20px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>Inscription</button>
          </Link>
        </div>
        <div style={{
          width: '50%',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h2 style={{ color: '#5D4037', marginBottom: '1rem' }}>Se connecter</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                padding: '0.8rem',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '1rem'
              }}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '0.8rem',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '1rem'
              }}
            />
            <button type="submit" style={{
              padding: '0.8rem',
              backgroundColor: '#5D4037',
              color: 'white',
              border: 'none',
              fontSize: '1rem',
              borderRadius: '20px',
              cursor: 'pointer'
            }}>
              Connexion
            </button>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
