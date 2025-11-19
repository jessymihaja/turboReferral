import { useEffect, useState } from 'react';
import { FaCheck, FaTrash, FaEye, FaFlag, FaLink, FaCode, FaBan } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../components/AdminLayout';
import Table from '../components/Table';
import CustomToast from '../components/CustomToast';
import api from '../services/api';

export default function PendingReports() {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [blockReason, setBlockReason] = useState('');
  const [isBlocking, setIsBlocking] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/reports/pending');
      setReports(data.data || data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setToast({ message: t('reports.errorLoading'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('reports.deleteReferralConfirm'))) return;

    try {
      await api.delete(`/api/reports/${id}/delete-referral`);
      setToast({ message: t('reports.referralDeleted'), type: 'success' });
      fetchReports();
    } catch (err) {
      console.error(err);
      setToast({ message: err.message || t('reports.errorDeleting'), type: 'error' });
    }
  };

  const handleIgnore = async (id) => {
    try {
      await api.put(`/api/reports/${id}/ignore`);
      setToast({ message: t('reports.reportIgnored'), type: 'success' });
      fetchReports();
    } catch (error) {
      setToast({ message: error.message || t('reports.errorIgnoring'), type: 'error' });
    }
  };

  const handleBlockUser = async () => {
    if (!selectedUser) return;

    try {
      setIsBlocking(true);
      const isBlocked = !selectedUser.isBlocked;

      await api.put(`/api/admin/users/${selectedUser._id}/block`, {
        isBlocked,
        reason: blockReason
      });

      setToast({
        message: isBlocked ? 'Utilisateur bloqué avec succès' : 'Utilisateur débloqué avec succès',
        type: 'success'
      });

      // Update reports with new blocked status
      setReports(reports.map(report => {
        if (report.referralId?.user?._id === selectedUser._id) {
          return {
            ...report,
            referralId: {
              ...report.referralId,
              user: {
                ...report.referralId.user,
                isBlocked
              }
            }
          };
        }
        return report;
      }));

      setShowBlockModal(false);
      setBlockReason('');
      setSelectedUser(null);
    } catch (err) {
      setToast({ message: err.message || 'Erreur lors du blocage', type: 'error' });
    } finally {
      setIsBlocking(false);
    }
  };


  const columns = [
    {
      key: 'user',
      header: t('reports.owner'),
      accessor: (report) => report.referralId?.user?.username || t('errors.unknown'),
      render: (report) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {report.referralId?.user?.profilePhoto ? (
            <img
              src={`${import.meta.env.VITE_API_URL}${report.referralId.user.profilePhoto}`}
              alt={report.referralId.user.username}
              className="avatar avatar-sm"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div className="avatar avatar-sm">
              {(report.referralId?.user?.username || 'U')[0].toUpperCase()}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <span>{report.referralId?.user?.username || t('errors.unknown')}</span>
            {report.referralId?.user?.isBlocked && (
              <span className="badge badge-error" style={{ fontSize: 'var(--font-size-xs)', padding: 'var(--space-1) var(--space-2)' }}>
                <FaBan size={8} /> Bloqué
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'referral',
      header: t('reports.referral'),
      sortable: false,
      render: (report) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {report.referralId?.link ? (
            <>
              <FaLink size={12} className="text-tertiary" />
              <a
                href={report.referralId.link}
                target="_blank"
                rel="noreferrer"
                className="truncate"
                style={{ 
                  maxWidth: '250px',
                  color: 'var(--color-primary)',
                  textDecoration: 'none'
                }}
                title={report.referralId.link}
              >
                {report.referralId.link}
              </a>
              <FaEye size={12} className="text-tertiary" />
            </>
          ) : (
            <>
              <FaCode size={12} className="text-tertiary" />
              <code style={{
                fontSize: 'var(--font-size-sm)',
                background: 'var(--color-bg-muted)',
                padding: 'var(--space-1) var(--space-2)',
                borderRadius: 'var(--radius-sm)'
              }}>
                {report.referralId?.code}
              </code>
            </>
          )}
        </div>
      )
    },
    {
      key: 'reporter',
      header: t('reports.reportedBy'),
      accessor: (report) => report.reporterId?.username || t('errors.unknown')
    },
    {
      key: 'reason',
      header: t('reports.reason'),
      accessor: (report) => t(`reports.reportReasons.${report.reason}`),
      render: (report) => (
        <span className="badge badge-warning">
          <FaFlag size={10} /> {t(`reports.reportReasons.${report.reason}`)}
        </span>
      )
    },
    {
      key: 'reportedAt',
      header: t('reports.date'),
      accessor: (report) => new Date(report.reportedAt).toLocaleDateString(),
      render: (report) => (
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          {new Date(report.reportedAt).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'actions',
      header: t('reports.actions'),
      sortable: false,
      align: 'center',
      width: '150px',
      render: (report) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center' }}>
          <button
            onClick={() => {
              setSelectedUser(report.referralId?.user);
              setShowBlockModal(true);
            }}
            className={`btn-sm ${report.referralId?.user?.isBlocked ? 'btn-success' : 'btn-warning'}`}
            title={report.referralId?.user?.isBlocked ? 'Débloquer l\'utilisateur' : 'Bloquer l\'utilisateur'}
            disabled={!report.referralId?.user}
          >
            <FaBan size={12} />
          </button>
          <button
            onClick={() => handleIgnore(report._id)}
            className="btn-sm btn-success"
            title={t('reports.ignoreReport')}
          >
            <FaCheck size={12} />
          </button>
          <button
            onClick={() => handleDelete(report._id)}
            className="btn-sm btn-danger"
            title={t('common.delete')}
          >
            <FaTrash size={12} />
          </button>
        </div>
      )
    }
  ];

  return (
      <AdminLayout
        title={
          <>
            <FaFlag style={{ display: 'inline', marginRight: 'var(--space-2)' }} />
            {t('reports.pendingReports')}
          </>
        }
        subtitle={t('reports.reviewAndModerate')}
      >
      {toast.message && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}


      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-label">
            <FaFlag /> {t('reports.pendingReports')}
          </div>
          <div className="stat-value">{reports.length}</div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
          <div className="spinner" />
        </div>
      ) : (
        <Table
          data={reports}
          columns={columns}
          searchable={true}
          sortable={true}
          paginated={true}
          pageSize={10}
          emptyMessage={t('reports.noPendingReports')}
        />
      )}

      {/* Block User Modal */}
      {showBlockModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowBlockModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {selectedUser.isBlocked ? 'Débloquer l\'utilisateur' : 'Bloquer l\'utilisateur'}
              </h2>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: 'var(--space-4)' }}>
                {selectedUser.isBlocked
                  ? `Êtes-vous sûr de vouloir débloquer "${selectedUser.username}" ? Il pourra à nouveau accéder à son compte.`
                  : `Êtes-vous sûr de vouloir bloquer "${selectedUser.username}" ? Toutes ses actions seront désactivées.`}
              </p>
              {!selectedUser.isBlocked && (
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
                onClick={() => {
                  setShowBlockModal(false);
                  setBlockReason('');
                  setSelectedUser(null);
                }}
                className="btn-secondary"
                disabled={isBlocking}
              >
                Annuler
              </button>
              <button
                onClick={handleBlockUser}
                className={selectedUser.isBlocked ? 'btn-success' : 'btn-warning'}
                disabled={isBlocking}
              >
                {isBlocking ? (
                  'Traitement...'
                ) : selectedUser.isBlocked ? (
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
      </AdminLayout>
  );
}
