import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaThumbsUp,
  FaThumbsDown,
  FaLink,
  FaExclamationTriangle,
  FaBan,
  FaCheck,
  FaArrowLeft,
  FaTrash,
  FaShieldAlt,
  FaCopy,
  FaUserShield
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    CustomToast.success('Copié dans le presse-papier');
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
      CustomToast.error(err.message || 'Erreur lors du chargement des détails');
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

      CustomToast.success(
        isBlocked ? 'Utilisateur bloqué avec succès' : 'Utilisateur débloqué avec succès'
      );

      setUserDetails({
        ...userDetails,
        user: { ...userDetails.user, isBlocked }
      });

      setShowBlockModal(false);
      setBlockReason('');
    } catch (err) {
      CustomToast.error(err.message || 'Erreur lors du blocage');
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
      CustomToast.success('Utilisateur supprimé avec succès');
      navigate('/admin/users');
    } catch (err) {
      CustomToast.error(err.message || 'Erreur lors de la suppression');
    }
  }

  async function handleToggleRole() {
    if (!userDetails) return;

    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const confirmMessage = newRole === 'admin'
      ? 'Êtes-vous sûr de vouloir promouvoir cet utilisateur en administrateur ?'
      : 'Êtes-vous sûr de vouloir rétrograder cet administrateur en utilisateur standard ?';

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      await api.put(`/api/admin/users/${id}/role`, { role: newRole });

      CustomToast.success(
        newRole === 'admin'
          ? 'Utilisateur promu administrateur avec succès'
          : 'Utilisateur rétrogradé en utilisateur standard'
      );

      setUserDetails({
        ...userDetails,
        user: { ...userDetails.user, role: newRole }
      });
    } catch (err) {
      CustomToast.error(err.message || 'Erreur lors du changement de rôle');
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
      render: (ref) => ref?.service?.name || '—'
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
      render: (ref) => ref?.description || '—'
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
      render: (report) => report?.referralId?.service?.name || '—'
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
        <span className={`badge ${report?.status === 1 ? 'badge-success' : 'badge-error'}`}>
          {report?.status === 1 ? 'Résolu' : 'En attente'}
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
      <div className="user-details-header">
        <button onClick={() => navigate('/admin/users')} className="btn-secondary btn-back">
          <FaArrowLeft /> Retour
        </button>
        <div className="user-details-actions">
          <button
            onClick={handleToggleRole}
            className={user.role === 'admin' ? 'btn-secondary' : 'btn-primary'}
            title={user.role === 'admin' ? 'Rétrograder en utilisateur' : 'Promouvoir administrateur'}
          >
            {user.role === 'admin' ? (
              <>
                <FaUser /> Rétrograder
              </>
            ) : (
              <>
                <FaUserShield /> Promouvoir Admin
              </>
            )}
          </button>
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
                  <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                    <FaShieldAlt size={10} /> {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
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
                <div className="stat-value">{stats.referrals.total}</div>
                <div className="stat-label">Parrainages</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon positive">
                <FaThumbsUp />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.votesReceived.positive + stats.votesReceived.negative}</div>
                <div className="stat-label">Votes reçus</div>
                <div className="stat-sublabel">
                  {stats.votesReceived.average}% de satisfaction
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon given">
                <FaUser />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.votesGiven.total}</div>
                <div className="stat-label">Participations</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon reports">
                <FaExclamationTriangle />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.reports.total}</div>
                <div className="stat-label">Signalement reçus</div>
              </div>
            </div>
          </div>
        </div>

        <div className="user-col-right">
          <div className="user-section">
            <h2 className="section-title">
              <FaLink /> Parrainages ({stats.referrals.total})
            </h2>
            <div className="section-content">
              <Table
                data={stats.referrals.list}
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
              <FaExclamationTriangle /> Signalement effectué ({stats.reports.total})
            </h2>
            <div className="section-content">
              <Table
                data={stats.reports.list}
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
