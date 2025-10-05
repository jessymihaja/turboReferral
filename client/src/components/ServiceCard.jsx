import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBox, FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function ServiceCard({ service }) {
  const { t } = useTranslation();
  return (
    <Link
      to={`/services/${service._id}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <motion.div
        className="service-card"
        whileHover={{
          y: -6,
          boxShadow: '0 12px 24px rgba(214, 156, 90, 0.2), var(--shadow-xl)'
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(249, 246, 243, 1) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle gradient overlay on hover */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(214, 156, 90, 0.05) 0%, rgba(212, 165, 116, 0.05) 100%)',
            opacity: 0,
            pointerEvents: 'none'
          }}
          whileHover={{ opacity: 1 }}
        />

        <div style={{
          width: '100%',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-4)',
          background: 'linear-gradient(135deg, rgba(214, 156, 90, 0.08) 0%, rgba(212, 165, 116, 0.08) 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4)',
          position: 'relative',
          zIndex: 1
        }}>
          {service.logo ? (
            <motion.img
              src={`${import.meta.env.VITE_API_URL}${service.logo}`}
              alt={service.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
          ) : (
            <FaBox size={48} style={{ color: 'var(--color-neutral-400)' }} />
          )}
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          position: 'relative',
          zIndex: 1
        }}>
          <h3 style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
            margin: 0
          }}>
            {service.name}
          </h3>

          {service.description && (
            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-tertiary)',
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 'var(--line-height-snug)'
            }}>
              {service.description}
            </p>
          )}
        </div>

        <motion.div
          style={{
            marginTop: 'var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #D4A574 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            position: 'relative',
            zIndex: 1
          }}
          whileHover={{ x: 3 }}
          transition={{ duration: 0.2 }}
        >
          <span>{t('navigation.viewDetails')}</span>
          <motion.div
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
          >
            <FaArrowRight size={12} style={{ color: 'var(--color-primary)' }} />
          </motion.div>
        </motion.div>
      </motion.div>
    </Link>
  );
}
