import { useEffect, useState } from "react";
import { FaCrown, FaUser, FaLink, FaCode, FaCalendar, FaThumbsUp, FaThumbsDown, FaTrash, FaChartLine, FaComment } from "react-icons/fa";
import Table from "./Table";
import PromoteReferralModal from "./PromoteReferralModal";
import api from '../services/api';
import { referralService } from '../services';
import { useTranslation } from 'react-i18next';
import './AdminReferrals.css';

export default function AdminReferralsPage() {
  const { t } = useTranslation();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReferral, setSelectedReferral] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get('/api/referrals/with-status');
        const referralsData = data.data || data;
        
        // Fetch promotion details for promoted referrals
        const referralsWithPromo = await Promise.all(
          referralsData.map(async (ref) => {
            if (ref.isPromoted) {
              try {
                const promoData = await api.get(`/api/promotions/by-referral/${ref._id}`);
                return { ...ref, promotion: promoData.data || promoData };
              } catch (err) {
                return ref;
              }
            }
            return ref;
          })
        );
        
        setReferrals(referralsWithPromo);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  async function handleDeleteReferral(id) {
    if (!confirm(t('toast.confirmDeleteReferral'))) return;
    try {
      await referralService.delete(id);
      setReferrals(referrals.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  const totalVotes = referrals.reduce((sum, r) => sum + (r.goodVotes || 0) + (r.badVotes || 0), 0);
  const totalGoodVotes = referrals.reduce((sum, r) => sum + (r.goodVotes || 0), 0);
  const totalBadVotes = referrals.reduce((sum, r) => sum + (r.badVotes || 0), 0);

  const now = new Date();
  const activePromotions = referrals.filter(r => {
    if (!r.isPromoted || !r.promotion) return false;
    const start = new Date(r.promotion.dateDebut);
    const end = new Date(r.promotion.dateFin);
    return now >= start && now <= end;
  }).length;

  const expiredPromotions = referrals.filter(r => {
    if (!r.isPromoted || !r.promotion) return false;
    const end = new Date(r.promotion.dateFin);
    return now > end;
  }).length;

  const columns = [
    {
      key: 'user',
      header: t('table.user'),
      accessor: (row) => row.user?.username || t('errors.unknown'),
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div className="avatar avatar-sm">
            {(row.user?.username || 'U')[0].toUpperCase()}
          </div>
          <span>{row.user?.username || t('errors.unknown')}</span>
        </div>
      )
    },
    {
      key: 'service',
      header: t('table.service'),
      accessor: (row) => row.service?.name || t('errors.unknown'),
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {row.service?.logo ? (
            <img
              src={`${import.meta.env.VITE_API_URL}${row.service.logo}`}
              alt={row.service.name}
              style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: 'var(--radius-sm)',
                objectFit: 'cover'
              }}
            />
          ) : null}
          <span>{row.service?.name || t('errors.unknown')}</span>
        </div>
      )
    },
    {
      key: 'referral',
      header: t('common.referrals'),
      sortable: false,
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {row.link ? (
            <>
              <FaLink size={12} className="text-tertiary" />
              <a 
                href={row.link} 
                target="_blank" 
                rel="noreferrer"
                className="truncate"
                style={{ maxWidth: '200px' }}
                title={row.link}
              >
                {row.link}
              </a>
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
                {row.code}
              </code>
            </>
          )}
        </div>
      )
    },
    {
      key: 'votes',
      header: t('admin.votes'),
      align: 'center',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-success-600)' }}>
            <FaThumbsUp size={12} />
            <span style={{ fontWeight: 600 }}>{row.goodVotes || 0}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-error-600)' }}>
            <FaThumbsDown size={12} />
            <span style={{ fontWeight: 600 }}>{row.badVotes || 0}</span>
          </div>
        </div>
      )
    },
    {
      key: 'description',
      header: t('table.description'),
      accessor: (row) => row.description || '—',
      render: (row) => (
        <div className="truncate" style={{ maxWidth: '200px' }} title={row.description}>
          {row.description || '—'}
        </div>
      )
    },
    {
      key: 'isPromoted',
      header: t('table.status'),
      align: 'center',
      render: (row) => {
        if (!row.isPromoted) {
          return (
            <span className="badge badge-neutral">
              {t('table.inactive')}
            </span>
          );
        }
        
        // Promoted with dates
        if (row.promotion) {
          const startDate = new Date(row.promotion.dateDebut);
          const endDate = new Date(row.promotion.dateFin);
          const now = new Date();
          const isActive = now >= startDate && now <= endDate;
          const isExpired = now > endDate;
          
          return (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 'var(--space-2)'
            }}>
              <span className="badge-promoted">
                <FaCrown size={10} />
              </span>
              <div style={{ 
                fontSize: 'var(--font-size-xs)', 
                color: 'var(--color-text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                  <span>{startDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>→</span>
                  <span>{endDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</span>
                </div>
                <span 
                  className={`badge ${isActive ? 'badge-success' : isExpired ? 'badge-neutral' : 'badge-warning'}`}
                  style={{ fontSize: 'var(--font-size-xs)', padding: 'var(--space-1) var(--space-2)' }}
                >
                  {isActive ? t('admin.active') : isExpired ? t('admin.expired') : t('admin.scheduled')}
                </span>
              </div>
            </div>
          );
        }
        
        // Promoted without dates
        return (
          <span className="badge-promoted">
            <FaCrown size={10} />
          </span>
        );
      }
    },
    {
      key: 'createdAt',
      header: t('table.created'),
      accessor: (row) => new Date(row.createdAt).toLocaleDateString(),
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <FaCalendar size={12} className="text-tertiary" />
          <span>{new Date(row.createdAt).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      key: 'actions',
      header: t('table.actions'),
      sortable: false,
      align: 'center',
      width: '180px',
      render: (row) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center' }}>
          <button
            onClick={() => setSelectedReferral(row)}
            className="btn-sm btn-promote"
            title={t('admin.promoteReferral')}
          >
            <FaCrown size={12} />
          </button>
          <button
            onClick={() => handleDeleteReferral(row._id)}
            className="btn-sm btn-danger btn-delete"
            title={t('admin.deleteReferral')}
          >
            <FaTrash size={12} />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="page-container admin-referrals-page">
        <div className="page-header">
          <h1 className="page-title">{t('admin.referralsManagement')}</h1>
          <p className="page-subtitle">{t('admin.manageReferralsDesc')}</p>
        </div>

        <div className="referrals-stats-grid">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="referrals-skeleton-card">
              <div className="referrals-skeleton-text medium" />
              <div className="referrals-skeleton-text large" />
              <div className="referrals-skeleton-text small" />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container admin-referrals-page">
      <div className="page-header">
        <h1 className="page-title">{t('admin.referralsManagement')}</h1>
        <p className="page-subtitle">{t('admin.manageReferralsDesc')}</p>
      </div>

      <div className="referrals-stats-grid">
        <div className="referrals-stat-card">
          <div className="referrals-stat-header">
            <div className="referrals-stat-icon">
              <FaLink />
            </div>
          </div>
          <div className="referrals-stat-value">{referrals.length}</div>
          <div className="referrals-stat-label">{t('admin.totalReferrals')}</div>
        </div>

        <div className="referrals-stat-card">
          <div className="referrals-stat-header">
            <div className="referrals-stat-icon promoted">
              <FaCrown />
            </div>
          </div>
          <div className="referrals-stat-value">
            {referrals.filter(r => r.isPromoted).length}
          </div>
          <div className="referrals-stat-label">{t('admin.promoted')}</div>
          <div className="referrals-stat-sublabel">
            {activePromotions} {t('admin.active').toLowerCase()} / {expiredPromotions} {t('admin.expired').toLowerCase()}
          </div>
        </div>

        <div className="referrals-stat-card">
          <div className="referrals-stat-header">
            <div className="referrals-stat-icon users">
              <FaUser />
            </div>
          </div>
          <div className="referrals-stat-value">
            {new Set(referrals.map(r => r.user?._id)).size}
          </div>
          <div className="referrals-stat-label">{t('admin.contributors')}</div>
        </div>

        <div className="referrals-stat-card">
          <div className="referrals-stat-header">
            <div className="referrals-stat-icon votes">
              <FaChartLine />
            </div>
            <div className="referrals-stat-trend positive">
              <FaThumbsUp size={10} />
              <span>{Math.round((totalGoodVotes / (totalVotes || 1)) * 100)}%</span>
            </div>
          </div>
          <div className="referrals-stat-value">{totalVotes}</div>
          <div className="referrals-stat-label">{t('admin.totalVotes')}</div>
          <div className="referrals-stat-sublabel">
            {totalGoodVotes} <FaThumbsUp size={10} style={{ display: 'inline' }} /> / {totalBadVotes} <FaThumbsDown size={10} style={{ display: 'inline' }} />
          </div>
        </div>

        <div className="referrals-stat-card">
          <div className="referrals-stat-header">
            <div className="referrals-stat-icon">
              <FaComment />
            </div>
          </div>
          <div className="referrals-stat-value">
            {new Set(referrals.map(r => r.service?._id)).size}
          </div>
          <div className="referrals-stat-label">{t('admin.servicesWithReferrals')}</div>
        </div>
      </div>

      <div className="referrals-table-section">
        <div className="referrals-table-wrapper">
          <Table
            data={referrals}
            columns={columns}
            searchable={true}
            sortable={true}
            paginated={true}
            pageSize={15}
            emptyMessage={t('admin.noReferralsFound')}
          />
        </div>
      </div>

      {selectedReferral && (
        <PromoteReferralModal
          referral={selectedReferral}
          isOpen={!!selectedReferral}
          onClose={() => setSelectedReferral(null)}
          onCreated={async (newPromo) => {
            console.log("Promo created:", newPromo);
            // Fetch the full promotion data with dates
            try {
              const promoData = await api.get(`/api/promotions/by-referral/${selectedReferral._id}`);
              const promotion = promoData.data || promoData;
              
              const updatedReferrals = referrals.map(r => 
                r._id === selectedReferral._id ? { ...r, isPromoted: true, promotion } : r
              );
              setReferrals(updatedReferrals);
            } catch (err) {
              console.error("Error fetching promotion details:", err);
              // Fallback to just marking as promoted
              const updatedReferrals = referrals.map(r => 
                r._id === selectedReferral._id ? { ...r, isPromoted: true } : r
              );
              setReferrals(updatedReferrals);
            }
            setSelectedReferral(null);
          }}
        />
      )}
    </div>
  );
}

