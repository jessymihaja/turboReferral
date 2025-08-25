import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import ReferralVoteForm from '../components/ReferralVoteForm';
import { FaComment, FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import TimeAgo from '../components/TimeAgo';
import CommentModal from '../components/CommentModal';
import CustomToast from '../components/CustomToast';
import ReportReferral from '../components/ReportReferral';

export default function ServiceDetail() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [service, setService] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newReferral, setNewReferral] = useState({ link: undefined, code: undefined, description: '' });
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [serviceRes, referralRes, avgRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/services/${id}`),
          fetch(`${import.meta.env.VITE_API_URL}/api/referrals/service/${id}`),
          fetch(`${import.meta.env.VITE_API_URL}/api/referralVotes/averages/all`)
        ]);

        if (!serviceRes.ok) throw new Error('Service non trouvé');
        if (!referralRes.ok) throw new Error('Erreur chargement referrals');
        if (!avgRes.ok) throw new Error('Erreur chargement moyennes');

        const [serviceData, referralData, avgData] = await Promise.all([
          serviceRes.json(),
          referralRes.json(),
          avgRes.json()
        ]);

        setService(serviceData);

        const referralsWithAverages = referralData.map(ref => ({
          ...ref,
          voteAverage: avgData[ref._id]?.average ?? 0,
          totalVotes: avgData[ref._id]?.totalVotes ?? 0
        }));

        setReferrals(referralsWithAverages);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const hasReferralForUser = user
    ? referrals.some(ref => ref.user?.username === user.username || ref.user === user.username)
    : false;

  async function handleSubmit(e) {
    e.preventDefault();

    if ((!newReferral.link && !newReferral.code) || (newReferral.link && newReferral.code)) {
      setToast({ message: 'Veuillez renseigner soit un lien, soit un code', type: 'error' });
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

      setReferrals(prev => [...prev, data]);
      setSuccess('Referral ajouté avec succès !');
      setNewReferral({ link: '', code: '', description: '' });
      setToast({ message: 'Referral ajouté avec succès !', type: 'success' });
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  }

  function renderStars(average) {
    const stars = [];
    const rounded = Math.round(average * 2) / 2;
    for (let i = 1; i <= 5; i++) {
      if (i <= rounded) {
        stars.push(<FaStar key={i} color="#f1c40f" />);
      } else if (i - 0.5 === rounded) {
        stars.push(<FaStarHalfAlt key={i} color="#f1c40f" />);
      } else {
        stars.push(<FaRegStar key={i} color="#f1c40f" />);
      }
    }
    return stars;
  }

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!service) return <p>Service introuvable</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', padding: '2rem' }}>
      {toast.message && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}

      {/* Colonne de gauche - Infos service */}
      <div style={{ borderTop: '2px solid #27ae60', borderRadius: '8px', padding: '1rem', backgroundColor: '#f9f9f9' }}>
        <h2 style={{ color: '#2c3e50' }}>{service.name}</h2>
        {service.logo && <img src={`${import.meta.env.VITE_API_URL}${service.logo}`} alt={service.name} style={{ maxWidth: '10%' }} />}
        {service.website && (
          <p>
            <a href={service.website} target="_blank" rel="noreferrer" style={{ color: '#27ae60', textDecoration: 'none' }}>
              {service.website}
            </a>
          </p>
        )}
        {service.description && <p style={{ color: '#555' }}>{service.description}</p>}

        <h2 style={{ color: '#2c3e50' }}>Enregistrer un nouveau referral</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' }}>
          <input type="url" placeholder="Lien de parrainage (https://...)" value={newReferral.link} onChange={(e) => setNewReferral({ ...newReferral, link: e.target.value })} disabled={!!newReferral.code} style={{ padding: '0.5rem' }} />
          <input type="text" placeholder="Code de parrainage" value={newReferral.code} onChange={(e) => setNewReferral({ ...newReferral, code: e.target.value })} disabled={!!newReferral.link} style={{ padding: '0.5rem' }} />
          <input type="text" placeholder="Description" value={newReferral.description} onChange={(e) => setNewReferral({ ...newReferral, description: e.target.value })} maxLength={100} style={{ padding: '0.5rem' }} />
          <button type="submit" style={{ backgroundColor: '#27ae60', color: 'white', padding: '0.5rem', border: 'none', borderRadius: '4px' }}>Ajouter</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        </form>
        {user && hasReferralForUser && (<p>Vous avez un ou plusieurs referrals sur ce service</p>)}
      </div>

      {/* Colonne de droite - Liste referrals */}
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Referrals disponibles</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {referrals.map(ref => (
            <div key={ref._id} style={{ border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#e3e2e2ff', padding: '0.5rem' ,width: '80%'}}>
              {ref.link && (
                <div style={{ color: '#b38666ff', backgroundColor: 'white', borderRadius: '28px', padding: '0.6rem', textAlign: 'center' }}>
                  <a href={ref.link} target="_blank" rel="noreferrer" style={{ color: '#b38666ff' }}>
                    {ref.link}
                  </a>
                </div>
              )}
              {ref.code && (
                <div style={{ color: '#b38666ff', backgroundColor: 'white', borderRadius: '28px', padding: '0.6rem', textAlign: 'center' }}>
                  {ref.code}
                </div>
              )}
              <p style={{ fontStyle: 'italic' }}>{ref.description}</p>
              <span style={{ color: '#2c3e50' }}>
                <span className="avatar-circle" style={{ float: 'left' }}>
                  {(ref.user?.username?.charAt(0).toUpperCase() || '?')}
                </span>
                {ref.user?.username && (ref.user.username.charAt(0).toUpperCase() + ref.user.username.slice(1).toLowerCase()) || ref.user}
                <TimeAgo isoDateString={ref.createdAt} />
              </span>
              <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
                {renderStars(ref.voteAverage*5)}
                <button onClick={() => { setSelectedReferral(ref); setShowModal(true); }} style={{ padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#2c3e50' }}>
                  <FaComment /> commentaires
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', backgroundColor: 'white', padding: '0.5rem', borderRadius: '8px' }}>
                <ReferralVoteForm referralId={ref._id} />
                <ReportReferral referralId={ref._id} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedReferral && (
        <CommentModal
          referral={selectedReferral}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
