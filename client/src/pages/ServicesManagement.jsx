import { useEffect, useState } from "react";
import { FaCheck, FaEdit, FaBox, FaExclamationCircle, FaPlus } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import AdminLayout from "../components/AdminLayout";
import Table from "../components/Table";
import ModalUpdateService from "../components/ModalUpdateService";
import ModalValidateService from "../components/ModalValidateService";
import ModalAddService from "../components/ModalAddService";
import api from '../services/api';
import './ServicesManagement.css';

export default function ServicesManagement() {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [serviceToValidate, setServiceToValidate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      setLoading(true);
      const servicesData = await api.get('/api/admin/services');
      setServices(servicesData.data || servicesData);
    } catch (err) {
      setError(err.message || t('errors.errorLoadingData'));
    } finally {
      setLoading(false);
    }
  }

  function handleOpenValidateModal(service) {
    setServiceToValidate(service);
  }

  function handleServiceValidated(updated) {
    setServices(services.map((s) => (s._id === updated._id ? updated : s)));
    setServiceToValidate(null);
  }

  function handleServiceAdded(newService) {
    setServices([newService, ...services]);
    setShowAddModal(false);
  }

  const serviceColumns = [
    {
      key: 'logo',
      header: t('table.logo'),
      sortable: false,
      width: '80px',
      align: 'center',
      render: (service) => (
        service.logo ? (
          <img
            src={`${import.meta.env.VITE_API_URL}${service.logo}`}
            alt={service.name}
            className="table-img"
          />
        ) : (
          <div className="avatar">
            <FaBox />
          </div>
        )
      )
    },
    {
      key: 'name',
      header: t('table.name'),
      accessor: (service) => service.name
    },
    {
      key: 'description',
      header: t('table.description'),
      accessor: (service) => service.description || '—',
      render: (service) => (
        <div className="truncate" style={{ maxWidth: '300px' }} title={service.description}>
          {service.description || '—'}
        </div>
      )
    },
    {
      key: 'category',
      header: t('table.category'),
      accessor: (service) => service.category?.name || '—',
      render: (service) => service.category?.name || '—'
    },
    {
      key: 'isValidated',
      header: t('table.status'),
      align: 'center',
      render: (service) => (
        <span className={`badge ${service.isValidated ? 'badge-success' : 'badge-warning'}`}>
          {service.isValidated ? (
            <>
              <FaCheck size={10} /> {t('admin.validated')}
            </>
          ) : (
            <>
              <FaExclamationCircle size={10} /> {t('admin.pending')}
            </>
          )}
        </span>
      )
    },
    {
      key: 'actions',
      header: t('table.actions'),
      sortable: false,
      align: 'center',
      width: '180px',
      render: (service) => (
        <div className="table-actions" style={{ gap: 'var(--space-2)' }}>
          {!service.isValidated && (
            <button
              onClick={() => handleOpenValidateModal(service)}
              className="btn-sm btn-success"
              title={t('admin.validateService')}
            >
              <FaCheck size={12} />
            </button>
          )}
          <button
            onClick={() => setSelectedService(service)}
            className="btn-sm btn-primary"
            title={t('admin.editService')}
          >
            <FaEdit size={12} />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <AdminLayout
        title={
          <>
            <FaBox /> {t('admin.servicesManagement')}
          </>
        }
        subtitle="Gérer et valider les services de la plateforme"
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
          <div className="spinner" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout
        title={
          <>
            <FaBox /> {t('admin.servicesManagement')}
          </>
        }
        subtitle="Gérer et valider les services de la plateforme"
      >
        <div className="alert alert-error">
          <FaExclamationCircle />
          <span>{error}</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={
        <>
          <FaBox /> {t('admin.servicesManagement')}
        </>
      }
      subtitle="Gérer et valider les services de la plateforme"
    >
      <div className="services-management">
        <div className="services-header">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
          >
            <FaPlus /> {t('admin.addService')}
          </button>
        </div>

        <div className="services-table-wrapper">
          <Table
            data={services}
            columns={serviceColumns}
            searchable={true}
            sortable={true}
            paginated={true}
            pageSize={10}
            emptyMessage={t('admin.noServicesFound')}
          />
        </div>

        {selectedService && (
          <ModalUpdateService
            service={selectedService}
            onClose={() => setSelectedService(null)}
            onUpdated={(updatedService) => {
              setServices(
                services.map((s) => (s._id === updatedService._id ? updatedService : s))
              );
            }}
          />
        )}

        {serviceToValidate && (
          <ModalValidateService
            service={serviceToValidate}
            onClose={() => setServiceToValidate(null)}
            onValidated={handleServiceValidated}
          />
        )}

        {showAddModal && (
          <ModalAddService
            onClose={() => setShowAddModal(false)}
            onAdded={handleServiceAdded}
          />
        )}
      </div>
    </AdminLayout>
  );
}
