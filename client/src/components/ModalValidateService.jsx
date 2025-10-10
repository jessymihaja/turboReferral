import { useState } from "react";
import { FaCheck, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import CustomToast from "./CustomToast";
import api from '../services/api';
import { useTranslation } from 'react-i18next';

export default function ModalValidateService({ service, onClose, onValidated }) {
  const { t } = useTranslation();
  const [validationReason, setValidationReason] = useState("");
  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  async function handleValidate(isValidated) {
    if (!service || !service._id) {
      setToast({ message: t('modal.noServiceSelected'), type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const response = await api.patch(`/api/services/${service._id}/validate`, {
        isValidated,
        validationReason: validationReason.trim()
      });

      const updated = response.data || response;
      onValidated(updated);

      const message = isValidated
        ? t('modal.serviceValidated')
        : t('modal.serviceRejected');

      setToast({ message, type: 'success' });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setToast({ message: err.message || t('modal.errorValidating'), type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      {toast.message && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}

      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <FaCheck style={{ marginRight: 'var(--space-2)' }} />
            {t('modal.validateService')}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-2)' }}>
              {service.name}
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              {service.description || '—'}
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">{t('modal.validationReason')}</label>
            <textarea
              className="form-textarea"
              value={validationReason}
              onChange={(e) => setValidationReason(e.target.value)}
              rows={4}
              placeholder={t('modal.enterValidationReasonOptional')}
            />
            <p style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-tertiary)',
              marginTop: 'var(--space-2)'
            }}>
              {t('modal.validationReasonHint')}
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={() => handleValidate(false)}
            className="btn-danger"
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}
          >
            <FaTimes /> {loading ? t('modal.processing') : t('modal.reject')}
          </button>
          <button
            type="button"
            onClick={() => handleValidate(true)}
            className="btn-primary"
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}
          >
            <FaCheck /> {loading ? t('modal.processing') : t('modal.approve')}
          </button>
        </div>
      </div>
    </div>
  );
}
