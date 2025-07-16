import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/api/services')
      .then(res => res.json())
      .then(setServices)
      .catch(console.error);
  }, []);

  const filteredServices = query.trim()
    ? services.filter(service =>
        service.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div
      style={{
        maxWidth: '800px',
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
          marginBottom: '1.5rem',
          outline: 'none',
          transition: 'border-color 0.3s ease',
          width: '100%',
          boxSizing: 'border-box',
        }}
        onFocus={e => (e.target.style.borderColor = '#27ae60')}
        onBlur={e => (e.target.style.borderColor = '#ccc')}
      />

      <motion.ul
        style={{
          listStyle: 'none',
          paddingLeft: 0,
          margin: 0,
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
          gap: '1rem',
        }}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
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
                padding: '0.75rem 1rem',
                marginBottom: '0.75rem',
                borderRadius: '6px',
                backgroundColor: '#d7ccc8',
                cursor: 'pointer',
                width: '25%',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
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
                  fontSize: '1.1rem',
                  flexGrow: 1,
                  display: 'block',
                }}
              >
                {service.name}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>

        {!query.trim() && (
          <p style={{ color: '#7f8c8d', fontStyle: 'italic', textAlign: 'center', width: '100%' }}>
            Commencez à taper pour rechercher un service.
          </p>
        )}
        {query.trim() && filteredServices.length === 0 && (
          <p style={{ color: '#e74c3c', fontStyle: 'italic', textAlign: 'center', width: '100%' }}>
            Aucun service trouvé pour "{query}".
          </p>
        )}
      </motion.ul>
    </div>
  );
}
