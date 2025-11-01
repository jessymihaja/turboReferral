import { useState, useEffect } from "react";
import { FaPlus, FaTimes, FaImage, FaCheck } from 'react-icons/fa';
import CustomToast from "./CustomToast";
import MultilingualInput from "./MultilingualInput";
import { serviceService, categoryService } from '../services';
import { useTranslation } from 'react-i18next';
import { compressServiceLogo } from '../utils/imageCompressor';

export default function ModalAddService({ onClose, onAdded }) {
  const { t } = useTranslation();
  const [names, setNames] = useState({});
  const [descriptions, setDescriptions] = useState({});
  const [website, setWebsite] = useState("");
  const [category, setCategory] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (err) {
        console.error("Erreur lors du chargement des catégories:", err);
      }
    }
    fetchCategories();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!names.fr || !names.fr.trim()) {
      setToast({ message: t('modal.serviceNameRequired'), type: 'error' });
      return;
    }

    if (!category) {
      setToast({ message: t('modal.categoryRequired'), type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", JSON.stringify(names));
      formData.append("description", JSON.stringify(descriptions));
      formData.append("website", website.trim());
      formData.append("category", category);

      if (logo) {
        formData.append("logo", logo, logo.name || 'logo.webp');
      }

      const data = await serviceService.create(formData);
      const newService = data.data || data;

      onAdded(newService);
      setToast({ message: t('modal.serviceAdded'), type: 'success' });

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setToast({ message: err.message || t('modal.errorAdding'), type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleLogoChange(e) {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressed = await compressServiceLogo(file);
        setLogo(compressed);
        setLogoPreview(URL.createObjectURL(compressed));
      } catch (error) {
        console.error('Erreur compression:', error);
        setLogo(file);
        setLogoPreview(URL.createObjectURL(file));
      }
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
            <FaPlus style={{ marginRight: 'var(--space-2)' }} />
            {t('modal.addService')}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label form-label-required">{t('dashboard.serviceName')}</label>
              <MultilingualInput
                values={names}
                onValuesChange={setNames}
                placeholder={t('dashboard.enterServiceName')}
                type="input"
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">{t('dashboard.category')}</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">{t('dashboard.selectCategory')}</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t('dashboard.description')}</label>
              <MultilingualInput
                values={descriptions}
                onValuesChange={setDescriptions}
                placeholder={t('dashboard.briefDescription')}
                type="textarea"
                minRows={3}
                maxLength={500}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('dashboard.website')}</label>
              <input
                type="url"
                className="form-input"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder={t('dashboard.enterWebsite')}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaImage /> {t('dashboard.logo')}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="form-file-input"
                id="logo-upload"
              />
              <label htmlFor="logo-upload" className="form-file-label">
                <FaImage /> {t('modal.chooseLogo')}
              </label>

              {logoPreview && (
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <p style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-tertiary)',
                    marginBottom: 'var(--space-2)'
                  }}>
                    {t('modal.logoPreview')}
                  </p>
                  <img
                    src={logoPreview}
                    alt={t('modal.logoPreview')}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'contain',
                      borderRadius: 'var(--radius-lg)',
                      border: '2px solid var(--color-primary)',
                      padding: 'var(--space-2)',
                      backgroundColor: 'var(--color-bg-muted)'
                    }}
                  />
                </div>
              )}
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
              <FaCheck /> {loading ? t('modal.adding') : t('modal.addService')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
