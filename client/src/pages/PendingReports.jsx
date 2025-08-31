import React, { useEffect, useState } from 'react';
import CustomToast from '../components/CustomToast';
import { FaCheck, FaExclamationTriangle, FaTrash,FaEye} from 'react-icons/fa';
import { useAuthFetch } from '../utils/authFetch';

const PendingReports = () => {
  const [reports, setReports] = useState([]);
  const [toast, setToast] = useState({ message: '', type: '' });
  const authFetch = useAuthFetch();
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/reports/pending`)
      .then(res => res.json())
      .then(setReports)
      .catch(console.error);
  };

  const handleDelete = async (id,referralId) => {
    try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/warnDeletedReferral/${id}`, {
      method: 'POST',
    });
    const responseDelete = await authFetch(`${import.meta.env.VITE_API_URL}/api/referrals/${referralId}`, {
      method: 'DELETE',
    });
    if(!responseDelete.ok) throw new Error('Erreur lors de la suppression du referral');


    if (!response.ok) throw new Error('Erreur lors de l’envoi');
    setToast({ message: 'Suppression avec succès', type: 'success' });
  } catch (err) {
    console.error(err);
    setToast({ message: 'Erreur lors de la suppression', type: 'error' });
  };
}

  const handleIgnore = async (id) => {
    try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/${id}/ignore`, {
      method: 'PUT',
    });

    //if (!response.ok) throw new Error('Échec de l’ignorance du report');

    const data = await response.json();
    setToast({ message: 'Report ignoré avec succès', type: 'success' });

    fetchReports();
    setToast({ message: 'Signalement ignoré', type: 'success' });

  } catch (error) {
    setToast({ message: error.message, type: 'error' });
  }
  };

 const handleWarn = async (id) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/warn/${id}`, {
      method: 'POST',
    });

    if (!response.ok) throw new Error('Erreur lors de l’envoi');

    setToast({ message: 'Propriétaire averti', type: 'success' });
  } catch (err) {
    console.error(err);
    setToast({ message: 'Erreur lors de l’envoi de l’avertissement', type: 'error' });
  }
};

  return (
    <div style={{ padding: '20px',textAlign: 'center' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' ,color:'#5D4037'}}>Liste des signalements à vérifier</h2>

      {toast.message && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '80%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#d7ccc8',color: '#5D4037' }}>
              <th style={cellStyle}>Utilisateur concerné</th>
              <th style={cellStyle}>Lien ou code </th>
              <th style={cellStyle}>Reporté par</th>
              <th style={cellStyle}>Raison</th>
              <th style={cellStyle}>Date</th>
              <th style={cellStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '15px', textAlign: 'center' }}>Aucun report en attente</td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report._id}>
                  <td style={cellStyle}>{report.referralId?.user?.username || 'Inconnu'}</td>
                  <td style={cellStyle}>
                        {report.referralId?.link ? (
                            
                            <a 
                            href={report.referralId.link} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#5D4037', textDecoration: 'none' }}
                            >
                            {report.referralId.link}  
                            <FaEye />
                            
                            </a>
                        ) : (
                            report.referralId?.code // Affiche le code si pas de lien
                        )}
                    </td>
                  <td style={cellStyle}>{report.reporterId?.username || 'Inconnu'}</td>
                  <td style={cellStyle}>Lien {report.reason}</td>
                  <td style={cellStyle}>{new Date(report.reportedAt).toLocaleDateString()}</td>
                  <td style={cellStyle}>
                    <button onClick={() => handleIgnore(report._id)} style={{ ...actionBtn, backgroundColor: '#4ef07fff' }}><FaCheck/></button>
                    <button onClick={() => handleWarn(report._id)} style={actionBtn}><FaExclamationTriangle/></button>
                    <button onClick={() => handleDelete(report._id,report.referralId._id)} style={{ ...actionBtn, backgroundColor: '#d9534f' }}><FaTrash/></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const cellStyle = {
  border: '1px solid #ddd',
  padding: '12px',
  textAlign: 'left'
};

const actionBtn = {
  marginRight: '8px',
  padding: '4px 6px',
  border: 'none',
  backgroundColor: '#de9d5bff',
  color: 'white',
  cursor: 'pointer',
  borderRadius: '4px',
  fontSize: '13px'
};

export default PendingReports;
