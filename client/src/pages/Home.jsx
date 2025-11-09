import { useEffect, useState } from 'react';
import { FaSearch, FaInbox, FaFilter, FaArrowUp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import ServiceCard from '../components/ServiceCard';
import ReferralInfo from '../components/ReferralInfo';
import { serviceService, categoryService } from '../services';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesData, categoriesData] = await Promise.all([
          serviceService.getAll(),
          categoryService.getAll()
        ]);

        setServices(servicesData.data || servicesData);
        setCategories(categoriesData.data || categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    setTimeout(() => setIsVisible(true), 100);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredServices = services.filter(service => {
    const serviceName = typeof service.name === 'object' 
      ? (service.name[i18n.language] || service.name.fr || '')
      : (service.name || '');
    
    const serviceDesc = typeof service.description === 'object'
      ? (service.description[i18n.language] || service.description.fr || '')
      : (service.description || '');

    const matchQuery = query.trim()
      ? serviceName.toLowerCase().includes(query.toLowerCase()) ||
        serviceDesc.toLowerCase().includes(query.toLowerCase())
      : true;

    const matchCategory = selectedCategory
      ? service.category?._id === selectedCategory
      : true;

    return matchQuery && matchCategory && service.isValidated;
  });

  return (
    <div className="page-container">
      {/* Hero Header */}
      <div
        className="page-header"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'all 0.6s ease-out'
        }}
      >
        <h1 className="page-title" style={{
          background: 'linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-primary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {t('home.discoverTrusted')} <span style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #D4A574 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>{t('home.trustedReferrals')}</span>
        </h1>
        <p className="page-subtitle">
          {t('home.findBestServices')}
        </p>
      </div>

      {/* Search Bar */}
      <div
        className="search-container"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          transition: 'all 0.5s ease-out 0.2s',
          background: 'linear-gradient(135deg, rgba(214, 156, 90, 0.05) 0%, rgba(212, 165, 116, 0.05) 100%)',
          padding: 'var(--space-1)',
          borderRadius: 'var(--radius-full)'
        }}
      >
        <div style={{ position: 'relative' }}>
          <FaSearch style={{
            position: 'absolute',
            left: 'var(--space-4)',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-tertiary)',
            pointerEvents: 'none'
          }} />
          <input
            type="search"
            placeholder={t('home.searchServices')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input input-field"
            style={{ paddingLeft: 'var(--space-10)' }}
          />
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div
          style={{
            marginBottom: 'var(--space-8)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.5s ease-out 0.3s'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-4)',
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)'
          }}>
            <FaFilter size={12} />
            <span>{t('home.filterByCategory')}</span>
          </div>

          <div className="category-filter">
            <button
              onClick={() => setSelectedCategory('')}
              className={`category-btn ${!selectedCategory ? 'active' : ''}`}
              style={
                !selectedCategory
                  ? {
                      background: 'linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-neutral-100) 100%)',
                      border: '1px solid var(--color-primary-300)',
                      color: 'var(--color-primary-700)'
                    }
                  : {}
              }
            >
              {t('common.all')} ({services.filter(s => s.isValidated).length})
            </button>
            {categories.map((cat) => {
              const count = services.filter(s => s.category?._id === cat._id && s.isValidated).length;
              return (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`category-btn ${selectedCategory === cat._id ? 'active' : ''}`}
                  style={
                    selectedCategory === cat._id
                      ? {
                          background: 'linear-gradient(135deg, var(--color-info-50) 0%, var(--color-neutral-100) 100%)',
                          border: '1px solid var(--color-info-300)',
                          color: 'var(--color-info-700)'
                        }
                      : {}
                  }
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Services Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
          <div className="spinner" />
        </div>
      ) : (
        <>
          <div className="card-grid">
            {filteredServices.map((service, idx) => (
              <div
                key={service._id}
                style={{
                  opacity: 0,
                  animation: 'fadeInUp 0.4s ease-out forwards',
                  animationDelay: `${idx * 0.05}s`
                }}
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredServices.length === 0 && !loading && (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ color: 'var(--color-info-600)' }}>
                <FaInbox />
              </div>
              <p style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-2)'
              }}>
                {query.trim() ? t('home.noServicesFound') : t('home.noServicesAvailable')}
              </p>
              <p style={{
                color: 'var(--color-text-tertiary)',
                fontSize: 'var(--font-size-sm)'
              }}>
                {query.trim()
                  ? t('home.tryAdjusting')
                  : t('home.checkBackLater')
                }
              </p>
            </div>
          )}
        </>
      )}

      <ReferralInfo />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: 'var(--space-8)',
            right: 'var(--space-8)',
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #D4A574 100%)',
            color: 'var(--color-text-inverse)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(214, 156, 90, 0.4)',
            zIndex: 1000,
            transition: 'all 0.3s ease'
          }}
          aria-label="Scroll to top"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
