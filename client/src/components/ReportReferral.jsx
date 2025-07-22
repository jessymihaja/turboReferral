import { useState } from 'react';
import CustomToast from '../components/CustomToast';
import { BsExclamationTriangleFill } from 'react-icons/bs';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const reasons = ['Brisé', 'Trompeur', 'Abusif', 'Autre'];

const ReportReferral = ({ referralId}) => {
  const [toast, setToast] = useState({ message: '', type: '' });
  const [showReasons, setShowReasons] = useState(false);
  const { token} = useContext(UserContext);

  const handleReport = async (reason) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          referralId,
          reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit report');
      }

      setToast({ message: 'Signalement envoyé avec succès', type: 'success' });
    } catch (error) {
      let errorMessage = error.message;

      if (errorMessage.includes("Cannot read properties of null")) {
        errorMessage = 'Veuillez vous connecter pour signaler ce lien';
      }

      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setShowReasons(false); // Cacher le menu après envoi
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <BsExclamationTriangleFill
        onClick={() => setShowReasons(!showReasons)}
        title="Signaler ce lien"
        className="text-danger"
        style={{ cursor: 'pointer', fontSize: '1.5rem', marginLeft: '0.5rem' ,padding: '0.5rem',color:'#9b908dff'}}
      />

      {showReasons && (
  <div
    style={{
      
      position: 'absolute',
      bottom: '100%', 
      right: '5px',       

      
      backgroundColor: 'white',
      border: 'none',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      zIndex: 1000,
      minWidth: '180px',
      padding: '0.5rem 0',

    }}
  >
        {reasons.map((reason, index) => (
            <div
                key={index}
                onClick={() => handleReport(reason)}
                style={{
                padding: '0.8rem 1.2rem',
                cursor: 'pointer',
                color: '#333',
                fontSize: '0.95rem',
                
                borderBottom: index < reasons.length - 1 ? '3px solid #eee' : 'none',
                }}
                onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#f0f2f5';
                }}
                onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'white';
                }}
            >
                {reason}
            </div>
        ))}
    </div>
    )}

      {toast.message && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default ReportReferral;
