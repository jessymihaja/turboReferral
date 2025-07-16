import { useEffect, useState } from 'react';
import { useAuthFetch } from '../utils/authFetch';

export default function AdminDashboard() {
  const authFetch = useAuthFetch();

  const [services, setServices] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [servicesRes, referralsRes] = await Promise.all([
          authFetch(`${import.meta.env.VITE_API_URL}/api/admin/services`),
          authFetch(`${import.meta.env.VITE_API_URL}/api/referrals`)
        ]);

        if (!servicesRes.ok) throw new Error('Erreur chargement services');
        if (!referralsRes.ok) throw new Error('Erreur chargement referrals');

        const servicesData = await servicesRes.json();
        const referralsData = await referralsRes.json();

        setServices(servicesData);
        setReferrals(referralsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [authFetch]); // OK ici car authFetch est stable grâce à useCallback

  async function handleValidateService(id) {
    try {
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/admin/services/${id}/validate`, { method: 'PUT' });
      if (!res.ok) throw new Error('Erreur validation service');
      const updated = await res.json();
      setServices(services.map(s => s._id === id ? updated.service : s));
      alert('Service validé avec succès !');
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteReferral(id) {
    if (!confirm('Supprimer ce referral ?')) return;
    try {
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/referrals/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur suppression referral');
      setReferrals(referrals.filter(r => r._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{color: 'red'}}>{error}</p>;

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2>Admin Dashboard</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3>Services</h3>
        {services.length === 0 ? <p>Aucun service</p> : (
          <ul>
            {services.map(service => (
              <li key={service._id} style={{ marginBottom: '1rem' }}>
                <strong>{service.name}</strong> - {service.isValidated ? 'Validé ✅' : 'Non validé ❌'}
                {!service.isValidated && (
                  <button
                    onClick={() => handleValidateService(service._id)}
                    style={{ marginLeft: '1rem', padding: '0.3rem 0.6rem' }}
                  >
                    Valider
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>Referrals</h3>
        {referrals.length === 0 ? <p>Aucun referral</p> : (
          <ul>
            {referrals.map(ref => (
              <li key={ref._id} style={{ marginBottom: '1rem' }}>
                <div>
                  <strong>{ref.service?.name || 'Service inconnu'}</strong>:&nbsp;
                  {ref.link ? <a href={ref.link} target="_blank" rel="noreferrer">{ref.link}</a> : `Code : ${ref.code}`}
                </div>
                {ref.description && <div style={{ fontStyle: 'italic' }}>{ref.description}</div>}
                <button
                  onClick={() => handleDeleteReferral(ref._id)}
                  style={{ marginTop: '0.5rem', backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
