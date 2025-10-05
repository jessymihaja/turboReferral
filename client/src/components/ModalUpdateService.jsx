import { useState } from "react";
import { FaEdit, FaTimes, FaImage, FaCheck } from 'react-icons/fa';
import CustomToast from "./CustomToast";
import { serviceService } from '../services';
import { useTranslation } from 'react-i18next';

export default function ModalUpdateService({ service, onClose, onUpdated }) {
  const { t } = useTranslation();
  const [name, setName] = useState(service.name);
  const [description, setDescription] = useState(service.description || "");
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  async function handleUpdate(e) {
    e.preventDefault();

    if (!service || !service._id) {
      setToast({ message: t('modal.noServiceSelected'), type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (logo) formData.append("logo", logo);

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

  function handleLogoChange(e) {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
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
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={t('modal.enterServiceName')}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('dashboard.description')}</label>
              <textarea
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder={t('modal.enterDescription')}
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
