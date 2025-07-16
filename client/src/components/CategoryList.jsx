import { useEffect, useState } from 'react';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div style={{ marginTop: '1rem'}}>
      <h3 style={{ marginBottom: '1rem' }}>categories Existantes</h3>

      <ul style={{ paddingLeft: '1.2rem',minHeight: '300px' }}>
        {paginatedCategories.map(cat => (
          <li key={cat._id} style={{ marginBottom: '0.5rem' }}>
            <strong>{cat.name}</strong>
            {cat.description && <span>: {cat.description}</span>}
          </li>
        ))}
      </ul>

      {/* Pagination controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
        >
          ← Previous
        </button>

        <span style={{ alignSelf: 'center' }}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
