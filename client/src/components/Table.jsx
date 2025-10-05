import { useState, useMemo } from 'react';
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function Table({
  data = [],
  columns = [],
  searchable = true,
  sortable = true,
  paginated = true,
  pageSize = 10,
  emptyMessage,
  className = ''
}) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchable || !searchTerm.trim()) return data;

    return data.filter(row =>
      columns.some(column => {
        const value = column.accessor ? column.accessor(row) : row[column.key];
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns, searchable]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortable || !sortConfig.key) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const column = columns.find(col => col.key === sortConfig.key);
      const aValue = column.accessor ? column.accessor(a) : a[sortConfig.key];
      const bValue = column.accessor ? column.accessor(b) : b[sortConfig.key];

      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [filteredData, sortConfig, columns, sortable]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, paginated]);

  // Pagination info
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startItem = sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, sortedData.length);

  // Handle sort
  const handleSort = (columnKey) => {
    if (!sortable) return;

    setSortConfig(prev => ({
      key: columnKey,
      direction: prev.key === columnKey && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle page change
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Render sort icon
  const renderSortIcon = (columnKey) => {
    if (!sortable) return null;
    
    if (sortConfig.key !== columnKey) {
      return <FaSort className="text-muted" size={12} />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="text-primary" size={12} />
      : <FaSortDown className="text-primary" size={12} />;
  };

  return (
    <div className={`table-container ${className}`}>
      {searchable && (
        <div className="table-header">
          <div className="table-search">
            <FaSearch className="table-search-icon" size={14} />
            <input
              type="text"
              placeholder={t('table.search')}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="table-search-input"
            />
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  className={column.sortable !== false && sortable ? 'sortable' : ''}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                  style={{ 
                    width: column.width,
                    textAlign: column.align || 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: column.align === 'center' ? 'center' : column.align === 'right' ? 'flex-end' : 'flex-start' }}>
                    {column.header}
                    {column.sortable !== false && sortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="table-empty">
                    <div className="table-empty-icon">📭</div>
                    <div className="table-empty-text">{emptyMessage || t('table.noDataAvailable')}</div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr key={row.id || row._id || rowIndex}>
                  {columns.map(column => (
                    <td 
                      key={column.key}
                      style={{ textAlign: column.align || 'left' }}
                    >
                      {column.render 
                        ? column.render(row, rowIndex)
                        : column.accessor 
                          ? column.accessor(row)
                          : row[column.key]
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {paginated && sortedData.length > 0 && (
        <div className="table-pagination">
          <div className="table-pagination-info">
            {t('common.showing')} {startItem} {t('common.to')} {endItem} {t('common.of')} {sortedData.length} {t('common.entries')}
          </div>
          
          <div className="table-pagination-controls">
            <button
              className="table-pagination-btn"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <FaChevronLeft size={12} />
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  className={`table-pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className="table-pagination-btn"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
