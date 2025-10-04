import React, { useEffect, useState } from 'react';
import CustomToast from '../components/CustomToast';
import { FaCheck, FaExclamationTriangle, FaTrash,FaEye} from 'react-icons/fa';
import { useAuthFetch } from '../utils/authFetch';
import { referralService, notificationService } from '../services';
import api from '../services/api';

const PendingReports = () => {
  const [reports, setReports] = useState([]);
  const [toast, setToast] = useState({ message: '', type: '' });
  const authFetch = useAuthFetch();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await api.get('/api/reports/pending');
      setReports(data.data || data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleDelete = async (id, referralId) => {
    try {
      await api.post(`/api/notifications/warnDeletedReferral/${id}`);
      await referralService.delete(referralId);
      setToast({ message: 'Suppression avec succès', type: 'success' });
      fetchReports();
    } catch (err) {
      console.error(err);
      setToast({ message: err.message || 'Erreur lors de la suppression', type: 'error' });
    }
  };

  const handleIgnore = async (id) => {
    try {
      await api.put(`/api/reports/${id}/ignore`);
      setToast({ message: 'Signalement ignoré', type: 'success' });
      fetchReports();
    } catch (error) {
      setToast({ message: error.message || 'Erreur lors de l\'ignorance du report', type: 'error' });
    }
  };

  const handleWarn = async (id) => {
    try {
      await api.post(`/api/notifications/warn/${id}`);
      setToast({ message: 'Propriétaire averti', type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: err.message || 'Erreur lors de l\'envoi de l\'avertissement', type: 'error' });
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
