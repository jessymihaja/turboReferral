import { useEffect, useState } from 'react';
import { FaCheck, FaExclamationTriangle, FaTrash, FaEye, FaFlag, FaLink, FaCode } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Table from '../components/Table';
import CustomToast from '../components/CustomToast';
import { referralService } from '../services';
import api from '../services/api';

export default function PendingReports() {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id, referralId) => {
    if (!confirm(t('reports.deleteReferralConfirm'))) return;

    try {
      await api.post(`/api/notifications/warnDeletedReferral/${id}`);
      await referralService.delete(referralId);
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

  const handleWarn = async (id) => {
    try {
      await api.post(`/api/notifications/warn/${id}`);
      setToast({ message: t('reports.ownerNotified'), type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: err.message || t('reports.errorSending'), type: 'error' });
    }
  };

  const columns = [
    {
      key: 'user',
      header: t('reports.owner'),
      accessor: (report) => report.referralId?.user?.username || t('errors.unknown'),
      render: (report) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div className="avatar avatar-sm">
            {(report.referralId?.user?.username || 'U')[0].toUpperCase()}
          </div>
          <span>{report.referralId?.user?.username || t('errors.unknown')}</span>
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
      accessor: (report) => report.reason,
      render: (report) => (
        <span className="badge badge-warning">
          <FaFlag size={10} /> {report.reason}
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
      width: '180px',
      render: (report) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center' }}>
          <button
            onClick={() => handleIgnore(report._id)}
            className="btn-sm btn-success"
            title={t('reports.ignoreReport')}
          >
            <FaCheck size={12} />
          </button>
          <button
            onClick={() => handleWarn(report._id)}
            className="btn-sm"
            style={{
              backgroundColor: 'var(--color-warning-500)',
              color: 'white'
            }}
            title={t('reports.warnOwner')}
          >
            <FaExclamationTriangle size={12} />
          </button>
          <button
            onClick={() => handleDelete(report._id, report.referralId._id)}
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
    <div className="page-container">
      {toast.message && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}

      <div className="page-header">
        <h1 className="page-title">
          <FaFlag style={{ display: 'inline', marginRight: 'var(--space-2)' }} />
          {t('reports.pendingReports')}
        </h1>
        <p className="page-subtitle">{t('reports.reviewAndModerate')}</p>
      </div>

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
    </div>
  );
}
