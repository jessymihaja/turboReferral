import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ReferralInfo from '../components/ReferralInfo';
import { serviceService, categoryService } from '../services';

export default function Home() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesData = await serviceService.getAll();
        const categoriesData = await categoryService.getAll();

        setServices(servicesData.data || servicesData);
        setCategories(categoriesData.data || categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredServices = services.filter(service => {
    const matchQuery = query.trim()
      ? service.name.toLowerCase().includes(query.toLowerCase())
      : true;

    const matchCategory = selectedCategory
      ? service.category === selectedCategory
      : true;

    return matchQuery && matchCategory;
  });

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '2rem auto',
        padding: '1rem 1.5rem',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        borderRadius: '8px',
        backgroundColor: '#fff',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '1.5rem' }}>
        Bienvenue sur <span style={{ color: '#27ae60' }}>TurboReferral</span> 🚀
      </h1>

      <input
        type="search"
        placeholder="Rechercher un service..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: '0.75rem 1rem',
          fontSize: '1rem',
          borderRadius: '6px',
          border: '1px solid #ccc',
          marginBottom: '1rem',
          outline: 'none',
          transition: 'border-color 0.3s ease',
          width: '100%',
          boxSizing: 'border-box',
        }}
        onFocus={e => (e.target.style.borderColor = '#27ae60')}
        onBlur={e => (e.target.style.borderColor = '#ccc')}
      />

      {/* Boutons Catégories */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={() => setSelectedCategory('')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            backgroundColor: !selectedCategory ? '#27ae60' : '#b38666ff',
            color: !selectedCategory ? 'white' : 'white',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s ease',
          }}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat._id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              backgroundColor: selectedCategory === cat._id ? '#27ae60' : '#b38666ff',
              color: selectedCategory === cat._id ? 'white' : 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Liste des services */}
      <motion.ul
        style={{
          listStyle: 'none',
          paddingLeft: 0,
          margin: 0,
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'flex-start',
        }}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05,
            },
          },
          hidden: {},
        }}
      >
        <AnimatePresence>
          {filteredServices.map(service => (
            <motion.li
              key={service._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{
                flex: '1 0 18%', // ~5 par ligne
                minWidth: '150px',
                maxWidth: '150px',
                padding: '0.25rem',
                borderRadius: '8px',
                backgroundColor: '#f4f4f4',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              }}
              whileHover={{ backgroundColor: '#d1e7dd' }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/services/${service._id}`}
                style={{
                  textDecoration: 'none',
                  color: '#2c3e50',
                  fontWeight: '600',
                  fontSize: '1rem',
                  display: 'block',
                }}
              >
                {service.logo && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${service.logo}`}
                    alt={service.name}
                    style={{ maxWidth: '40px', maxHeight: '40px', marginBottom: '0.5rem' ,objectFit: 'contain', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                  />
                )}
                {service.name}

              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {!query.trim() && filteredServices.length === 0 && (
        <p style={{ color: '#7f8c8d', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>
          Aucune reponse dans la catégorie sélectionnée pour le moment.
        </p>
      )}
      {query.trim() && filteredServices.length === 0 && (
        <p style={{ color: '#e74c3c', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>
          Aucun service trouvé pour "{query}".
        </p>
      )}
      <ReferralInfo></ReferralInfo>
    </div>
  );
}
