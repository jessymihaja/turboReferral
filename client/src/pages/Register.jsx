import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

export default function Register() {
  const { user } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur lors de l’inscription");
        setLoading(false);
        return;
      }

      setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      setLoading(false);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Erreur réseau');
      setLoading(false);
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
        height: '550px',
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
          <h2>Bienvenue !</h2>
          <p style={{ textAlign: 'center', margin: '1rem 0' }}>
            Déjà inscrit ? Connecte-toi pour accéder à ton espace.
          </p>
          <Link to="/login">
            <button style={{
              padding: '0.7rem 1.5rem',
              border: 'none',
              backgroundColor: '#fff',
              color: '#5D4037',
              borderRadius: '20px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>Se connecter</button>
          </Link>
        </div>

        <div style={{
          width: '50%',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h2 style={{ color: '#5D4037', marginBottom: '1rem' }}>Créer un compte</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '1rem'
              }}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
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
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '1rem'
              }}
            />
            <input
              type="password"
              placeholder="Confirmer mot de passe"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '1rem'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.8rem',
                backgroundColor: '#5D4037',
                color: 'white',
                border: 'none',
                fontSize: '1rem',
                borderRadius: '20px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {loading ? 'Inscription...' : 'S’inscrire'}
            </button>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
