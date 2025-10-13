import { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { UserContext } from '../contexts/UserContext';
import { FaTrash, FaPlus, FaFileUpload, FaLink, FaCode, FaInbox, FaChevronDown, FaChevronUp, FaExternalLinkAlt, FaExclamationTriangle, FaPowerOff, FaSyncAlt, FaClock, FaBell } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import CustomToast from '../components/CustomToast';
import BadgeDisplay from '../components/BadgeDisplay';
import { referralService, categoryService, serviceService, badgeService } from '../services';
import { compressServiceLogo } from '../utils/imageCompressor';
import api from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerTarget = useRef(null);

  // Collapse state for each service
  const [collapsedServices, setCollapsedServices] = useState({});

  // Form state
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceLogoFile, setServiceLogoFile] = useState(null);
  const [serviceWebsite, setServiceWebsite] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [formLoading, setFormLoading] = useState(false);

  // Badges state
  const [badges, setBadges] = useState([]);

  const loadMoreReferrals = useCallback(async () => {
    if (!user || loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await referralService.getByUser(user._id, nextPage, 10);
      
      const newReferrals = data.data?.referrals || data.referrals || [];
      const pagination = data.data?.pagination || data.pagination;
      
      setReferrals(prev => [...prev, ...newReferrals]);
      setPage(nextPage);
      setHasMore(pagination?.hasMore || false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [user, page, hasMore, loadingMore]);

  useEffect(() => {
    if (!user) return;

    async function fetchUserReferrals() {
      try {
        setLoading(true);
        const data = await referralService.getByUser(user._id, 1, 10);
        
        const initialReferrals = data.data?.referrals || data.referrals || [];
        const pagination = data.data?.pagination || data.pagination;
        
        setReferrals(initialReferrals);
        setHasMore(pagination?.hasMore || false);
        
        // Initialize all services as collapsed
        const grouped = groupByService(initialReferrals);
        const collapsed = {};
        Object.keys(grouped).forEach(serviceName => {
          collapsed[serviceName] = true;
        });
        setCollapsedServices(collapsed);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchCategories() {
      try {
        const data = await categoryService.getAll();
        setCategories(data.data || data);
      } catch (err) {
        console.error(err);
      }
    }

    async function fetchUserBadges() {
      try {
        const data = await badgeService.getUserBadges(user._id);
        setBadges(data.data || []);
      } catch (err) {
        console.error('Error fetching badges:', err);
      }
    }

    fetchCategories();
    fetchUserReferrals();
    fetchUserBadges();
  }, [user]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreReferrals();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loadingMore, loadMoreReferrals]);

  function groupByService(referrals) {
    return referrals.reduce((acc, ref) => {
      const serviceName = ref.service?.name || 'Unknown Service';
      if (!acc[serviceName]) acc[serviceName] = [];
      acc[serviceName].push(ref);
      return acc;
    }, {});
  }

  function toggleServiceCollapse(serviceName) {
    setCollapsedServices(prev => ({
      ...prev,
      [serviceName]: !prev[serviceName]
    }));
  }

  async function handleDelete(id) {
    if (!confirm(t('errors.deleteConfirm'))) return;
    try {
      setDeletingId(id);
      await referralService.delete(id);
      setReferrals(referrals.filter(ref => ref._id !== id));
      setToast({ message: t('toast.referralDeleted'), type: 'success' });
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setDeletingId(null);
    }
  }

  async function toggleReferralActive(referralId) {
    try {
      const response = await api.patch(`/api/referrals/${referralId}/toggle-active`);
      const updatedReferral = response.data.data || response.data;

      setReferrals(prev => prev.map(ref =>
        ref._id === referralId ? { ...ref, isActive: updatedReferral.isActive } : ref
      ));

      setToast({
        message: updatedReferral.isActive ? 'Parrainage activé' : 'Parrainage désactivé',
        type: 'success'
      });
    } catch (err) {
      setToast({ message: err.message || 'Erreur lors de la mise à jour du statut', type: 'error' });
    }
  }

  async function renewReferral(referralId) {
    if (!confirm('Voulez-vous renouveler ce parrainage pour 3 mois supplémentaires ?')) {
      return;
    }

    try {
      const response = await api.patch(`/api/referrals/${referralId}/renew`);
      const updatedReferral = response.data.data || response.data;

      setReferrals(prev => prev.map(ref =>
        ref._id === referralId ? { ...ref, ...updatedReferral } : ref
      ));

      setToast({ message: 'Parrainage renouvelé avec succès pour 3 mois', type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Erreur lors du renouvellement', type: 'error' });
    }
  }

  async function handleServiceRequestSubmit(e) {
    e.preventDefault();

    if (!serviceName.trim()) {
      setToast({ message: t('dashboard.serviceNameRequired'), type: 'error' });
      return;
    }

    setFormLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', serviceName.trim());
      formData.append('description', serviceDescription.trim());
      formData.append('website', serviceWebsite.trim());
      formData.append('category', selectedCategory || '');

      if (serviceLogoFile) {
        formData.append('logo', serviceLogoFile, serviceLogoFile.name || 'logo.webp');
      }

      await serviceService.create(formData);

      setToast({ message: t('dashboard.serviceRequested'), type: 'success' });
      setServiceName('');
      setServiceDescription('');
      setServiceLogoFile(null);
      setServiceWebsite('');
      setSelectedCategory('');
    } catch (err) {
      setToast({ message: err.message || t('dashboard.requestFailed'), type: 'error' });
    } finally {
      setFormLoading(false);
    }
  }

  if (!user) return (
    <div className="page-container">
      <div className="empty-state">
        <p>{t('auth.loginRequired')}</p>
      </div>
    </div>
  );

  if (loading) return (
    <div className="page-container">
      <div className="spinner" />
    </div>
  );

  if (error) return (
    <div className="page-container">
      <p style={{ color: 'var(--color-error)' }}>{error}</p>
    </div>
  );

  const grouped = groupByService(referrals);

  return (
    <div className="dashboard">
      {toast.message && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}

      <div className="dash-header">
        <div className="dash-header-user">
          {user.profilePhoto ? (
            <img
              src={`${import.meta.env.VITE_API_URL}${user.profilePhoto}`}
              alt={user.username}
              className="dash-user-photo"
            />
          ) : (
            <div className="dash-user-placeholder">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1>{user.username}</h1>
            {badges.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <BadgeDisplay badges={badges} size="medium" />
              </div>
            )}
          </div>
        </div>
        <div className="stats">
          <span>{referrals.length} parrainage{referrals.length > 1 ? 's' : ''}</span>
          <span>·</span>
          <span>{Object.keys(grouped).length} service{Object.keys(grouped).length > 1 ? 's' : ''}</span>
          {user.deletedReferralsCount > 0 && (
            <>
              <span>·</span>
              <span
                className="warning-badge"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-3)',
                  backgroundColor: 'var(--color-error-50)',
                  color: 'var(--color-error-600)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: '600',
                  border: '1.5px solid var(--color-error-500)',
                  boxShadow: '0 2px 4px rgba(193, 122, 111, 0.15)',
                  animation: 'pulse-warning 2s ease-in-out infinite',
                  cursor: 'help',
                  transition: 'all var(--transition-base)'
                }}
                title="⚠️ Parrainages supprimés par les administrateurs pour non-respect des conditions"
              >
                <FaExclamationTriangle size={13} style={{ animation: 'shake 3s ease-in-out infinite' }} />
                {user.deletedReferralsCount} supprimé{user.deletedReferralsCount > 1 ? 's' : ''}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="dash-layout">
        <aside className="sidebar">
          <div className="new-service">
            <h2>
              <FaPlus />
              {t('dashboard.requestNewService')}
            </h2>

            <form onSubmit={handleServiceRequestSubmit}>
              <input
                type="text"
                placeholder={t('dashboard.serviceName')}
                value={serviceName}
                onChange={e => setServiceName(e.target.value)}
                required
              />

              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value="">{t('dashboard.selectCategory')}</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>

              <textarea
                placeholder={t('dashboard.description')}
                value={serviceDescription}
                onChange={e => setServiceDescription(e.target.value)}
                rows={2}
              />

              <input
                type="url"
                placeholder={t('dashboard.website')}
                value={serviceWebsite}
                onChange={e => setServiceWebsite(e.target.value)}
              />

              <div className="file-wrap">
                <label>
                  <FaFileUpload />
                  {serviceLogoFile ? serviceLogoFile.name : t('dashboard.logo')}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        try {
                          const compressed = await compressServiceLogo(file);
                          setServiceLogoFile(compressed);
                        } catch (error) {
                          console.error('Erreur compression:', error);
                          setServiceLogoFile(file);
                        }
                      }
                    }}
                  />
                </label>
              </div>

              <button type="submit" disabled={formLoading} className="btn-primary">
                {formLoading ? t('dashboard.submitting') : t('dashboard.submitRequest')}
              </button>
            </form>
          </div>
        </aside>

        <div className="main-content">
          {referrals.length === 0 ? (
            <div className="empty">
              <FaInbox />
              <p>{t('dashboard.noReferralsYet')}</p>
            </div>
          ) : (
            <>
              <div className="refs-list">
                {Object.entries(grouped).map(([serviceName, refs]) => {
                  const isCollapsed = collapsedServices[serviceName];
                  const serviceId = refs[0]?.service?._id;
                  
                  return (
                    <div key={serviceName} className="service-block">
                      <div 
                        className="service-title"
                        onClick={() => toggleServiceCollapse(serviceName)}
                      >
                        <div className="service-title-left">
                          {serviceId && (
                            <a 
                              href={`/services/${serviceId}`} 
                              onClick={(e) => e.stopPropagation()}
                              className="service-link"
                            >
                              {serviceName}
                              <FaExternalLinkAlt />
                            </a>
                          )}
                          {!serviceId && <span>{serviceName}</span>}
                          <span className="count">{refs.length}</span>
                        </div>
                        <button className="collapse-btn" aria-label={isCollapsed ? 'Développer' : 'Réduire'}>
                          {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                        </button>
                      </div>

                      <div className={`refs-content ${isCollapsed ? 'collapsed' : 'expanded'}`}>
                        {refs.map(ref => (
                          <div key={ref._id} className="ref-row">
                            <div className="ref-info">
                              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                {ref.link ? (
                                  <>
                                    <FaLink />
                                    <a href={ref.link} target="_blank" rel="noreferrer">{ref.link}</a>
                                  </>
                                ) : (
                                  <>
                                    <FaCode />
                                    <code style={{
                                      backgroundColor: 'var(--color-neutral-100)',
                                      border: '1px solid var(--color-border-light)',
                                      borderRadius: 'var(--radius-sm)',
                                      padding: '0 var(--space-2)'
                                    }}>{ref.code}</code>
                                  </>
                                )}

                                {/* Status Badge */}
                                <span style={{
                                  padding: 'var(--space-1) var(--space-2)',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: 'var(--font-size-xs)',
                                  fontWeight: '600',
                                  backgroundColor: ref.isActive ? 'var(--color-success-50)' : 'var(--color-error-50)',
                                  color: ref.isActive ? 'var(--color-success)' : 'var(--color-error)'
                                }}>
                                  {ref.isActive ? 'Actif' : 'Inactif'}
                                </span>

                                {/* Temporary badge with expiration */}
                                {ref.type === 'temporary' && ref.dateFin && (
                                  <span style={{
                                    padding: 'var(--space-1) var(--space-2)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: 'var(--font-size-xs)',
                                    fontWeight: '600',
                                    backgroundColor: 'var(--color-warning-50)',
                                    color: 'var(--color-warning)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-1)'
                                  }}>
                                    <FaClock size={10} />
                                    {Math.ceil((new Date(ref.dateFin) - new Date()) / (1000 * 60 * 60 * 24))} jours restants
                                  </span>
                                )}

                                {/* Expiring soon warning for permanent referrals */}
                                {ref.type === 'permanent' && ref.dateFin && (() => {
                                  const daysLeft = Math.ceil((new Date(ref.dateFin) - new Date()) / (1000 * 60 * 60 * 24));
                                  return daysLeft > 0 && daysLeft <= 3 ? (
                                    <span style={{
                                      padding: 'var(--space-1) var(--space-2)',
                                      borderRadius: 'var(--radius-sm)',
                                      fontSize: 'var(--font-size-xs)',
                                      fontWeight: '600',
                                      backgroundColor: 'var(--color-error-50)',
                                      color: 'var(--color-error)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 'var(--space-1)',
                                      animation: 'pulse 2s ease-in-out infinite'
                                    }}>
                                      <FaBell size={10} />
                                      Expire dans {daysLeft} jour{daysLeft > 1 ? 's' : ''} !
                                    </span>
                                  ) : null;
                                })()}
                              </div>
                              {ref.description && <span className="desc">{ref.description}</span>}
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                              <button
                                onClick={() => toggleReferralActive(ref._id)}
                                className="btn-icon"
                                title={ref.isActive ? 'Désactiver' : 'Activer'}
                                style={{
                                  color: ref.isActive ? 'var(--color-success)' : 'var(--color-text-tertiary)',
                                  border: 'none',
                                  background: 'transparent',
                                  cursor: 'pointer',
                                  padding: 'var(--space-2)',
                                  transition: 'color 0.2s'
                                }}
                              >
                                <FaPowerOff />
                              </button>
                              {ref.type === 'permanent' && (
                                <button
                                  onClick={() => renewReferral(ref._id)}
                                  className="btn-icon"
                                  title="Renouveler pour 3 mois"
                                  style={{
                                    color: 'var(--color-text-tertiary)',
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    padding: 'var(--space-2)',
                                    transition: 'color 0.2s'
                                  }}
                                >
                                  <FaSyncAlt />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(ref._id)}
                                disabled={deletingId === ref._id}
                                className="del-btn btn-danger"
                                aria-label="Supprimer"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Infinite scroll trigger */}
              {hasMore && (
                <div ref={observerTarget} className="load-more-trigger">
                  {loadingMore && (
                    <div className="loading-more">
                      <div className="spinner-small" />
                      <span>Chargement...</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
