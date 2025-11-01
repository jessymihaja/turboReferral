import { useTranslation } from 'react-i18next';
import { FaFlag } from 'react-icons/fa';

const MultilingualDescriptionInput = ({ 
  descriptions, 
  onDescriptionChange, 
  placeholder, 
  className = "",
  maxLength = 500,
  error 
}) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const handleDescriptionChange = (lang, value) => {
    const newDescriptions = { ...descriptions };
    newDescriptions[lang] = value;
    onDescriptionChange(newDescriptions);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {languages.map((language) => (
        <div key={language.code} className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <span>{language.flag}</span>
            <span>{language.name}</span>
            {language.code === currentLanguage && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {t('common.current', 'Actuel')}
              </span>
            )}
          </label>
          <textarea
            value={descriptions[language.code] || ''}
            onChange={(e) => handleDescriptionChange(language.code, e.target.value)}
            placeholder={`${placeholder} (${language.name})`}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[80px] ${
              error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
            }`}
            maxLength={maxLength}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {(descriptions[language.code] || '').length}/{maxLength}
            </span>
            {language.code === 'fr' && (
              <span className="text-xs text-gray-400">
                {t('validation.required', 'Requis')}
              </span>
            )}
          </div>
        </div>
      ))}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default MultilingualDescriptionInput;