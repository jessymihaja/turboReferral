import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaEye, FaBan, FaCheck, FaSearch, FaFilter } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../components/AdminLayout';
import Table from '../components/Table';
import api from '../services/api';
import CustomToast from '../components/CustomToast';
import './UsersManagement.css';

export default function UsersManagement() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    isBlocked: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchUsers();
  }, [filters, pagination.page]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      const response = await api.get('/api/admin/users', { params });
      const data = response.data || response;

      setUsers(data.users || []);
      setPagination(prev => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 0
      }));
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des utilisateurs');
      CustomToast.error(err.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  }

  function handleViewUser(userId) {
    navigate(`/admin/users/${userId}`);
  }

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }

  const columns = [
    {
      key: 'username',
      header: 'Nom d\'utilisateur',
      accessor: (user) => user.username,
      render: (user) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {user.profilePhoto ? (
            <img
              src={`${import.meta.env.VITE_API_URL}${user.profilePhoto}`}
              alt={user.username}
              className="user-avatar"
            />
          ) : (
            <div className="user-avatar-placeholder">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="user-username">{user.username}</span>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Email',
      accessor: (user) => user.email
    },
    {
      key: 'role',
      header: 'Rôle',
      align: 'center',
      render: (user) => (
        <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
          {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
        </span>
      )
    },
    {
      key: 'isBlocked',
      header: 'Statut',
      align: 'center',
      render: (user) => (
        <span className={`badge ${user.isBlocked ? 'badge-error' : 'badge-success'}`}>
          {user.isBlocked ? (
            <>
              <FaBan size={10} /> Bloqué
            </>
          ) : (
            <>
              <FaCheck size={10} /> Actif
            </>
          )}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'Inscrit le',
      accessor: (user) => new Date(user.createdAt).toLocaleDateString('fr-FR')
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      align: 'center',
      width: '100px',
      render: (user) => (
        <button
          onClick={() => handleViewUser(user._id)}
          className="btn-sm btn-primary"
          title="Voir les détails"
        >
          <FaEye size={12} />
        </button>
      )
    }
  ];

  if (loading && users.length === 0) {
    return (
      <div className="page-container users-management">
        <div className="page-header">
          <h1 className="page-title">
            <FaUsers /> Gestion des utilisateurs
          </h1>
          <p className="page-subtitle">Gérer et modérer les utilisateurs de la plateforme</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
      <AdminLayout
        title={
          <>
            <FaUsers /> Gestion des utilisateurs
          </>
        }
        subtitle="Gérer et modérer les utilisateurs de la plateforme"
      >

      <div className="filters-section">
        <div className="filter-group">
          <div className="input-group">
            <FaSearch className="input-icon" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input-with-icon"
              style={{paddingLeft: "2.5rem"}}
            />
          </div>
        </div>

        <div className="filter-group">
          <div className="input-group">
            <FaFilter className="input-icon" />
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="input-with-icon"
            >
              <option value="">Tous les rôles</option>
              <option value="user">Utilisateur</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="filter-group">
          <div className="input-group">
            <FaFilter className="input-icon" />
            <select
              value={filters.isBlocked}
              onChange={(e) => handleFilterChange('isBlocked', e.target.value)}
              className="input-with-icon"
            >
              <option value="">Tous les statuts</option>
              <option value="false">Actifs</option>
              <option value="true">Bloqués</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="users-table-wrapper">
        <Table
          data={users}
          columns={columns}
          searchable={false}
          sortable={true}
          paginated={false}
          emptyMessage="Aucun utilisateur trouvé"
        />
      </div>

      {pagination.pages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
            className="btn-secondary"
          >
            Précédent
          </button>
          <span className="pagination-info">
            Page {pagination.page} sur {pagination.pages}
          </span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page >= pagination.pages}
            className="btn-secondary"
          >
            Suivant
          </button>
        </div>
      )}
     </AdminLayout>
  );
}
