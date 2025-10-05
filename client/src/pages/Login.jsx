import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaArrowRight, FaExclamationCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../contexts/UserContext';
import { authService } from '../services';
import '../assets/css/auth.css';

export default function Login() {
  const { t } = useTranslation();
  const { user, login } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        if (!value.trim()) {
          return t('validation.usernameRequired');
        }
        if (value.length < 3) {
          return t('validation.usernameMinLength');
        }
        return '';
      case 'password':
        if (!value) {
          return t('validation.passwordRequired');
        }
        if (value.length < 6) {
          return t('validation.passwordMinLength');
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (fieldErrors[name]) {
      const error = validateField(name, value);
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }
    
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(formData);
      const { user, token } = response.data;
      login(user, token);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setGeneralError(err.message || t('errors.loginFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-welcome-panel">
          <h2 className="auth-welcome-title">{t('auth.welcomeBack')}</h2>
          <p className="auth-welcome-text">{t('auth.newHere')}</p>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <button className="auth-toggle-button">
              {t('auth.createAccount')}
            </button>
          </Link>
        </div>

        <div className="auth-form-container">
          <h2 className="auth-form-title">{t('auth.signIn')}</h2>
          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label className="auth-form-label">
                <FaUser /> {t('auth.username')}
              </label>
              <input
                type="text"
                name="username"
                className={`auth-form-input ${fieldErrors.username ? 'error' : ''}`}
                placeholder={t('auth.enterUsername')}
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                autoFocus
              />
              {fieldErrors.username && (
                <div className="auth-field-error">
                  <FaExclamationCircle /> {fieldErrors.username}
                </div>
              )}
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">
                <FaLock /> {t('auth.password')}
              </label>
              <input
                type="password"
                name="password"
                className={`auth-form-input ${fieldErrors.password ? 'error' : ''}`}
                placeholder={t('auth.enterPassword')}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {fieldErrors.password && (
                <div className="auth-field-error">
                  <FaExclamationCircle /> {fieldErrors.password}
                </div>
              )}
            </div>

            {generalError && (
              <div className="auth-alert auth-alert-error">
                <FaExclamationCircle /> {generalError}
              </div>
            )}

            <button type="submit" disabled={loading} className="auth-submit-button">
              {loading ? (
                <>
                  <span className="loading-spinner" />
                  {t('common.loading')}
                </>
              ) : (
                <>
                  {t('auth.signIn')} <FaArrowRight />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
