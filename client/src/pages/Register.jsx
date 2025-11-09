import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaCheck, FaArrowRight, FaExclamationCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../contexts/UserContext';
import { authService } from '../services';
import { TURNSTILE_SITE_KEY } from '../config/constants';
import '../assets/css/auth.css';

export default function Register() {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }

    window.onTurnstileSuccess = (token) => {
      setTurnstileToken(token);
    };

    window.onTurnstileError = () => {
      setGeneralError(t('errors.captchaError') || 'Erreur lors du chargement du captcha');
    };

    return () => {
      delete window.onTurnstileSuccess;
      delete window.onTurnstileError;
    };
  }, [user, navigate, t]);

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    return Math.min(strength, 3);
  };

  const getPasswordStrengthText = (strength) => {
    if (strength === 0) return '';
    if (strength === 1) return t('validation.passwordWeak');
    if (strength === 2) return t('validation.passwordMedium');
    return t('validation.passwordStrong');
  };

  const getPasswordStrengthClass = (strength) => {
    if (strength === 1) return 'password-strength-weak';
    if (strength === 2) return 'password-strength-medium';
    if (strength === 3) return 'password-strength-strong';
    return '';
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        if (!value.trim()) {
          return t('validation.usernameRequired');
        }
        if (value.length < 3) {
          return t('validation.usernameMinLength');
        }
        if (value.length > 20) {
          return t('validation.usernameMaxLength');
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
          return t('validation.usernameInvalid');
        }
        return '';
      case 'email':
        if (!value.trim()) {
          return t('validation.emailRequired');
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return t('validation.emailInvalid');
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
      case 'confirm':
        if (!value) {
          return t('validation.confirmPasswordRequired');
        }
        if (value !== formData.password) {
          return t('validation.passwordsDoNotMatch');
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
      
      if (formData.confirm && fieldErrors.confirm) {
        const confirmError = value !== formData.confirm ? t('validation.passwordsDoNotMatch') : '';
        setFieldErrors(prev => ({ ...prev, confirm: confirmError }));
      }
    }
    
    if (name === 'confirm' && formData.password) {
      const confirmError = value !== formData.password ? t('validation.passwordsDoNotMatch') : '';
      if (fieldErrors.confirm) {
        setFieldErrors(prev => ({ ...prev, confirm: confirmError }));
      }
    }
    
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
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    if (!turnstileToken) {
      setGeneralError(t('errors.captchaRequired') || 'Veuillez compléter le captcha');
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        turnstileToken
      });
      setSuccess(t('errors.registrationSuccessful'));
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setGeneralError(err.message || t('errors.registrationFailed'));
      if (window.turnstile) {
        window.turnstile.reset();
        setTurnstileToken('');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-welcome-panel">
          <h2 className="auth-welcome-title">{t('auth.joinUs')}</h2>
          <p className="auth-welcome-text">{t('auth.alreadyHaveAccount')}</p>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button className="auth-toggle-button">
              {t('auth.signIn')}
            </button>
          </Link>
        </div>

        <div className="auth-form-container">
          <h2 className="auth-form-title">{t('auth.createAccount')}</h2>
          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label className="auth-form-label">
                <FaUser /> {t('auth.username')}
              </label>
              <input
                type="text"
                name="username"
                className={`auth-form-input ${fieldErrors.username ? 'error' : ''}`}
                placeholder={t('auth.chooseUsername')}
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
                <FaEnvelope /> {t('auth.email')}
              </label>
              <input
                type="email"
                name="email"
                className={`auth-form-input ${fieldErrors.email ? 'error' : ''}`}
                placeholder={t('auth.yourEmail')}
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {fieldErrors.email && (
                <div className="auth-field-error">
                  <FaExclamationCircle /> {fieldErrors.email}
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
                placeholder={t('auth.createPassword')}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {fieldErrors.password && (
                <div className="auth-field-error">
                  <FaExclamationCircle /> {fieldErrors.password}
                </div>
              )}
              {formData.password && !fieldErrors.password && (
                <>
                  <div className="password-strength-indicator">
                    <div className={`password-strength-bar ${getPasswordStrengthClass(passwordStrength)}`} />
                  </div>
                  <div className="password-strength-text" style={{
                    color: passwordStrength === 1 ? 'var(--color-error-500)' : 
                           passwordStrength === 2 ? 'var(--color-warning-500)' : 
                           'var(--color-success-500)'
                  }}>
                    {getPasswordStrengthText(passwordStrength)}
                  </div>
                </>
              )}
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">
                <FaCheck /> {t('auth.confirmPassword')}
              </label>
              <input
                type="password"
                name="confirm"
                className={`auth-form-input ${fieldErrors.confirm ? 'error' : ''}`}
                placeholder={t('auth.confirmPassword')}
                value={formData.confirm}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {fieldErrors.confirm && (
                <div className="auth-field-error">
                  <FaExclamationCircle /> {fieldErrors.confirm}
                </div>
              )}
            </div>

            <div className="auth-form-group">
              <div 
                className="cf-turnstile" 
                data-sitekey={TURNSTILE_SITE_KEY}
                data-callback="onTurnstileSuccess"
                data-error-callback="onTurnstileError"
                data-theme="light"
              />
            </div>

            {generalError && (
              <div className="auth-alert auth-alert-error">
                <FaExclamationCircle /> {generalError}
              </div>
            )}

            {success && (
              <div className="auth-alert auth-alert-success">
                <FaCheck /> {success}
              </div>
            )}

            <button type="submit" disabled={loading} className="auth-submit-button">
              {loading ? (
                <>
                  <span className="loading-spinner" />
                  {t('auth.creating')}
                </>
              ) : (
                <>
                  {t('auth.createAccount')} <FaArrowRight />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
