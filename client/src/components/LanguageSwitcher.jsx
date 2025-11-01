import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';

const LanguageSwitcher = ({ variant = 'navbar' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  // Different styles based on variant
  const getButtonStyle = () => {
    if (variant === 'navbar') {
      return {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        background: 'none',
        border: 'none',
        borderRadius: '8px',
        color: 'var(--color-text-secondary)',
        fontSize: 'var(--font-size-sm)',
        cursor: 'pointer',
        transition: 'all var(--transition-base)',
        ':hover': {
          backgroundColor: 'var(--color-bg-hover)',
          color: 'var(--color-text-primary)'
        }
      };
    }
    if (variant === 'footer') {
      return {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        borderRadius: '6px',
        color: 'white',
        fontSize: 'var(--font-size-sm)',
        cursor: 'pointer',
        transition: 'all var(--transition-base)',
        fontWeight: '500'
      };
    }
    // Admin sidebar variant (dark theme)
    return "flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200";
  };

  const getDropdownStyle = () => {
    if (variant === 'navbar') {
      return {
        position: 'absolute',
        top: '100%',
        left: '0',
        marginTop: '4px',
        backgroundColor: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border-light)',
        borderRadius: '8px',
        boxShadow: 'var(--shadow-lg)',
        minWidth: '140px',
        zIndex: 1000
      };
    }
    if (variant === 'footer') {
      return {
        position: 'absolute',
        bottom: '100%',
        left: '0',
        marginBottom: '4px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '8px',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
        minWidth: '140px',
        zIndex: 1000
      };
    }
    return "absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg min-w-full z-50";
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={variant === 'navbar' || variant === 'footer' ? getButtonStyle() : undefined}
        className={variant === 'admin' ? getButtonStyle() : undefined}
        onMouseEnter={(e) => {
          if (variant === 'navbar') {
            e.target.style.backgroundColor = 'var(--color-bg-hover)';
            e.target.style.color = 'var(--color-text-primary)';
          } else if (variant === 'footer') {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          }
        }}
        onMouseLeave={(e) => {
          if (variant === 'navbar') {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = 'var(--color-text-secondary)';
          } else if (variant === 'footer') {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }
        }}
        aria-label="Change language"
      >
        <FaGlobe style={{ fontSize: '14px' }} />
        <span style={{ fontWeight: '500' }}>
          {currentLanguage.flag} {variant === 'navbar' || variant === 'footer' ? currentLanguage.code.toUpperCase() : currentLanguage.name}
        </span>
        <FaChevronDown 
          style={{ 
            fontSize: '12px',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }} 
        />
      </button>

      {isOpen && (
        <div 
          style={variant === 'navbar' || variant === 'footer' ? getDropdownStyle() : undefined}
          className={variant === 'admin' ? getDropdownStyle() : undefined}
        >
          {languages.map((language, index) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              style={variant === 'navbar' ? {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 12px',
                textAlign: 'left',
                background: currentLanguage.code === language.code ? 'var(--color-bg-hover)' : 'transparent',
                border: 'none',
                borderRadius: index === 0 ? '8px 8px 0 0' : index === languages.length - 1 ? '0 0 8px 8px' : '0',
                color: currentLanguage.code === language.code ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-sm)',
                cursor: 'pointer',
                transition: 'all var(--transition-base)'
              } : variant === 'footer' ? {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 12px',
                textAlign: 'left',
                background: currentLanguage.code === language.code ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                border: 'none',
                borderRadius: index === 0 ? '8px 8px 0 0' : index === languages.length - 1 ? '0 0 8px 8px' : '0',
                color: 'white',
                fontSize: 'var(--font-size-sm)',
                cursor: 'pointer',
                transition: 'all var(--transition-base)'
              } : undefined}
              className={variant === 'admin' ? `flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-700 transition-colors duration-200 ${
                currentLanguage.code === language.code 
                  ? 'text-white bg-gray-700' 
                  : 'text-gray-300'
              } ${
                language === languages[0] ? 'rounded-t-lg' : ''
              } ${
                language === languages[languages.length - 1] ? 'rounded-b-lg' : ''
              }` : undefined}
              onMouseEnter={(e) => {
                if (variant === 'navbar' && currentLanguage.code !== language.code) {
                  e.target.style.backgroundColor = 'var(--color-bg-subtle)';
                } else if (variant === 'footer' && currentLanguage.code !== language.code) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (variant === 'navbar' && currentLanguage.code !== language.code) {
                  e.target.style.backgroundColor = 'transparent';
                } else if (variant === 'footer' && currentLanguage.code !== language.code) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSwitcher;