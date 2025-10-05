import { useState } from "react";
import { FaTimes, FaCrown, FaCalendar, FaCheck } from "react-icons/fa";
import { useAuthFetch } from "../utils/authFetch";
import CustomToast from "./CustomToast";
import { useTranslation } from 'react-i18next';

export default function PromoteReferralModal({ referral, isOpen, onClose, onCreated }) {
  const { t } = useTranslation();
  const authFetch = useAuthFetch();
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    if (new Date(dateFin) <= new Date(dateDebut)) {
      setToast({ message: t('modal.endDateMustBeAfter'), type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/promotions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referralId: referral._id,
          dateDebut,
          dateFin,
        }),
      });

      if (!res.ok) throw new Error(t('modal.errorCreating'));
      const data = await res.json();

      if (onCreated) onCreated(data);
      setToast({ message: t('modal.promotionCreated'), type: 'success' });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setToast({ message: err.message || t('modal.errorCreating'), type: 'error' });
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
            <FaCrown style={{ marginRight: 'var(--space-2)', color: 'var(--color-warning)' }} />
            {t('modal.promoteReferral')}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="alert alert-info" style={{ marginBottom: 'var(--space-4)' }}>
              <strong>{referral.service?.name || t('common.services')}</strong>
              <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-1)' }}>
                {referral.description || referral._id}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">
                <FaCalendar /> {t('modal.startDate')}
              </label>
              <input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">
                <FaCalendar /> {t('modal.endDate')}
              </label>
              <input
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                required
                min={dateDebut || new Date().toISOString().split('T')[0]}
                className="form-input"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              <FaCrown /> {loading ? t('modal.promoting') : t('modal.createPromotion')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
