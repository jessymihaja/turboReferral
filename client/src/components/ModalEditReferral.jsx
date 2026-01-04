import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaEdit, FaSave } from 'react-icons/fa';
import MultilingualDescriptionInput from './MultilingualDescriptionInput';
import api from '../services/api';

const ModalEditReferral = ({ referral, isOpen, onClose, onUpdated }) => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    link: '',
    code: '',
    description: {}
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (referral && isOpen) {
      let description = {};
      if (typeof referral.description === 'string') {
        description = { [i18n.language]: referral.description };
      } else if (typeof referral.description === 'object' && referral.description) {
        description = { ...referral.description };
      }
      
      setFormData({
        link: referral.link || '',
        code: referral.code || '',
        description
      });
      setError('');
    }
  }, [referral, isOpen, i18n.language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.put(`/api/referrals/${referral._id}/admin`, {
        link: formData.link || null,
        code: formData.code || null,
        description: formData.description
      });

      onUpdated(response.data);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || t('errors.errorUpdating'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title flex items-center gap-2">
            <FaEdit className="text-blue-600" />
            {t('modal.editReferral', 'Modifier le parrainage')}
          </h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body space-y-6">
          {error && (
            <div className="alert alert-error">
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">
                {t('service.referralLink')}
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value, code: e.target.value ? '' : formData.code })}
                className="form-input"
                placeholder="https://exemple.com/ref/..."
                disabled={!!formData.code}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {t('service.referralCode')}
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value, link: e.target.value ? '' : formData.link })}
                className="form-input"
                placeholder={t('service.enterCode')}
                disabled={!!formData.link}
                maxLength={20}
              />
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 py-2">
            {t('service.or')}
          </div>

          <div className="form-group">
            <label className="form-label">
              {t('dashboard.description')}
            </label>
            <MultilingualDescriptionInput
              descriptions={formData.description}
              onDescriptionChange={(descriptions) => setFormData({ ...formData, description: descriptions })}
              placeholder={t('service.describeYourReferral')}
              maxLength={500}
            />
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
              disabled={loading || (!formData.link && !formData.code)}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('modal.saving')}
                </>
              ) : (
                <>
                  <FaSave />
                  {t('modal.saveChanges')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditReferral;