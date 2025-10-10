import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaInbox, FaFilter, FaArrowUp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import ServiceCard from '../components/ServiceCard';
import ReferralInfo from '../components/ReferralInfo';
import { serviceService, categoryService } from '../services';

export default function Home() {
  const { t } = useTranslation();
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
    const matchQuery = query.trim()
      ? service.name.toLowerCase().includes(query.toLowerCase()) ||
        service.description?.toLowerCase().includes(query.toLowerCase())
      : true;

    const matchCategory = selectedCategory
      ? service.category?._id === selectedCategory
      : true;

    return matchQuery && matchCategory && service.isValidated;
  });

  return (
    <div className="page-container">
      {/* Hero Header */}
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
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
      </motion.div>

      {/* Search Bar */}
      <motion.div
        className="search-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        style={{
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
            className="search-input"
            style={{ paddingLeft: 'var(--space-10)' }}
          />
        </div>
      </motion.div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <motion.div
          style={{ marginBottom: 'var(--space-8)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
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
            <motion.button
              onClick={() => setSelectedCategory('')}
              className={`category-btn ${!selectedCategory ? 'active' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('common.all')} ({services.filter(s => s.isValidated).length})
            </motion.button>
            {categories.map((cat, idx) => {
              const count = services.filter(s => s.category?._id === cat._id && s.isValidated).length;
              return (
                <motion.button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`category-btn ${selectedCategory === cat._id ? 'active' : ''}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + idx * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat.name} ({count})
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Services Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
          <div className="spinner" />
        </div>
      ) : (
        <>
          <motion.div
            className="card-grid"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
              hidden: {},
            }}
          >
            <AnimatePresence mode="popLayout">
              {filteredServices.map(service => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <ServiceCard service={service} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredServices.length === 0 && !loading && (
            <div className="empty-state">
              <div className="empty-state-icon">
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
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
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
            whileHover={{ scale: 1.1, boxShadow: '0 6px 20px rgba(214, 156, 90, 0.5)' }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <FaArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
