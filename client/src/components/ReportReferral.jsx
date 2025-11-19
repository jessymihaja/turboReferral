import { useState } from 'react';
import CustomToast from '../components/CustomToast';
import { BsExclamationTriangleFill } from 'react-icons/bs';
import { FaFlag } from 'react-icons/fa';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

const ReportReferral = ({ referralId, iconOnly = false }) => {
  const { t } = useTranslation();
  const [toast, setToast] = useState({ message: '', type: '' });
  const [showReasons, setShowReasons] = useState(false);
  const { token} = useContext(UserContext);

  const reasons = [
    'broken',
    'misleading',
    'abusive',
    'other'
  ];

  const handleReport = async (reason) => {
    try {
      await api.post('/api/reports', { referralId, reason });
      setToast({ message: t('report.reportSent'), type: 'success' });
    } catch (error) {
      let errorMessage = error.message;

      if (errorMessage.includes("Cannot read properties of null")) {
        errorMessage = t('report.pleaseSignIn');
      } else if (errorMessage.includes("alreadyReported") || errorMessage.includes("already reported")) {
        errorMessage = t('report.alreadyReported');
      }

      setToast({ message: errorMessage || t('report.errorReporting'), type: 'error' });
    } finally {
      setShowReasons(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowReasons(!showReasons)}
        title={t('report.reportThisLink')}
        style={iconOnly ? {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-2)',
          borderRadius: 'var(--radius-md)',
          border: 'none',
          backgroundColor: 'transparent',
          color: 'var(--color-text-tertiary)',
          fontSize: 'var(--font-size-sm)',
          cursor: 'pointer',
          transition: 'all var(--transition-base)'
        } : {
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-2)',
          padding: 'var(--space-2) var(--space-3)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-error-200)',
          backgroundColor: 'var(--color-bg-elevated)',
          color: 'var(--color-error-600)',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-medium)',
          cursor: 'pointer',
          transition: 'all var(--transition-base)'
        }}
        onMouseEnter={e => {
          if (iconOnly) {
            e.currentTarget.style.color = 'var(--color-error-600)';
          } else {
            e.currentTarget.style.borderColor = 'var(--color-error-500)';
            e.currentTarget.style.backgroundColor = 'var(--color-error-50)';
          }
        }}
        onMouseLeave={e => {
          if (iconOnly) {
            e.currentTarget.style.color = 'var(--color-text-tertiary)';
          } else {
            e.currentTarget.style.borderColor = 'var(--color-error-200)';
            e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
          }
        }}
      >
        {iconOnly ? (
          <FaFlag size={16} />
        ) : (
          <>
            <BsExclamationTriangleFill size={14} />
            <span>{t('report.reportThisLink')}</span>
          </>
        )}
      </button>

      {showReasons && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + var(--space-2))',
            right: '0',
            backgroundColor: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            zIndex: 1000,
            minWidth: '220px',
            padding: 'var(--space-2) 0'
          }}
        >
          {reasons.map((reason, index) => (
            <div
              key={index}
              onClick={() => handleReport(reason)}
              style={{
                padding: 'var(--space-3) var(--space-4)',
                cursor: 'pointer',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-sm)',
                transition: 'all var(--transition-base)',
                borderBottom: index < reasons.length - 1 ? '1px solid var(--color-border-light)' : 'none'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--color-error-50)';
                e.currentTarget.style.color = 'var(--color-error-600)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }}
            >
              {t(`reports.reportReasons.${reason}`)}
            </div>
          ))}
        </div>
      )}

      {toast.message && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default ReportReferral;
