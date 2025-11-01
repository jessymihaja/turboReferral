import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaEdit, FaSave } from 'react-icons/fa';
import MultilingualDescriptionInput from './MultilingualDescriptionInput';
import api from '../services/api';

const ModalEditReferral = ({ referral, isOpen, onClose, onUpdated }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    link: '',
    code: '',
    description: { fr: '', en: '' }
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (referral && isOpen) {
      setFormData({
        link: referral.link || '',
        code: referral.code || '',
        description: typeof referral.description === 'string' 
          ? { fr: referral.description, en: '' }
          : { fr: referral.description?.fr || '', en: referral.description?.en || '' }
      });
      setError('');
    }
  }, [referral, isOpen]);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaEdit className="text-blue-600" />
            {t('modal.editReferral', 'Modifier le parrainage')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('service.referralLink')}
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value, code: e.target.value ? '' : formData.code })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://exemple.com/ref/..."
                disabled={!!formData.code}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('service.referralCode')}
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value, link: e.target.value ? '' : formData.link })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('service.enterCode')}
                disabled={!!formData.link}
                maxLength={20}
              />
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 py-2">
            {t('service.or')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('dashboard.description')}
            </label>
            <MultilingualDescriptionInput
              descriptions={formData.description}
              onDescriptionChange={(descriptions) => setFormData({ ...formData, description: descriptions })}
              placeholder={t('service.describeYourReferral')}
              maxLength={500}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || (!formData.link && !formData.code)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaSave />
              )}
              {loading ? t('modal.saving') : t('modal.saveChanges')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditReferral;