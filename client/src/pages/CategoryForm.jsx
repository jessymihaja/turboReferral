import { useEffect, useState } from 'react';
import { FaPlus, FaTag, FaEdit, FaTrash, FaList } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../components/AdminLayout';
import Table from '../components/Table';
import CustomToast from '../components/CustomToast';
import { categoryService } from '../services';
import './CategoryForm.css';

export default function CategoryForm() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data.data || data);
    } catch (err) {
      setToast({ message: err.message || t('category.errorLoading'), type: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setToast({ message: t('category.nameRequired'), type: 'error' });
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        const data = await categoryService.update(editingId, {
          name: name.trim(),
          description: description.trim()
        });
        setToast({ message: t('category.categoryUpdated'), type: 'success' });
        setCategories(prev => prev.map(cat => cat._id === editingId ? (data.data || data) : cat));
        setEditingId(null);
      } else {
        const data = await categoryService.create({
          name: name.trim(),
          description: description.trim()
        });
        setToast({ message: t('category.categoryAdded'), type: 'success' });
        setCategories(prev => [data.data || data, ...prev]);
      }
      setName('');
      setDescription('');
    } catch (err) {
      setToast({ message: err.message || t('category.errorCreating'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setName(category.name);
    setDescription(category.description || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setDescription('');
  };

  const handleDelete = async (id) => {
    if (!confirm(t('category.confirmDelete'))) return;

    try {
      await categoryService.delete(id);
      setToast({ message: t('category.categoryDeleted'), type: 'success' });
      setCategories(prev => prev.filter(cat => cat._id !== id));
      if (editingId === id) {
        handleCancelEdit();
      }
    } catch (err) {
      setToast({ message: err.message || t('category.errorDeleting'), type: 'error' });
    }
  };

  const columns = [
    {
      key: 'name',
      header: t('category.categoryName'),
      accessor: (row) => row.name,
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <FaTag className="text-primary" size={14} />
          <strong>{row.name}</strong>
        </div>
      )
    },
    {
      key: 'description',
      header: t('dashboard.description'),
      accessor: (row) => row.description || '—',
      render: (row) => (
        <div className="truncate" style={{ maxWidth: '300px' }} title={row.description}>
          {row.description || '—'}
        </div>
      )
    },
    {
      key: 'servicesCount',
      header: t('category.servicesCount'),
      align: 'center',
      accessor: (row) => row.servicesCount || 0,
      render: (row) => (
        <span className="badge badge-neutral">
          {row.servicesCount || 0}
        </span>
      )
    },
    {
      key: 'actions',
      header: t('table.actions'),
      sortable: false,
      align: 'center',
      width: '120px',
      render: (row) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center' }}>
          <button
            onClick={() => handleEdit(row)}
            className="btn-sm btn-primary"
            title={t('common.edit')}
          >
            <FaEdit size={12} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="btn-sm btn-danger"
            title={t('common.delete')}
          >
            <FaTrash size={12} />
          </button>
        </div>
      )
    }
  ];

  return (
      <AdminLayout
        title={
          <>
            <FaTag style={{ display: 'inline', marginRight: 'var(--space-2)' }} />
            {t('category.categoryManagement')}
          </>
        }
        subtitle={t('category.createAndManage')}
      >
      {toast.message && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: '' })}
        />
      )}


      <div className="category-grid-layout">
        <form onSubmit={handleSubmit} className="form-container">
          <h2 style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            color: 'var(--color-text-primary)'
          }}>
            <FaPlus /> {editingId ? t('category.editCategory') : t('category.addNewCategory')}
          </h2>

          <div className="form-group">
            <label className="form-label form-label-required">
              <FaTag /> {t('category.categoryName')}
            </label>
            <input
              type="text"
              className="form-input"
              placeholder={t('category.categoryNamePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('dashboard.description')}</label>
            <textarea
              className="form-textarea"
              placeholder={t('category.descriptionPlaceholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button type="submit" className="form-submit" disabled={loading} style={{ flex: 1 }}>
              {loading ? t('category.creating') : editingId ? t('category.updateCategory') : t('category.createCategory')}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn-secondary"
                style={{ padding: '0 var(--space-4)' }}
              >
                {t('common.cancel')}
              </button>
            )}
          </div>
        </form>

        <div className="form-container category-table-container">
          <h2 style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            color: 'var(--color-text-primary)'
          }}>
            <FaList /> {t('category.existingCategories')}
          </h2>

          <Table
            data={categories}
            columns={columns}
            searchable={true}
            sortable={true}
            paginated={true}
            pageSize={8}
            emptyMessage={t('category.noCategories')}
          />
        </div>
      </div>
     </AdminLayout>
  );
}
