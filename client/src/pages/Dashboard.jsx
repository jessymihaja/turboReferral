import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useAuthFetch } from '../utils/authFetch';

export default function Dashboard() {
  const { user } = useContext(UserContext);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const authFetch = useAuthFetch();

  // État formulaire création service
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function fetchUserReferrals() {
      try {
        setLoading(true);
        const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/referrals?user=${user.username}`);
        if (!res.ok) throw new Error('Erreur chargement referrals');
        const data = await res.json();
        setReferrals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserReferrals();
  }, [user, authFetch]);

  function groupByService(referrals) {
    return referrals.reduce((acc, ref) => {
      const serviceName = ref.service?.name || 'Service inconnu';
      if (!acc[serviceName]) acc[serviceName] = [];
      acc[serviceName].push(ref);
      return acc;
    }, {});
  }

  async function handleDelete(id) {
    if (!confirm('Confirmer la suppression ?')) return;
    try {
      setDeletingId(id);
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/referrals/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur suppression');
      setReferrals(referrals.filter(ref => ref._id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  // Soumission demande création service
  async function handleServiceRequestSubmit(e) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!serviceName.trim()) {
      setFormError('Le nom du service est obligatoire.');
      return;
    }
    setFormLoading(true);

    try {
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/service-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: serviceName.trim(),
          description: serviceDescription.trim(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Erreur lors de la demande');
      }

      setFormSuccess('Demande envoyée avec succès !');
      setServiceName('');
      setServiceDescription('');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  }

  if (!user) return <p>Vous devez être connecté pour accéder au dashboard.</p>;
  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>;

  const grouped = groupByService(referrals);

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1rem', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2 style={{ marginBottom: '1rem' }}>Dashboard de {user.username}</h2>
      <p style={{ marginBottom: '1.5rem' }}>Vous avez {referrals.length} lien(s) ou code(s) de parrainage.</p>

      {referrals.length === 0 ? (
        <p>Aucun referral posté pour l'instant.</p>
      ) : (
        Object.entries(grouped).map(([serviceName, refs]) => (
          <section key={serviceName} style={{ marginBottom: '2rem' }}>
            <h3 style={{ borderBottom: '2px solid #27ae60', paddingBottom: '0.3rem', marginBottom: '1rem', color: '#27ae60' }}>
              <a href={`/services/${refs[0].service._id}`} style={{ color: '#27ae60', textDecoration: 'none' }}>
                {serviceName}
              </a>
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {refs.map(ref => (
                <li
                  key={ref._id}
                  style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  {ref.link ? (
                    <a href={ref.link} target="_blank" rel="noreferrer" style={{ fontWeight: '600', color: '#2c3e50' }}>
                      {ref.link}
                    </a>
                  ) : (
                    <span style={{ fontWeight: '600' }}>Code : {ref.code}</span>
                  )}
                  {ref.description && (
                    <p style={{ fontStyle: 'italic', marginTop: '0.3rem', color: '#555' }}>
                      {ref.description}
                    </p>
                  )}
                  <button
                    onClick={() => handleDelete(ref._id)}
                    disabled={deletingId === ref._id}
                    style={{
                      marginTop: '0.5rem',
                      backgroundColor: deletingId === ref._id ? '#ccc' : '#e74c3c',
                      color: 'white',
                      border: 'none',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      cursor: deletingId === ref._id ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {deletingId === ref._id ? 'Suppression...' : 'Supprimer'}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      <section style={{ marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #ccc' }}>
        <h3>Demander un nouveau service</h3>
        <form onSubmit={handleServiceRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Nom du service"
            value={serviceName}
            onChange={e => setServiceName(e.target.value)}
            required
            style={{ padding: '0.5rem', fontSize: '1rem' }}
          />
          <textarea
            placeholder="Description (facultatif)"
            value={serviceDescription}
            onChange={e => setServiceDescription(e.target.value)}
            rows={3}
            style={{ padding: '0.5rem', fontSize: '1rem' }}
          />
          {formError && <p style={{ color: 'red' }}>{formError}</p>}
          {formSuccess && <p style={{ color: 'green' }}>{formSuccess}</p>}
          <button
            type="submit"
            disabled={formLoading}
            style={{
              padding: '0.5rem',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              fontSize: '1rem',
              cursor: formLoading ? 'not-allowed' : 'pointer',
              borderRadius: '4px',
            }}
          >
            {formLoading ? 'Envoi...' : 'Envoyer la demande'}
          </button>
        </form>
      </section>
    </div>
  );
}
