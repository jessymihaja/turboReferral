import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaThumbsUp,
  FaLink,
  FaExclamationTriangle,
  FaBan,
  FaCheck,
  FaArrowLeft,
  FaTrash,
  FaShieldAlt,
  FaCopy
} from 'react-icons/fa';
import Table from '../components/Table';
import TimeAgo from '../components/TimeAgo';
import api from '../services/api';
import CustomToast from '../components/CustomToast';
import './UserDetails.css';

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [isBlocking, setIsBlocking] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setToast({ message: 'Copié dans le presse-papier', type: 'success' });
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  async function fetchUserDetails() {
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/users/${id}`);
      const data = response.data || response;
      setUserDetails(data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des détails');
      setToast({ message: err.message || 'Erreur lors du chargement des détails', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleBlockUser() {
    if (!userDetails) return;

    try {
      setIsBlocking(true);
      const isBlocked = !userDetails.user.isBlocked;

      await api.put(`/api/admin/users/${id}/block`, {
        isBlocked,
        reason: blockReason
      });

      setToast({
        message: isBlocked ? 'Utilisateur bloqué avec succès' : 'Utilisateur débloqué avec succès',
        type: 'success'
      });

      setUserDetails({
        ...userDetails,
        user: { ...userDetails.user, isBlocked }
      });

      setShowBlockModal(false);
      setBlockReason('');
    } catch (err) {
      setToast({ message: err.message || 'Erreur lors du blocage', type: 'error' });
    } finally {
      setIsBlocking(false);
    }
  }

  async function handleDeleteUser() {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      return;
    }

    try {
      await api.delete(`/api/admin/users/${id}`);
      setToast({ message: 'Utilisateur supprimé avec succès', type: 'success' });
      navigate('/admin/users');
    } catch (err) {
      setToast({ message: err.message || 'Erreur lors de la suppression', type: 'error' });
    }
  }

  async function handleToggleRole(newRole) {
    if (!userDetails) return;

    const roleMessages = {
      admin: { confirm: 'Êtes-vous sûr de vouloir promouvoir cet utilisateur en administrateur ?', success: 'Utilisateur promu administrateur avec succès' },
      promoter: { confirm: 'Êtes-vous sûr de vouloir promouvoir cet utilisateur en promoteur ?', success: 'Utilisateur promu promoteur avec succès' },
      user: { confirm: 'Êtes-vous sûr de vouloir rétrograder cet utilisateur en utilisateur standard ?', success: 'Utilisateur rétrogradé en utilisateur standard' }
    };

    const message = roleMessages[newRole];
    if (!message || !confirm(message.confirm)) {
      return;
    }

    try {
      await api.put(`/api/admin/users/${id}/role`, { role: newRole });

      setToast({ message: message.success, type: 'success' });

      setUserDetails({
        ...userDetails,
        user: { ...userDetails.user, role: newRole }
      });
    } catch (err) {
      setToast({ message: err.message || 'Erreur lors du changement de rôle', type: 'error' });
    }
  }

  if (loading) {
    return (
      <div className="page-container user-details">
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (error || !userDetails) {
    return (
      <div className="page-container user-details">
        <div className="alert alert-error">
          <span>{error || 'Utilisateur introuvable'}</span>
        </div>
        <button onClick={() => navigate('/admin/users')} className="btn-secondary">
          <FaArrowLeft /> Retour
        </button>
      </div>
    );
  }

  const { user, stats } = userDetails;

  const referralColumns = [
    {
      key: 'service',
      header: 'Service',
      render: (ref) => {
        const name = ref?.service?.name;
        if (!name) return '—';
        return typeof name === 'object' ? (name.fr || name.en || '—') : name;
      }
    },
    {
      key: 'linkOrCode',
      header: 'Lien / Code',
      render: (ref) => {
        const value = ref?.link || ref?.code;
        if (!value) return '—';

        return (
          <div className="copyable-field">
            <span className="copyable-text" title={value}>
              {ref?.link ? value : value}
            </span>
            <button
              onClick={() => copyToClipboard(value)}
              className="btn-copy"
              title="Copier"
            >
              <FaCopy size={12} />
            </button>
          </div>
        );
      }
    },
    {
      key: 'description',
      header: 'Description',
      render: (ref) => {
        const desc = ref?.description;
        if (!desc) return '—';
        return typeof desc === 'object' ? (desc.fr || desc.en || '—') : desc;
      }
    },
    {
      key: 'createdAt',
      header: 'Créé',
      render: (ref) => ref?.createdAt ? <TimeAgo date={ref.createdAt} /> : '—'
    }
  ];

  const reportColumns = [
    {
      key: 'service',
      header: 'Service',
      render: (report) => {
        const name = report?.referralId?.service?.name;
        if (!name) return '—';
        return typeof name === 'object' ? (name.fr || name.en || '—') : name;
      }
    },
    {
      key: 'referralOwner',
      header: 'Propriétaire',
      render: (report) => {
        const owner = report?.referralId?.user;
        if (!owner) return '—';

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {owner.profilePhoto ? (
              <img
                src={`${import.meta.env.VITE_API_URL}${owner.profilePhoto}`}
                alt={owner.username}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--font-size-xs)',
                fontWeight: '600'
              }}>
                {owner.username?.charAt(0).toUpperCase()}
              </div>
            )}
            <span>{owner.username}</span>
          </div>
        );
      }
    },
    {
      key: 'referral',
      header: 'Parrainage',
      render: (report) => {
        const ref = report?.referralId;
        if (!ref) return '—';

        const value = ref.link || ref.code;
        return (
          <div className="copyable-field">
            <span className="copyable-text" title={value} style={{ maxWidth: '200px' }}>
              {value}
            </span>
            <button
              onClick={() => copyToClipboard(value)}
              className="btn-copy"
              title="Copier"
            >
              <FaCopy size={10} />
            </button>
          </div>
        );
      }
    },
    {
      key: 'reason',
      header: 'Raison',
      render: (report) => (
        <span className="badge badge-warning" style={{ fontSize: 'var(--font-size-xs)' }}>
          <FaExclamationTriangle size={10} /> {report?.reason || '—'}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Statut',
      align: 'center',
      render: (report) => (
        <span className={`badge ${report?.status === 0 ? 'badge-success' : 'badge-warning'}`}>
          {report?.status === 0 ? 'Résolu' : 'En attente'}
        </span>
      )
    },
    {
      key: 'reportedAt',
      header: 'Date',
      render: (report) => report?.reportedAt ? <TimeAgo date={report.reportedAt} /> : '—'
    }
  ];

  return (
    <div className="page-container user-details">
      {toast.message && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}
      <div className="user-details-header">
        <button onClick={() => navigate('/admin/users')} className="btn-secondary btn-back">
          <FaArrowLeft /> Retour
        </button>
        <div className="user-details-actions">
          <div style={{ position: 'relative' }}>
            <select
              value={user.role}
              onChange={(e) => handleToggleRole(e.target.value)}
              className="btn-primary"
              style={{ 
                padding: '10px 15px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg-elevated)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '500'
              }}
            >
              <option value="user">👤 Utilisateur</option>
              <option value="promoter">👑 Promoteur</option>
              <option value="admin">🛡️ Administrateur</option>
            </select>
          </div>
          <button
            onClick={() => setShowBlockModal(true)}
            className={user.isBlocked ? 'btn-success' : 'btn-warning'}
          >
            {user.isBlocked ? (
              <>
                <FaCheck /> Débloquer
              </>
            ) : (
              <>
                <FaBan /> Bloquer
              </>
            )}
          </button>
          <button onClick={handleDeleteUser} className="btn-error">
            <FaTrash /> Supprimer
          </button>
        </div>
      </div>

      <div className="user-details-grid">
        <div className="user-col-left">
          <div className="user-profile-card">
            <div className="user-profile-header">
              {user.profilePhoto ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}${user.profilePhoto}`}
                  alt={user.username}
                  className="user-profile-photo"
                />
              ) : (
                <div className="user-profile-photo-placeholder">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="user-profile-info">
                <h1 className="user-profile-name">{user.username}</h1>
                <div className="user-profile-meta">
                  <span className={`badge ${
                    user.role === 'admin' ? 'badge-primary' : 
                    user.role === 'promoter' ? 'badge-warning' : 
                    'badge-secondary'
                  }`}>
                    <FaShieldAlt size={10} /> {
                      user.role === 'admin' ? 'Admin' : 
                      user.role === 'promoter' ? 'Promoteur' : 
                      'Utilisateur'
                    }
                  </span>
                  <span className={`badge ${user.isBlocked ? 'badge-error' : 'badge-success'}`}>
                    {user.isBlocked ? (
                      <>
                        <FaBan size={10} /> Bloqué
                      </>
                    ) : (
                      <>
                        <FaCheck size={10} /> Actif
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="user-profile-details">
              <div className="user-detail-item">
                <FaEnvelope className="detail-icon" />
                <div>
                  <div className="detail-label">Email</div>
                  <div className="detail-value">{user.email}</div>
                </div>
              </div>
              <div className="user-detail-item">
                <FaCalendar className="detail-icon" />
                <div>
                  <div className="detail-label">Membre depuis</div>
                  <div className="detail-value">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              <div className="user-detail-item">
                <FaTrash className="detail-icon" />
                <div>
                  <div className="detail-label">Parrainages supprimés</div>
                  <div className="detail-value">{user.deletedReferralsCount || 0}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon referrals">
                <FaLink />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats?.referrals?.total || 0}</div>
                <div className="stat-label">Parrainages</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon positive">
                <FaThumbsUp />
              </div>
              <div className="stat-content">
                <div className="stat-value">{(stats?.votesReceived?.positive || 0) + (stats?.votesReceived?.negative || 0)}</div>
                <div className="stat-label">Votes reçus</div>
                <div className="stat-sublabel">
                  {stats?.votesReceived?.average || 0}% de satisfaction
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon given">
                <FaUser />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats?.votesGiven?.total || 0}</div>
                <div className="stat-label">Participations</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon reports">
                <FaExclamationTriangle />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats?.reportsReceived?.total || 0}</div>
                <div className="stat-label">Signalements reçus</div>
              </div>
            </div>
          </div>
        </div>

        <div className="user-col-right">
          <div className="user-section">
            <h2 className="section-title">
              <FaLink /> Parrainages ({stats?.referrals?.total || 0})
            </h2>
            <div className="section-content">
              <Table
                data={stats?.referrals?.list || []}
                columns={referralColumns}
                searchable={true}
                sortable={true}
                paginated={true}
                pageSize={10}
                emptyMessage="Aucun parrainage"
              />
            </div>
          </div>

          <div className="user-section">
            <h2 className="section-title">
              <FaExclamationTriangle /> Signalements effectués ({stats?.reportsMade?.total || 0})
            </h2>
            <div className="section-content">
              <Table
                data={stats?.reportsMade?.list || []}
                columns={reportColumns}
                searchable={false}
                sortable={true}
                paginated={true}
                pageSize={5}
                emptyMessage="Aucun signalement effectué"
              />
            </div>
          </div>

          <div className="user-section">
            <h2 className="section-title">
              <FaExclamationTriangle /> Signalements reçus ({stats?.reportsReceived?.total || 0})
            </h2>
            <div className="section-content">
              <Table
                data={stats?.reportsReceived?.list || []}
                columns={reportColumns}
                searchable={false}
                sortable={true}
                paginated={true}
                pageSize={5}
                emptyMessage="Aucun signalement reçu"
              />
            </div>
          </div>
        </div>
      </div>

      {showBlockModal && (
        <div className="modal-overlay" onClick={() => setShowBlockModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {user.isBlocked ? 'Débloquer l\'utilisateur' : 'Bloquer l\'utilisateur'}
              </h2>
            </div>
            <div className="modal-body">
              <p>
                {user.isBlocked
                  ? 'Êtes-vous sûr de vouloir débloquer cet utilisateur ? Il pourra à nouveau accéder à son compte.'
                  : 'Êtes-vous sûr de vouloir bloquer cet utilisateur ? Toutes ses actions seront désactivées.'}
              </p>
              {!user.isBlocked && (
                <div className="form-group">
                  <label htmlFor="blockReason">Raison (optionnel)</label>
                  <textarea
                    id="blockReason"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder="Raison du blocage..."
                    rows="4"
                    className="form-input"
                  />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowBlockModal(false)}
                className="btn-secondary"
                disabled={isBlocking}
              >
                Annuler
              </button>
              <button
                onClick={handleBlockUser}
                className={user.isBlocked ? 'btn-success' : 'btn-warning'}
                disabled={isBlocking}
              >
                {isBlocking ? (
                  'Traitement...'
                ) : user.isBlocked ? (
                  <>
                    <FaCheck /> Débloquer
                  </>
                ) : (
                  <>
                    <FaBan /> Bloquer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
