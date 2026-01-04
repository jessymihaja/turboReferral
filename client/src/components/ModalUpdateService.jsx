import { useState, useEffect } from "react";
import { FaEdit, FaTimes, FaImage, FaCheck } from 'react-icons/fa';
import CustomToast from "./CustomToast";
import MultilingualInput from "./MultilingualInput";
import { serviceService, categoryService } from '../services';
import { useTranslation } from 'react-i18next';
import { compressServiceLogo } from '../utils/imageCompressor';

export default function ModalUpdateService({ service, onClose, onUpdated }) {
  const { t } = useTranslation();
  
  // Initialize multilingual data from service
  const initializeNames = () => {
    if (typeof service.name === 'string') {
      return { fr: service.name };
    }
    return service.name || {};
  };

  const initializeDescriptions = () => {
    if (typeof service.description === 'string') {
      return { fr: service.description || "" };
    }
    return service.description || {};
  };

  const [names, setNames] = useState(initializeNames());
  const [descriptions, setDescriptions] = useState(initializeDescriptions());
  const [website, setWebsite] = useState(service.website || "");
  const [category, setCategory] = useState(service.category?._id || "");
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

  async function handleUpdate(e) {
    e.preventDefault();

    if (!service || !service._id) {
      setToast({ message: t('modal.noServiceSelected'), type: 'error' });
      return;
    }

    if (!names.fr || !names.fr.trim()) {
      setToast({ message: t('modal.serviceNameRequired'), type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", JSON.stringify(names));
      formData.append("description", JSON.stringify(descriptions));
      formData.append("website", website.trim());
      formData.append("category", category);
      if (logo) formData.append("logo", logo, logo.name || 'logo.webp');

      const data = await serviceService.update(service._id, formData);
      const updated = data.data || data;
      onUpdated(updated);
      setToast({ message: t('modal.serviceUpdated'), type: 'success' });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setToast({ message: err.message || t('modal.errorUpdating'), type: 'error' });
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
            <FaEdit style={{ marginRight: 'var(--space-2)' }} />
            {t('modal.updateService')}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label form-label-required">{t('modal.serviceNameRequired')}</label>
              <MultilingualInput
                values={names}
                onValuesChange={setNames}
                placeholder={t('modal.enterServiceName')}
                type="input"
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('dashboard.description')}</label>
              <MultilingualInput
                values={descriptions}
                onValuesChange={setDescriptions}
                placeholder={t('modal.enterDescription')}
                type="textarea"
                minRows={4}
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
              <label className="form-label form-label-required">{t('modal.categoryRequired')}</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">{t('modal.selectCategory')}</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
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
              
              <div style={{
                display: 'flex',
                gap: 'var(--space-4)',
                marginTop: 'var(--space-4)',
                flexWrap: 'wrap'
              }}>
                {(logoPreview || service.logo) && (
                  <>
                    {service.logo && !logoPreview && (
                      <div>
                        <p style={{
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--color-text-tertiary)',
                          marginBottom: 'var(--space-2)'
                        }}>
                          {t('modal.currentLogo')}
                        </p>
                        <img
                          src={`${import.meta.env.VITE_API_URL}${service.logo}`}
                          alt={t('modal.currentLogo')}
                          style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'contain',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--color-border)',
                            padding: 'var(--space-2)',
                            backgroundColor: 'var(--color-bg-muted)'
                          }}
                        />
                      </div>
                    )}
                    {logoPreview && (
                      <div>
                        <p style={{
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--color-text-tertiary)',
                          marginBottom: 'var(--space-2)'
                        }}>
                          {t('modal.newLogoPreview')}
                        </p>
                        <img
                          src={logoPreview}
                          alt={t('modal.newLogoPreview')}
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
                  </>
                )}
              </div>
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
              <FaCheck /> {loading ? t('modal.saving') : t('modal.saveChanges')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
