import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useAuthFetch } from '../utils/authFetch';
import CustomToast from '../components/CustomToast';
import { referralService, categoryService, serviceService } from '../services';

export default function Dashboard() {
  const { user } = useContext(UserContext);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const authFetch = useAuthFetch();
  const [toast, setToast] = useState({ message: '', type: '' });

  // État formulaire création service
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceLogoFile, setServiceLogoFile] = useState(null); // FICHIER LOGO
  const [serviceWebsite, setServiceWebsite] = useState('');
  const [validationPatterns, setValidationPatterns] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function fetchUserReferrals() {
      try {
        setLoading(true);
        const data = await referralService.getByUser(user._id);
        setReferrals(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchCategories() {
      try {
        const data = await categoryService.getAll();
        setCategories(data.data || data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchCategories();
    fetchUserReferrals();
  }, [user]);

  function groupByService(referrals) {
    return referrals.reduce((acc, ref) => {
      const serviceName = ref.service?.name || 'Service inconnu';
      if (!acc[serviceName]) acc[serviceName] = [];
      acc[serviceName].push(ref);
      return acc;
    }, {});
  }

  async function handleDelete(id) {
    if (!confirm('Confirmer la suppression ?')) return;
    try {
      setDeletingId(id);
      await referralService.delete(id);
      setReferrals(referrals.filter(ref => ref._id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleServiceRequestSubmit(e) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!serviceName.trim()) {
      setToast({ message: 'Le nom du service est obligatoire', type: 'error' });
      return;
    }

    setFormLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', serviceName.trim());
      formData.append('description', serviceDescription.trim());
      formData.append('website', serviceWebsite.trim());
      formData.append('category', selectedCategory || '');
      formData.append(
        'validationPatterns',
        JSON.stringify(
          validationPatterns
            .split(/\n|,/)
            .map(p => p.trim())
            .filter(p => p.length > 0)
        )
      );

      if (serviceLogoFile) {
        formData.append('logo', serviceLogoFile);
      }

      await serviceService.create(formData);

      setToast({ message: 'Service demandé avec succès', type: 'success' });
      setServiceName('');
      setServiceDescription('');
      setServiceLogoFile(null);
      setServiceWebsite('');
      setValidationPatterns('');
      setSelectedCategory('');
    } catch (err) {
      setToast({ message: err.message || 'Erreur lors de la demande', type: 'error' });
    } finally {
      setFormLoading(false);
    }
  }

  if (!user) return <p>Vous devez être connecté pour accéder au dashboard.</p>;
  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>;

  const grouped = groupByService(referrals);

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1rem', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {toast.message && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}
      <h2 style={{ marginBottom: '1rem', color: '#5D4037' }}>Bienvenue sur votre tableau de bord {user.username}</h2>
      <p style={{ marginBottom: '1.5rem', color: '#4E342E' }}>Vous avez {referrals.length} lien(s) ou code(s) de parrainage.</p>

      {referrals.length === 0 ? (
        <p>Aucun referral posté pour l'instant.</p>
      ) : (
        Object.entries(grouped).map(([serviceName, refs]) => (
          <section key={serviceName} style={{ marginBottom: '2rem' }}>
            <h3 style={{ borderBottom: '2px solid #27ae60', paddingBottom: '0.3rem', marginBottom: '1rem', color: '#27ae60' }}>
              <a href={`/services/${refs[0].service._id}`} style={{ color: '#27ae60', textDecoration: 'none' }}>
                {serviceName}
              </a>
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {refs.map(ref => (
                <li
                  key={ref._id}
                  style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  {ref.link ? (
                    <a href={ref.link} target="_blank" rel="noreferrer" style={{ fontWeight: '600', color: '#2c3e50' }}>
                      {ref.link}
                    </a>
                  ) : (
                    <span style={{ fontWeight: '600' }}>Code : {ref.code}</span>
                  )}
                  {ref.description && (
                    <p style={{ fontStyle: 'italic', marginTop: '0.3rem', color: '#555' }}>
                      {ref.description}
                    </p>
                  )}
                  <button
                    onClick={() => handleDelete(ref._id)}
                    disabled={deletingId === ref._id}
                    style={{
                      marginTop: '0.5rem',
                      marginLeft: '0.4rem',
                      backgroundColor: deletingId === ref._id ? '#ccc' : '#e74c3c',
                      color: 'white',
                      border: 'none',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      cursor: deletingId === ref._id ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {deletingId === ref._id ? 'Suppression...' : 'Supprimer'}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      <section style={{ marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #ccc' }}>
        <form
          onSubmit={handleServiceRequestSubmit}
          style={{
            maxWidth: '600px',
            margin: '2rem auto',
            padding: '2rem',
            borderRadius: '10px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            fontFamily: 'Segoe UI, sans-serif',
          }}
        >
          <h2 style={{ marginBottom: '1rem', color: '#333' }}>Demander un nouveau service</h2>

          <input
            type="text"
            placeholder="Nom du service"
            value={serviceName}
            onChange={e => setServiceName(e.target.value)}
            required
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />

          <textarea
            placeholder="Description"
            value={serviceDescription}
            onChange={e => setServiceDescription(e.target.value)}
            rows={3}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />

          {/* ✅ INPUT FILE POUR LE LOGO */}
          <input
            type="file"
            accept="image/*"
            onChange={e => setServiceLogoFile(e.target.files[0])}
            style={{
              padding: '0.5rem',
              fontSize: '1rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
            }}
          />

          {/* ✅ Prévisualisation image */}
          {serviceLogoFile && (
            <div style={{ marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>Aperçu du logo :</p>
              <img
                src={URL.createObjectURL(serviceLogoFile)}
                alt="Prévisualisation du logo"
                style={{ width: '100px', height: 'auto', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>
          )}

          <input
            type="text"
            placeholder="Website"
            value={serviceWebsite}
            onChange={e => setServiceWebsite(e.target.value)}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />

          <textarea
            placeholder="Pattern de validation (une regex par ligne ou séparées par des virgules)"
            value={validationPatterns}
            onChange={e => setValidationPatterns(e.target.value)}
            rows={4}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          >
            <option value="">Catégorie</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {formError && <p style={{ color: 'red', fontWeight: '500' }}>{formError}</p>}
          {formSuccess && <p style={{ color: '#27ae60', fontWeight: '500' }}>{formSuccess}</p>}

          <button
            type="submit"
            disabled={formLoading}
            style={{
              padding: '0.75rem',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '6px',
              cursor: formLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            {formLoading ? 'Envoi...' : 'Soumettre'}
          </button>
        </form>
      </section>
    </div>
  );
}
