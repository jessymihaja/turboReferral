import { useState, useContext } from 'react';
import { FaUser, FaEnvelope, FaCamera, FaSave, FaLock } from 'react-icons/fa';
import { UserContext } from '../contexts/UserContext';
import api from '../services/api';
import CustomToast from '../components/CustomToast';
import { compressProfilePhoto } from '../utils/imageCompressor';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useContext(UserContext);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(
    user?.profilePhoto ? `${import.meta.env.VITE_API_URL}${user.profilePhoto}` : null
  );
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setToast({ message: 'La photo ne doit pas dépasser 10 MB', type: 'error' });
        return;
      }

      try {
        setToast({ message: 'Compression de l\'image...', type: 'info' });
        const compressedFile = await compressProfilePhoto(file);
        setProfilePhoto(compressedFile);
        setPhotoPreview(URL.createObjectURL(compressedFile));
        setToast({ message: `Image compressée : ${(compressedFile.size / 1024).toFixed(0)} KB`, type: 'success' });
      } catch (error) {
        setToast({ message: 'Erreur lors de la compression de l\'image', type: 'error' });
        console.error(error);
      }
    }
  };

  const handleUploadPhoto = async () => {
    if (!profilePhoto) {
      setToast({ message: 'Veuillez sélectionner une photo', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('profilePhoto', profilePhoto, profilePhoto.name);

    try {
      setUploading(true);
      const response = await api.putFormData('/api/users/profile/photo', formData);

      const updatedUser = { ...user, profilePhoto: response.data.profilePhoto };
      updateUser(updatedUser);

      setPhotoPreview(`${import.meta.env.VITE_API_URL}${response.data.profilePhoto}`);
      setToast({ message: 'Photo de profil mise à jour', type: 'success' });
      setProfilePhoto(null);
    } catch (error) {
      setToast({ message: error.message || 'Erreur lors de la mise à jour', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const updateData = {
        username: formData.username,
        email: formData.email
      };

      const response = await api.put('/api/users/profile', updateData);

      const updatedUser = { ...user, ...response.data };
      updateUser(updatedUser);

      setToast({ message: 'Profil mis à jour', type: 'success' });
    } catch (error) {
      setToast({ message: error.message || 'Erreur lors de la mise à jour', type: 'error' });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setToast({ message: 'Les mots de passe ne correspondent pas', type: 'error' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setToast({ message: 'Le mot de passe doit contenir au moins 6 caractères', type: 'error' });
      return;
    }

    try {
      await api.put('/api/users/profile/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setToast({ message: 'Mot de passe mis à jour', type: 'success' });
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Erreur lors de la mise à jour', type: 'error' });
    }
  };

  return (
    <div className="page-container profile-page">
      {toast.message && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}

      <div className="page-header">
        <h1 className="page-title">
          <FaUser /> Mon Profil
        </h1>
        <p className="page-subtitle">Gérez vos informations personnelles</p>
      </div>

      <div className="profile-grid">
        <div className="profile-column">
          <div className="profile-card">
            <h2 className="card-title">
              <FaCamera /> Photo de profil
            </h2>
            <div className="photo-section">
              <div className="photo-preview">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profil" className="profile-photo-img" />
                ) : (
                  <div className="profile-photo-placeholder">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="photo-actions">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="photo-upload" className="btn-secondary">
                  <FaCamera /> Choisir une photo
                </label>
                {profilePhoto && (
                  <button
                    onClick={handleUploadPhoto}
                    className="btn-primary"
                    disabled={uploading}
                  >
                    {uploading ? 'Upload...' : <><FaSave /> Enregistrer</>}
                  </button>
                )}
              </div>
              <p className="photo-hint">JPG, PNG, GIF ou WEBP. Max 5 MB.</p>
            </div>
          </div>

          <div className="profile-card">
            <h2 className="card-title">
              <FaUser /> Informations personnelles
            </h2>
            <form onSubmit={handleUpdateProfile} className="profile-form two-cols">
              <div className="form-group">
                <label htmlFor="username">Nom d'utilisateur</label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="form-input"
                  required
                  minLength={3}
                  maxLength={30}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  <FaSave /> Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="profile-column">
          <div className="profile-card">
            <h2 className="card-title">
              <FaLock /> Changer le mot de passe
            </h2>
            <form onSubmit={handleUpdatePassword} className="profile-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Mot de passe actuel</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">Nouveau mot de passe</label>
                <input
                  type="password"
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="form-input"
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                <FaSave /> Changer le mot de passe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
