import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

export default function ServiceDetail() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [service, setService] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newReferral, setNewReferral] = useState({
    link: undefined,
    code: undefined,
    description: '',
  });

 useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);
      setError('');

      const serviceRes = await fetch(`${import.meta.env.VITE_API_URL}/api/services/${id}`);
      if (!serviceRes.ok) throw new Error('Service non trouvé');
      const serviceData = await serviceRes.json();
      setService(serviceData);

      const referralRes = await fetch(`${import.meta.env.VITE_API_URL}/api/referrals/service/${id}`);
      if (!referralRes.ok) throw new Error('Erreur chargement referrals');
      const referralData = await referralRes.json();
      console.log('Referrals loaded:', referralData);  // <=== ici

      setReferrals(referralData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, [id]);

  // Vérifie si l'utilisateur a déjà ajouté un referral pour ce service
 const hasReferralForUser = user
  ? referrals.some(ref => {
      if (!ref.user) return false;
      if (typeof ref.user === 'string') return ref.user === user.username && (ref.link || ref.code);
      if (typeof ref.user === 'object') return ref.user.username === user.username && (ref.link || ref.code);
      return false;
    })
  : false;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation simple : soit link soit code mais pas les deux ni aucun
    if ((!newReferral.link && !newReferral.code) || (newReferral.link && newReferral.code)) {
      setError('Veuillez renseigner soit un lien, soit un code (pas les deux).');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/referrals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: id,
          user: user._id,
          link: newReferral.link,
          code: newReferral.code,
          description: newReferral.description,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur lors de l’ajout du referral');

      setReferrals((prev) => [...prev, data]);
      setSuccess('Referral ajouté avec succès !');
      setNewReferral({ link: '', code: '', description: '' });
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!service) return <p>Service introuvable</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1rem' }}>
      <h2>{service.name}</h2>
      {service.logo && (
        <img
          src={service.logo}
          alt={service.name}
          style={{ maxWidth: '150px', marginBottom: '1rem' }}
        />
      )}
      {service.website && (
        <p>
          Site :{' '}
          <a href={service.website} target="_blank" rel="noreferrer">
            {service.website}
          </a>
        </p>
      )}
      {service.description && <p>{service.description}</p>}

      <hr style={{ margin: '2rem 0' }} />

      <h3>Liens et codes de parrainage</h3>
      {referrals.length === 0 && <p>Aucun referral pour ce service.</p>}
      <ul>
        {referrals.map((ref) => (
          <li key={ref._id} style={{ marginBottom: '1rem' }}>
            {ref.link && (
              <a href={ref.link} target="_blank" rel="noreferrer">
                {ref.link}
              </a>
            )}
            {ref.code && <span>Code : {ref.code}</span>}
            {ref.description && (
              <p style={{ fontStyle: 'italic', marginTop: '0.3rem' }}>{ref.description}</p>
            )}
          </li>
        ))}
      </ul>

      {user ? (
        !hasReferralForUser ? (
          <>
            <hr style={{ margin: '2rem 0' }} />
            <h3>Ajouter un lien ou code de parrainage</h3>
            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}
            >
              <input
                type="url"
                placeholder="Lien de parrainage (https://...)"
                value={newReferral.link}
                onChange={(e) => setNewReferral({ ...newReferral, link: e.target.value })}
                disabled={!!newReferral.code}
                style={{ padding: '0.5rem' }}
              />
              <input
                type="text"
                placeholder="Code de parrainage"
                value={newReferral.code}
                onChange={(e) => setNewReferral({ ...newReferral, code: e.target.value })}
                disabled={!!newReferral.link}
                style={{ padding: '0.5rem' }}
              />
              <input
                type="text"
                placeholder="Description (max 100 caractères)"
                value={newReferral.description}
                onChange={(e) =>
                  setNewReferral({ ...newReferral, description: e.target.value.slice(0, 100) })
                }
                maxLength={100}
                style={{ padding: '0.5rem' }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Ajouter
              </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
          </>
        ) : (
          <p>Vous avez déjà ajouté un lien ou un code pour ce service.</p>
        )
      ) : (
        <p>Connectez-vous pour ajouter un referral.</p>
      )}
    </div>
  );
}
