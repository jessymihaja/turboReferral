import { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { UserContext } from '../contexts/UserContext';
import { FaTrash, FaPlus, FaFileUpload, FaLink, FaCode, FaInbox, FaChevronDown, FaChevronUp, FaExternalLinkAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import CustomToast from '../components/CustomToast';
import { referralService, categoryService, serviceService } from '../services';
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
  const [validationPatterns, setValidationPatterns] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [formLoading, setFormLoading] = useState(false);

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

    fetchCategories();
    fetchUserReferrals();
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
      formData.append(
        'validationPatterns',
        JSON.stringify(
          validationPatterns
            .split(/\n|,/)
            .map(p => p.trim())
            .filter(p => p.length > 0)
        )
      );

      if (serviceLogoFile) {
        formData.append('logo', serviceLogoFile);
      }

      await serviceService.create(formData);

      setToast({ message: t('dashboard.serviceRequested'), type: 'success' });
      setServiceName('');
      setServiceDescription('');
      setServiceLogoFile(null);
      setServiceWebsite('');
      setValidationPatterns('');
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
        <h1>{user.username}</h1>
        <div className="stats">
          <span>{referrals.length} parrainage{referrals.length > 1 ? 's' : ''}</span>
          <span>·</span>
          <span>{Object.keys(grouped).length} service{Object.keys(grouped).length > 1 ? 's' : ''}</span>
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
                    onChange={e => setServiceLogoFile(e.target.files[0])}
                  />
                </label>
              </div>

              <textarea
                placeholder={t('dashboard.validationPatterns')}
                value={validationPatterns}
                onChange={e => setValidationPatterns(e.target.value)}
                rows={2}
                className="mono"
              />

              <button type="submit" disabled={formLoading}>
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
                              {ref.link ? (
                                <>
                                  <FaLink />
                                  <a href={ref.link} target="_blank" rel="noreferrer">{ref.link}</a>
                                </>
                              ) : (
                                <>
                                  <FaCode />
                                  <code>{ref.code}</code>
                                </>
                              )}
                              {ref.description && <span className="desc">{ref.description}</span>}
                            </div>
                            <button
                              onClick={() => handleDelete(ref._id)}
                              disabled={deletingId === ref._id}
                              className="del-btn"
                              aria-label="Supprimer"
                            >
                              <FaTrash />
                            </button>
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
