import { useEffect, useState } from 'react';
import { useAuthFetch } from '../utils/authFetch';
import CategoryList from '../components/CategoryList';

export default function CategoryForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const authFetch = useAuthFetch();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/categories`);
      if (!res.ok) throw new Error('Error loading categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim() })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error while creating category');
      }

      const newCategory = await res.json();
      setSuccess('Category added successfully!');
      setName('');
      setDescription('');
      setCategories(prev => [newCategory, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{color:'#5D4037'}}>Créer une nouvelle categorie</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          placeholder="nom de la catégorie"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: '0.5rem', fontSize: '1rem',borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ borderRadius: '6px',padding: '0.5rem', fontSize: '1rem',border: '1px solid #ccc' }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button
          type="submit"
          style={{ padding: '0.5rem', backgroundColor: '#27ae60', color: 'white', border: 'none', fontSize: '1rem', cursor: 'pointer', borderRadius: '4px' }}
        >
          soumettre
        </button>
      </form>

      <hr style={{ margin: '1rem 0' }} />

      <CategoryList></CategoryList>
    </div>
  );
}
