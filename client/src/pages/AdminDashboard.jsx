import { useEffect, useState } from "react";
import { FaCheck, FaBox, FaExclamationCircle, FaUsers, FaChartLine, FaStar, FaLink, FaTrophy } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminLayout from "../components/AdminLayout";
import api from '../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [statsData, analyticsData] = await Promise.all([
          api.get('/api/admin/stats'),
          api.get('/api/admin/analytics'),
        ]);

        setStats(statsData.data || statsData);
        setAnalytics(analyticsData.data || analyticsData);
      } catch (err) {
        setError(err.message || t('errors.errorLoadingData'));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);


  if (loading) {
    return (
      <div className="page-container admin-dashboard">
        <div className="page-header">
          <h1 className="page-title">{t('admin.adminDashboard')}</h1>
          <p className="page-subtitle">{t('admin.overviewAnalytics')}</p>
        </div>

        <div className="admin-stats-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="admin-skeleton-card">
              <div className="admin-skeleton-text medium" />
              <div className="admin-skeleton-text large" />
              <div className="admin-skeleton-text small" />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container admin-dashboard">
        <div className="alert alert-error admin-alert">
          <FaExclamationCircle />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const COLORS = ['#C9A885', '#7A9B76', '#8BA9C1', '#D9A86A', '#C17A6F'];
  
  // Format growth data for line chart
  const growthData = analytics?.growth?.referrals?.map((item, index) => ({
    date: new Date(item._id).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
    parrainages: item.count,
    services: analytics?.growth?.services?.find(s => s._id === item._id)?.count || 0,
    utilisateurs: analytics?.growth?.users?.find(u => u._id === item._id)?.count || 0,
  })) || [];

  // Cumulative data
  let cumulativeReferrals = 0;
  let cumulativeServices = 0;
  let cumulativeUsers = 0;
  const cumulativeData = growthData.map(item => {
    cumulativeReferrals += item.parrainages;
    cumulativeServices += item.services;
    cumulativeUsers += item.utilisateurs;
    return {
      date: item.date,
      parrainages: cumulativeReferrals,
      services: cumulativeServices,
      utilisateurs: cumulativeUsers
    };
  });

  // Referrals by type
  const referralTypeData = analytics?.referralsByType?.map(item => ({
    name: item._id === 'link' ? 'Liens' : 'Codes',
    value: item.count
  })) || [];

  return (
    <AdminLayout
      title={t('admin.adminDashboard')}
      subtitle={t('admin.overviewAnalytics')}
    >
      <div className="admin-dashboard">

      {/* Main Stats */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon services">
              <FaBox />
            </div>
            <div className="admin-stat-trend positive">
              <FaChartLine size={10} />
              <span>+{stats?.services?.recent || 0}</span>
            </div>
          </div>
          <div className="admin-stat-value">{stats?.services?.total || 0}</div>
          <div className="admin-stat-label">{t('admin.totalServices')}</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon referrals">
              <FaLink />
            </div>
          </div>
          <div className="admin-stat-value">{stats?.referrals?.total || 0}</div>
          <div className="admin-stat-label">{t('admin.totalReferrals')}</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon users">
              <FaUsers />
            </div>
            <div className="admin-stat-trend positive">
              <FaChartLine size={10} />
              <span>+{stats?.users?.recent || 0}</span>
            </div>
          </div>
          <div className="admin-stat-value">{stats?.users?.total || 0}</div>
          <div className="admin-stat-label">{t('admin.totalUsers')}</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon promotions">
              <FaStar />
            </div>
          </div>
          <div className="admin-stat-value">{stats?.promotions?.active || 0}</div>
          <div className="admin-stat-label">{t('admin.activePromotions')}</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon pending">
              <FaExclamationCircle />
            </div>
          </div>
          <div className="admin-stat-value">{stats?.services?.pending || 0}</div>
          <div className="admin-stat-label">{t('admin.pending')}</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon validated">
              <FaCheck />
            </div>
          </div>
          <div className="admin-stat-value">{stats?.services?.validated || 0}</div>
          <div className="admin-stat-label">{t('admin.validated')}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="admin-charts-grid">
        {/* Growth Chart */}
        <div className="admin-chart-card">
          <h3 className="admin-chart-title">
            <FaChartLine /> {t('admin.evolutionLast30Days')}
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-text-tertiary)"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="var(--color-text-tertiary)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  background: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="parrainages" 
                stroke="#C9A885" 
                strokeWidth={2}
                name="Parrainages"
                dot={{ fill: '#C9A885' }}
              />
              <Line 
                type="monotone" 
                dataKey="services" 
                stroke="#7A9B76" 
                strokeWidth={2}
                name="Services"
                dot={{ fill: '#7A9B76' }}
              />
              <Line 
                type="monotone" 
                dataKey="utilisateurs" 
                stroke="#8BA9C1" 
                strokeWidth={2}
                name="Utilisateurs"
                dot={{ fill: '#8BA9C1' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Services Chart */}
        <div className="admin-chart-card">
          <h3 className="admin-chart-title">
            <FaTrophy /> {t('admin.topServices')}
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={analytics?.topServices || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-text-tertiary)"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="var(--color-text-tertiary)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  background: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)'
                }}
              />
              <Bar dataKey="count" fill="#C9A885" name="Parrainages" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Referrals by Type */}
        <div className="admin-chart-card">
          <h3 className="admin-chart-title">
            <FaLink /> {t('admin.referralsByType')}
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={referralTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
              >
                {referralTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Contributors */}
        <div className="admin-chart-card">
          <h3 className="admin-chart-title">
            <FaUsers /> {t('admin.topContributors')}
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={analytics?.topContributors || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
              <XAxis 
                type="number"
                stroke="var(--color-text-tertiary)"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                dataKey="username" 
                type="category"
                stroke="var(--color-text-tertiary)"
                style={{ fontSize: '12px' }}
                width={100}
              />
              <Tooltip 
                contentStyle={{
                  background: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)'
                }}
              />
              <Bar dataKey="count" fill="#7A9B76" name="Parrainages" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}

