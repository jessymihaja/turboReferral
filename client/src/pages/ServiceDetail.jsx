import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import ReferralVoteForm from '../components/ReferralVoteForm';
import { FaComment } from 'react-icons/fa';
import TimeAgo from '../components/TimeAgo';
import CommentModal from '../components/CommentModal';
import CustomToast from '../components/CustomToast';  

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
        const serviceRes = await fetch(`${import.meta.env.VITE_API_URL}/api/services/${id}`);
        if (!serviceRes.ok) throw new Error('Service non trouv\u00e9');
        const serviceData = await serviceRes.json();
        setService(serviceData);

        const referralRes = await fetch(`${import.meta.env.VITE_API_URL}/api/referrals/service/${id}`);
        if (!referralRes.ok) throw new Error('Erreur chargement referrals');
        const referralData = await referralRes.json();
        setReferrals(referralData);
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
    setToast({ message: '...', type: 'error' });
    setToast({ message: 'Referral ajouté avec succès !', type: 'success' });

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
      if (!res.ok) throw new Error(data.message || 'Erreur lors de l\u2019ajout du referral');

      setReferrals(prev => [...prev, data]);
      setSuccess('Referral ajout\u00e9 avec succ\u00e8s !');
      setNewReferral({ link: '', code: '', description: '' });
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
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
      <div style={{ borderTop: '2px solid #27ae60', borderRadius: '8px', padding: '1rem', backgroundColor: '#f9f9f9' ,maxHeight:'50%'}}>
        <h2 style={{ color: '#2c3e50' }}>{service.name}</h2>
        {service.logo && <img src={service.logo} alt={service.name} style={{ maxWidth: '100%' }} />}
        {service.website && <p><a href={service.website} target="_blank" rel="noreferrer" style={{ color: '#27ae60', textDecoration: 'none' }}>{service.website}</a></p>}
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
          {user && hasReferralForUser && (<p>vous avez un ou plusieurs referrals sur ce service</p>)}
        
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>Referrals disponibles</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {referrals.map(ref => (
            <div key={ref._id} style={{ border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9',maxWidth: '60%' }}>
              <div style={{ border: '1px solid lightgrey',borderTopLeftRadius:'8px',borderTopRightRadius:'8px', padding: '0.4rem', backgroundColor: 'lightgrey',maxWidth: '100%' }}>
                {ref.link && <span style={{
                  display: 'flex',          
                  justifyContent: 'center',
                  alignItems: 'center',     
                  width: '95%',            
                  color: '#b38666ff',
                  backgroundColor: 'white',
                  borderRadius: '28px',
                  padding: '0.6rem'
                }}>
                  <a href={ref.link} target="_blank" rel="noreferrer" style={{ color: '#b38666ff' }}>
                    {ref.link}
                  </a>
                </span>}
                {ref.code && <span style={{
                  display: 'flex',          
                  justifyContent: 'center',
                  alignItems: 'center',     
                  width: '95%',            
                  color: '#b38666ff',
                  backgroundColor: 'white',
                  borderRadius: '28px',
                  padding: '0.6rem'
                }}>{ref.code}</span>}
                <p style={{ fontStyle: 'italic' }}>{ref.description}</p>
                <span style={{ color: '#2c3e50' }}>Ajouté par : {ref.user?.username || ref.user} <TimeAgo isoDateString= {ref.createdAt}></TimeAgo></span>
                <div style={{ marginLeft: '0.5rem', fontWeight: 'bold'}}>avg {ref.voteAverage || 0}
                  <button onClick={() => { setSelectedReferral(ref); setShowModal(true); }} style={{ padding:'1rem' ,background: 'transparent', border: 'none', cursor: 'pointer', color: '#2c3e50' }}><FaComment/>commentaires</button>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                
              <ReferralVoteForm referralId={ref._id} />
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
