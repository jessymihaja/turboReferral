import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

export default function Login() {
  const { user, login } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirection selon rôle
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
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    console.log('Login - données utilisateur reçues:', data.user);

    if (!res.ok) {
      setError(data.message || 'Erreur lors de la connexion');
      return;
    }

    login(data.user, data.token);
    navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
  } catch (err) {
    setError('Erreur réseau');
  }
}

  return (
    <div style={{ maxWidth: '400px', margin: '3rem auto', padding: '1rem', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Se connecter</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: '0.5rem', fontSize: '1rem' }}
          autoFocus
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        />
        <button
          type="submit"
          style={{ padding: '0.5rem', backgroundColor: '#27ae60', color: 'white', border: 'none', fontSize: '1rem', cursor: 'pointer', borderRadius: '4px' }}
        >
          Connexion
        </button>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </form>
    </div>
  );
}
