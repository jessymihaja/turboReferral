import { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Turnstile from 'react-turnstile';
import { UserContext } from '../contexts/UserContext';
import ReferralVoteForm from '../components/ReferralVoteForm';
import {
  FaComment, FaThumbsUp, FaThumbsDown, FaCrown, FaLink,
  FaCode, FaGlobe, FaArrowLeft, FaPlus, FaExternalLinkAlt, FaBox, FaFlag, FaCopy, FaCheck, FaTrash, FaSpinner, FaSort,
  FaPowerOff, FaSyncAlt, FaClock, FaCalendarAlt, FaBell
} from 'react-icons/fa';
import TimeAgo from '../components/TimeAgo';
import CommentModal from '../components/CommentModal';
import CustomToast from '../components/CustomToast';
import ReportReferral from '../components/ReportReferral';
import PreniumReferralCard from '../components/PreniumReferralCard';
import BadgeDisplay from '../components/BadgeDisplay';
import MultilingualDescriptionInput from '../components/MultilingualDescriptionInput';
import { serviceService, referralService, voteService, badgeService } from '../services';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import { TURNSTILE_SITE_KEY, BASE_URL } from '../config/constants';
import { generateServiceUrl, slugify } from '../utils/slugify';
import { getDescriptionInLanguage } from '../utils/languages';
import styles from './ServiceDetail.module.css';

export default function ServiceDetail() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [service, setService] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newReferral, setNewReferral] = useState({
    link: undefined,
    code: undefined,
    description: {},
    type: 'permanent',
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: '',
    source: undefined
  });
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [promotions, setPromotions] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [openVoteForm, setOpenVoteForm] = useState(null);
  const [userBadges, setUserBadges] = useState({});
  const [sortBy, setSortBy] = useState('pertinence');
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setReferrals([]); // Clear previous referrals
        setPage(1); // Reset to first page

        const [serviceData, referralData, promotionsData] = await Promise.all([
          serviceService.getById(id),
          referralService.getByService(id, 1, 10, sortBy),
          api.get(`/api/promotions/active/service/${id}`)
        ]);

        setService(serviceData.data || serviceData);

        const referralResponse = referralData.data || referralData;
        const referrals = referralResponse.referrals || [];
        const pagination = referralResponse.pagination || {};
        const promos = promotionsData.data || promotionsData;

        setReferrals(referrals);
        setPromotions(promos);
        setHasMore(pagination.hasMore || false);

      } catch (err) {
        setError(err.message || 'Error loading data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, sortBy]);

  async function loadMoreReferrals() {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      
      const referralData = await referralService.getByService(id, nextPage, 10, sortBy);

      const referralResponse = referralData.data || referralData;
      const newReferrals = referralResponse.referrals || [];
      const pagination = referralResponse.pagination || {};

      setReferrals(prev => [...prev, ...newReferrals]);
      setPage(nextPage);
      setHasMore(pagination.hasMore || false);
    } catch (err) {
      console.error('Error loading more referrals:', err);
    } finally {
      setLoadingMore(false);
    }
  }

  // Update meta tags for SEO when service loads
  useEffect(() => {
    if (service) {
      const serviceName = typeof service.name === 'object' 
        ? (service.name[i18n.language] || service.name.fr || service.name.en || 'Service')
        : (service.name || 'Service');
      
      const serviceDesc = typeof service.description === 'object'
        ? (service.description[i18n.language] || service.description.fr || service.description.en || 'Découvrez les meilleures offres de parrainage')
        : (service.description || 'Découvrez les meilleures offres de parrainage');
      
      const pageTitle = `${serviceName} - Codes et Liens de Parrainage | RefPush`;
      
      // Update page title
      document.title = pageTitle;
      
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = `${serviceName}: ${serviceDesc.substring(0, 120)}... Partagez et validez les codes de parrainage sur RefPush.`;
      
      // Update og:title
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.content = pageTitle;
      
      // Update og:description
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        document.head.appendChild(ogDesc);
      }
      ogDesc.content = metaDesc.content;
      
      // Update og:url
      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (!ogUrl) {
        ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        document.head.appendChild(ogUrl);
      }
      const serviceSlug = slugify(serviceName);
      ogUrl.content = `${BASE_URL}/services/${id}${serviceSlug ? `/${serviceSlug}` : ''}`;
      
      // Update og:image if service has logo
      if (service.logo) {
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (!ogImage) {
          ogImage = document.createElement('meta');
          ogImage.setAttribute('property', 'og:image');
          document.head.appendChild(ogImage);
        }
        ogImage.content = `${BASE_URL}${service.logo}`;
      }
    }
  }, [service, id]);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 300 && hasMore && !loadingMore) {
        loadMoreReferrals();
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadingMore, page, id, sortBy]);

  async function refreshVoteCounts() {
    try {
      const referralData = await referralService.getByService(id, 1, page * 10, sortBy);
      const referralResponse = referralData.data || referralData;
      const refreshedReferrals = referralResponse.referrals || [];

      setReferrals(refreshedReferrals.slice(0, referrals.length));
    } catch (err) {
      console.error('Error refreshing vote counts:', err);
    }
  }

  async function fetchUserBadges(userId) {
    if (!userId || userBadges[userId]) return;

    try {
      const data = await badgeService.getUserBadges(userId);
      const badgesArray = data.data || [];
      setUserBadges(prev => ({
        ...prev,
        [userId]: badgesArray
      }));
    } catch (err) {
      console.error('Error fetching badges:', err);
    }
  }

  useEffect(() => {
    referrals.forEach(ref => {
      if (ref.user?._id) {
        fetchUserBadges(ref.user._id);
      }
    });
  }, [referrals]);

  const hasActiveReferralForUser = user && user.role !== 'promoter'
    ? referrals.some(ref =>
        (ref.user?.username === user.username || ref.user === user.username) &&
        ref.isActive
      )
    : false;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!turnstileToken) {
      setToast({ message: t('errors.captchaRequired'), type: 'error' });
      return;
    }

    if ((!newReferral.link && !newReferral.code) || (newReferral.link && newReferral.code)) {
      setToast({ message: t('toast.provideEitherLinkOrCode'), type: 'error' });
      return;
    }

    if (newReferral.code && newReferral.code.length > 20) {
      setToast({ message: t('toast.codeTooLong', { maxLength: 20 }), type: 'error' });
      return;
    }

    if (newReferral.type === 'temporary' && !newReferral.dateFin) {
      setToast({ message: t('toast.endDateRequired'), type: 'error' });
      return;
    }

    if (newReferral.type === 'temporary' && new Date(newReferral.dateFin) <= new Date(newReferral.dateDebut)) {
      setToast({ message: t('toast.endDateInvalid'), type: 'error' });
      return;
    }

    try {
      const data = await referralService.create({
        service: id,
        user: user._id,
        link: newReferral.link,
        code: newReferral.code,
        description: newReferral.description,
        type: newReferral.type,
        dateDebut: newReferral.dateDebut,
        dateFin: newReferral.type === 'temporary' ? newReferral.dateFin : undefined,
        turnstileToken,
        source: newReferral.source || undefined,
      });

      const newRef = data.data || data;
      setReferrals(prev => [...prev, {
        ...newRef,
        user: { _id: user._id, username: user.username },
        upvotes: 0,
        downvotes: 0,
        totalVotes: 0
      }]);
      setSuccess(t('toast.referralAdded'));
      setNewReferral({
        link: '',
        code: '',
        description: {},
        type: 'permanent',
        dateDebut: new Date().toISOString().split('T')[0],
        dateFin: '',
        source: undefined
      });
      setToast({ message: t('toast.referralAdded'), type: 'success' });
      
      if (turnstileRef.current) {
        turnstileRef.current.reset();
        setTurnstileToken('');
      }
    } catch (err) {
      setToast({ message: err.message || t('toast.errorAddingReferral'), type: 'error' });
      
      if (turnstileRef.current) {
        turnstileRef.current.reset();
        setTurnstileToken('');
      }
    }
  }

  function renderVoteButtons(referral) {
    const upvotes = referral.upvotes || 0;
    const downvotes = referral.downvotes || 0;
    const isFormOpen = openVoteForm?.referralId === referral._id;
    const selectedVote = isFormOpen ? openVoteForm.voteType : null;
    
    const handleVoteClick = (voteType) => {
      if (!user) {
        setToast({ message: t('auth.loginRequired'), type: 'error' });
        return;
      }
      
      // Toggle: if clicking the same vote type, close the form
      if (isFormOpen && selectedVote === voteType) {
        setOpenVoteForm(null);
      } else {
        setOpenVoteForm({ referralId: referral._id, voteType });
      }
    };
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <button
          onClick={() => handleVoteClick('good')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-3)',
            borderRadius: 'var(--radius-md)',
            border: selectedVote === 'good' ? '2px solid var(--color-success)' : '1px solid var(--color-border)',
            backgroundColor: selectedVote === 'good' ? 'var(--color-success-50)' : 'transparent',
            color: 'var(--color-success)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: selectedVote === 'good' ? '700' : '600',
            cursor: 'pointer',
            transition: 'all var(--transition-base)',
            transform: selectedVote === 'good' ? 'scale(1.05)' : 'scale(1)'
          }}
          onMouseEnter={e => {
            if (selectedVote !== 'good') {
              e.currentTarget.style.backgroundColor = 'var(--color-success-50)';
              e.currentTarget.style.borderColor = 'var(--color-success)';
            }
          }}
          onMouseLeave={e => {
            if (selectedVote !== 'good') {
              e.currentTarget.style.backgroundColor = selectedVote === 'good' ? 'var(--color-success-50)' : 'transparent';
              e.currentTarget.style.borderColor = selectedVote === 'good' ? 'var(--color-success)' : 'var(--color-border)';
            }
          }}
        >
          <FaThumbsUp size={16} />
          <span>{upvotes}</span>
        </button>
        <button
          onClick={() => handleVoteClick('bad')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-3)',
            borderRadius: 'var(--radius-md)',
            border: selectedVote === 'bad' ? '2px solid var(--color-error)' : '1px solid var(--color-border)',
            backgroundColor: selectedVote === 'bad' ? 'var(--color-error-50)' : 'transparent',
            color: 'var(--color-error)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: selectedVote === 'bad' ? '700' : '600',
            cursor: 'pointer',
            transition: 'all var(--transition-base)',
            transform: selectedVote === 'bad' ? 'scale(1.05)' : 'scale(1)'
          }}
          onMouseEnter={e => {
            if (selectedVote !== 'bad') {
              e.currentTarget.style.backgroundColor = 'var(--color-error-50)';
              e.currentTarget.style.borderColor = 'var(--color-error)';
            }
          }}
          onMouseLeave={e => {
            if (selectedVote !== 'bad') {
              e.currentTarget.style.backgroundColor = selectedVote === 'bad' ? 'var(--color-error-50)' : 'transparent';
              e.currentTarget.style.borderColor = selectedVote === 'bad' ? 'var(--color-error)' : 'var(--color-border)';
            }
          }}
        >
          <FaThumbsDown size={16} />
          <span>{downvotes}</span>
        </button>
      </div>
    );
  }

  function onComment(referral) {
    setSelectedReferral(referral);
    setShowModal(true);
  }

  async function copyToClipboard(text, id) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setToast({ message: t('toast.copiedToClipboard'), type: 'success' });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      setToast({ message: t('toast.copyFailed'), type: 'error' });
    }
  }

  async function deleteReferral(referralId) {
    if (!window.confirm(t('toast.confirmDeleteReferral'))) {
      return;
    }

    try {
      await referralService.delete(referralId);
      setReferrals(prev => prev.filter(ref => ref._id !== referralId));
      setToast({ message: t('toast.referralDeleted'), type: 'success' });
    } catch (err) {
      setToast({ message: err.message || t('toast.errorDeletingReferral'), type: 'error' });
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
        message: updatedReferral.isActive ? t('toast.referralActivated') : t('toast.referralDeactivated'),
        type: 'success'
      });
    } catch (err) {
      setToast({ message: err.message || t('toast.statusUpdateError'), type: 'error' });
    }
  }

  async function renewReferral(referralId) {
    if (!window.confirm(t('toast.confirmRenew'))) {
      return;
    }

    try {
      const response = await api.patch(`/api/referrals/${referralId}/renew`);
      const updatedReferral = response.data.data || response.data;

      setReferrals(prev => prev.map(ref =>
        ref._id === referralId ? { ...ref, ...updatedReferral } : ref
      ));

      setToast({ message: t('toast.renewSuccess'), type: 'success' });
    } catch (err) {
      setToast({ message: err.message || t('toast.renewError'), type: 'error' });
    }
  }

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{t('service.serviceNotFound')}</div>
      </div>
    );
  }

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
        <button className="btn-ghost" onClick={() => globalThis.history.length > 1 ? navigate(-1) : navigate('/')}>
          <FaArrowLeft /> {t('common.back')}
        </button>
      </div>

      <div className={styles.container}>
        {/* Left Sidebar - Service Info */}
        <div className={styles.sidebar}>
          <div className={styles.serviceCard}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
              {service.logo ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}${service.logo}`}
                  alt={service.name}
                  className="service-logo"
                  style={{ width: '100%', height: 'auto', maxWidth: '120px' }}
                />
              ) : (
                <div style={{
                  width: '120px',
                  height: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg-muted)',
                  color: 'var(--color-text-tertiary)'
                }}>
                  <FaBox size={48} />
                </div>
              )}
            </div>

            <h2 className="service-name" style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
              {typeof service.name === 'object' ? service.name[i18n.language] || service.name.fr : service.name}
            </h2>

            {service.website && (
              <a
                href={service.website}
                target="_blank"
                rel="noreferrer"
                className={styles.referralLink}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-2)',
                  fontSize: 'var(--font-size-sm)',
                  marginBottom: 'var(--space-4)'
                }}
              >
                <FaGlobe /> {t('navigation.visitWebsite')}
              </a>
            )}

            {service.description && (
              <p style={{
                color: 'var(--color-text-secondary)',
                lineHeight: '1.6',
                fontSize: 'var(--font-size-sm)',
                marginBottom: 'var(--space-4)',
                paddingBottom: 'var(--space-4)',
                borderBottom: '1px solid var(--color-border-light)'
              }}>
                {getDescriptionInLanguage(service.description, i18n.language)}
              </p>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-3)'
            }}>
              <div className="stat-card">
                <div className="stat-value" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}>
                  <FaBox size={20} />
                  {referrals.length}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}>
                  <FaCrown size={20} />
                  {promotions.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column - Referrals List */}
        <div className={styles.mainContent}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-4)',
            flexWrap: 'wrap',
            gap: 'var(--space-3)'
          }}>
            <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>
              {t('service.availableReferrals')}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '500'
              }}>
                <FaSort />
                {t('sort.sortBy')}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg-primary)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="pertinence">{t('sort.pertinence')}</option>
                <option value="votes">{t('sort.votes')}</option>
                <option value="positive">{t('sort.positive')}</option>
                <option value="recent">{t('sort.recent')}</option>
                <option value="oldest">{t('sort.oldest')}</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Promoted Referrals */}
            {promotions.length > 0 && (
              <div>
                <h4 style={{
                  color: 'var(--color-warning)',
                  marginBottom: 'var(--space-3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}>
                  <FaCrown /> {t('service.featuredReferrals')}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {promotions.map(promo => (
                    <PreniumReferralCard 
                      key={promo._id} 
                      ref={promo.referral} 
                      promo={promo} 
                      onComment={onComment}
                      user={user}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Referrals */}
            {referrals.filter(ref => !promotions.some(promo => promo.referral._id === ref._id)).map(ref => (
              <div key={ref._id} className={styles.referralCard}>
                {/* User Header */}
                <div className={styles.referralHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    {ref.user?.profilePhoto ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${ref.user.profilePhoto}`}
                        alt={ref.user.username}
                        className="avatar"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div 
                        className="avatar" 
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-primary)',
                          color: 'white !important',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {ref.source ? <FaGlobe size={18} color="white" /> : (ref.user?.username?.charAt(0).toUpperCase() || "?")}
                      </div>
                    )}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                        {ref.source ? (
                          <a 
                            href={ref.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ 
                              fontWeight: '600', 
                              color: 'var(--color-primary)',
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--space-1)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                          >
                            De {new URL(ref.source).hostname.replace('www.', '')}
                          </a>
                        ) : (
                          <span style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>
                            {ref.user?.username
                              ? ref.user.username.charAt(0).toUpperCase() + ref.user.username.slice(1).toLowerCase()
                              : ref.user}
                          </span>
                        )}
                        {ref.user?._id && userBadges[ref.user._id] && (
                          <BadgeDisplay badges={userBadges[ref.user._id]} size="small" />
                        )}
                        {ref.source && (
                          <BadgeDisplay badges={[{ type: 'external' }]} size="small" />
                        )}
                      </div>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                        <TimeAgo isoDateString={ref.createdAt} />
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    {user && (ref.user?._id === user._id || ref.user === user._id) && (
                      <>
                        <button
                          onClick={() => toggleReferralActive(ref._id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 'var(--space-2)',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: ref.isActive ? 'var(--color-success)' : 'var(--color-text-tertiary)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-base)'
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = ref.isActive ? 'var(--color-error)' : 'var(--color-success)'}
                          onMouseLeave={e => e.currentTarget.style.color = ref.isActive ? 'var(--color-success)' : 'var(--color-text-tertiary)'}
                          title={ref.isActive ? t('referralCard.deactivate') : t('referralCard.activate')}
                        >
                          <FaPowerOff size={16} />
                        </button>
                        {ref.type === 'permanent' && (
                          <button
                            onClick={() => renewReferral(ref._id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: 'var(--space-2)',
                              borderRadius: 'var(--radius-md)',
                              border: 'none',
                              backgroundColor: 'transparent',
                              color: 'var(--color-text-tertiary)',
                              cursor: 'pointer',
                              transition: 'all var(--transition-base)'
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-tertiary)'}
                            title={t('referralCard.renewTitle')}
                          >
                            <FaSyncAlt size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteReferral(ref._id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 'var(--space-2)',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: 'var(--color-text-tertiary)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-base)'
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-error)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-tertiary)'}
                          title={t('service.deleteReferral')}
                        >
                          <FaTrash size={16} />
                        </button>
                      </>
                    )}
                    <ReportReferral referralId={ref._id} iconOnly />
                  </div>
                </div>

                {/* Link or Code */}
                {(ref.link || ref.code) && (
                  <div style={{
                    marginBottom: 'var(--space-3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'var(--color-bg-muted)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3)',
                    gap: 'var(--space-3)'
                  }}>
                    {ref.link ? (
                      <a
                        href={ref.link}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.referralLink}
                        style={{ flex: 1, wordBreak: 'break-all' }}
                      >
                        {ref.link}
                      </a>
                    ) : (
                      <code className={styles.referralCode} style={{ flex: 1 }}>
                        {ref.code}
                      </code>
                    )}
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      {ref.code && (
                        <button
                          className="btn-primary btn-sm"
                          onClick={() => copyToClipboard(ref.code, ref._id)}
                          title={t('service.copyCode')}
                        >
                          {copiedCode === ref._id ? <FaCheck /> : <FaCopy />}
                        </button>
                      )}
                      {ref.link && (
                        <button
                          className="btn-primary btn-sm"
                          onClick={() => window.open(ref.link, "_blank")}
                        >
                          <FaExternalLinkAlt />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Type Info - Show expiration badges */}
                {ref.dateFin && (() => {
                  const daysLeft = Math.ceil((new Date(ref.dateFin) - new Date()) / (1000 * 60 * 60 * 24));

                  if (ref.type === 'temporary') {
                    return (
                      <div style={{
                        marginBottom: 'var(--space-3)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        padding: 'var(--space-2) var(--space-3)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-warning-50)',
                        color: 'var(--color-warning)',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: '600'
                      }}>
                        <FaClock size={14} />
                        <span>{t('referralCard.expiresInDays', { count: daysLeft })}</span>
                      </div>
                    );
                  }

                  if (ref.type === 'permanent' && daysLeft > 0 && daysLeft <= 3 && user && (ref.user?._id === user._id || ref.user === user._id)) {
                    return (
                      <div style={{
                        marginBottom: 'var(--space-3)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        padding: 'var(--space-2) var(--space-3)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-error-50)',
                        color: 'var(--color-error)',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: '600',
                        border: '1px solid var(--color-error)',
                        animation: 'pulse 2s ease-in-out infinite'
                      }}>
                        <FaBell size={14} />
                        <span>{t('referralCard.expiringSoon', { count: daysLeft })}</span>
                      </div>
                    );
                  }

                  return null;
                })()}

                {/* Description */}
                {ref.description && (
                  <p style={{
                    marginBottom: 'var(--space-3)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.6',
                    fontSize: 'var(--font-size-sm)'
                  }}>
                    {getDescriptionInLanguage(ref.description, i18n.language)}
                  </p>
                )}

                {/* Votes and Comments */}
                <div className={styles.voteSection} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    {renderVoteButtons(ref)}
                  </div>
                  <button
                    onClick={() => onComment(ref)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      padding: 'var(--space-2) var(--space-3)',
                      border: 'none',
                      background: 'none',
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      cursor: 'pointer',
                      transition: 'color var(--transition-base)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                  >
                    <FaComment size={14} />
                    {t('service.comments')}
                  </button>
                </div>

                {/* Vote Form - Only show if this referral's form is open */}
                {openVoteForm?.referralId === ref._id && (
                  <div style={{
                    marginTop: 'var(--space-3)',
                    width: '100%'
                  }}>
                    <ReferralVoteForm 
                      referralId={ref._id} 
                      onVoteSuccess={() => {
                        refreshVoteCounts();
                        setOpenVoteForm(null);
                      }}
                      initialVoteType={openVoteForm.voteType}
                      onClose={() => setOpenVoteForm(null)}
                    />
                  </div>
                )}
              </div>
            ))}

            {/* Loading More Indicator */}
            {loadingMore && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                padding: 'var(--space-4)',
                color: 'var(--color-text-secondary)'
              }}>
                <FaSpinner className="fa-spin" size={24} />
              </div>
            )}

            {/* No More Results */}
            {!hasMore && referrals.length > 0 && (
              <div style={{
                textAlign: 'center',
                padding: 'var(--space-4)',
                color: 'var(--color-text-tertiary)',
                fontSize: 'var(--font-size-sm)'
              }}>
                {t('service.allReferralsLoaded')}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Add Referral Form */}
        {user && (
          <div className={styles.rightSidebar}>
            {hasActiveReferralForUser ? (
              <div className={styles.formCard}>
                <div style={{
                  textAlign: 'center',
                  padding: 'var(--space-6)',
                  color: 'var(--color-text-secondary)'
                }}>
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: 'var(--space-3)',
                    opacity: 0.5
                  }}>
                    <FaPlus />
                  </div>
                  <h3 style={{ marginBottom: 'var(--space-2)', color: 'var(--color-text-primary)' }}>
                    {t('rightSidebar.activeReferral.title')}
                  </h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', lineHeight: '1.6' }}>
                    {t('rightSidebar.activeReferral.message')}
                  </p>
                </div>
              </div>
            ) : (
              <div className={styles.formCard}>
                <h3 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-size-lg)' }}>
                  <FaPlus /> {t('rightSidebar.addReferral.title')}
                </h3>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">
                    <FaLink /> {t('service.referralLink')}
                  </label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://..."
                    value={newReferral.link || ''}
                    onChange={(e) => setNewReferral({ ...newReferral, link: e.target.value, code: undefined })}
                    disabled={!!newReferral.code}
                  />
                </div>

                <div style={{
                  textAlign: 'center',
                  color: 'var(--color-text-tertiary)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: '500'
                }}>
                  {t('service.or')}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FaCode /> {t('service.referralCode')} <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-xs)' }}>({t('toast.codeTooLong', { maxLength: 20 })})</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={t('service.enterCode')}
                    value={newReferral.code || ''}
                    onChange={(e) => setNewReferral({ ...newReferral, code: e.target.value, link: undefined })}
                    disabled={!!newReferral.link}
                    maxLength={20}
                  />
                </div>

                {user.role === 'promoter' && (
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <FaLink /> Source <span style={{ color: 'var(--color-error)' }}>*</span>
                    </label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://example.com"
                      value={newReferral.source || ''}
                      onChange={(e) => setNewReferral({ ...newReferral, source: e.target.value })}
                      required
                      style={{
                        borderColor: newReferral.source ? 'var(--color-success)' : 'var(--color-border)'
                      }}
                    />
                    <small style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-1)' }}>
                      Indiquez la source d'où provient ce référencement
                    </small>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">{t('dashboard.description')}</label>
                  <MultilingualDescriptionInput
                    descriptions={newReferral.description}
                    onDescriptionChange={(descriptions) => setNewReferral({ ...newReferral, description: descriptions })}
                    placeholder={t('service.describeYourReferral')}
                    maxLength={100}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FaClock /> {t('rightSidebar.addReferral.type.label')}
                  </label>
                  <select
                    className="form-input"
                    value={newReferral.type}
                    onChange={(e) => setNewReferral({ ...newReferral, type: e.target.value })}
                  >
                    <option value="permanent">{t('rightSidebar.addReferral.type.permanent')}</option>
                    <option value="temporary">{t('rightSidebar.addReferral.type.temporary')}</option>
                  </select>
                </div>

                {newReferral.type === 'temporary' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">
                        <FaCalendarAlt /> {t('rightSidebar.addReferral.startDate.label')}
                      </label>
                      <input
                        type="date"
                        className="form-input"
                        value={newReferral.dateDebut}
                        onChange={(e) => setNewReferral({ ...newReferral, dateDebut: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <FaCalendarAlt /> {t('rightSidebar.addReferral.endDate.label')}
                      </label>
                      <input
                        type="date"
                        className="form-input"
                        value={newReferral.dateFin}
                        onChange={(e) => setNewReferral({ ...newReferral, dateFin: e.target.value })}
                        min={newReferral.dateDebut}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="form-group" style={{ display: 'flex', justifyContent: 'center' }}>
                  <Turnstile
                    ref={turnstileRef}
                    sitekey={TURNSTILE_SITE_KEY}
                    onVerify={(token) => setTurnstileToken(token)}
                    onError={() => setToast({ message: t('errors.captchaError'), type: 'error' })}
                    theme="light"
                  />
                </div>

                <button type="submit" className="btn-primary">
                  <FaPlus /> {t('service.addReferral')}
                </button>
              </form>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && selectedReferral && (
        <CommentModal
          referral={selectedReferral}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
