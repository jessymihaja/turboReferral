import { useTranslation } from 'react-i18next';
import { FaTimes, FaPlus } from 'react-icons/fa';
import { AVAILABLE_LANGUAGES } from '../utils/languages';

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

  const activeLanguages = Object.keys(descriptions || {});
  
  const languagesWithContent = activeLanguages.filter(
    lang => descriptions[lang] && String(descriptions[lang]).trim().length > 0
  );
  
  const unusedLanguages = AVAILABLE_LANGUAGES.filter(
    lang => !activeLanguages.includes(lang.code)
  );

  const handleDescriptionChange = (lang, value) => {
    const newDescriptions = { ...descriptions };
    newDescriptions[lang] = value;
    onDescriptionChange(newDescriptions);
  };

  const handleRemoveLanguage = (lang) => {
    const newDescriptions = { ...descriptions };
    delete newDescriptions[lang];
    onDescriptionChange(newDescriptions);
  };

  const handleAddLanguage = (lang) => {
    const newDescriptions = { ...(descriptions || {}) };
    newDescriptions[lang] = '';
    onDescriptionChange(newDescriptions);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {activeLanguages.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 text-sm mb-3">{t('common.noTranslations', 'Aucune traduction')}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {AVAILABLE_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleAddLanguage(lang.code)}
                className="px-3 py-1 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition-colors flex items-center gap-1"
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {activeLanguages.map((langCode) => {
            const language = AVAILABLE_LANGUAGES.find(l => l.code === langCode);
            const isCurrent = langCode === currentLanguage;
            const isRequired = activeLanguages.length === 1;
            
            return (
              <div key={langCode} className="space-y-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span>{language.flag}</span>
                    <span>{language.name}</span>
                    {isCurrent && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {t('common.current', 'Actuel')}
                      </span>
                    )}
                  </label>
                  {!isRequired && (
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(langCode)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title={t('common.remove', 'Supprimer')}
                    >
                      <FaTimes size={12} />
                    </button>
                  )}
                </div>
                <textarea
                  value={descriptions[langCode] || ''}
                  onChange={(e) => handleDescriptionChange(langCode, e.target.value)}
                  placeholder={`${placeholder} (${language.name})`}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[80px] ${
                    error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                  maxLength={maxLength}
                />
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{(descriptions[langCode] || '').length}/{maxLength}</span>
                  {isRequired && (
                    <span className="text-gray-400">{t('validation.required', 'Requis')}</span>
                  )}
                </div>
              </div>
            );
          })}
          
          {unusedLanguages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {unusedLanguages.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleAddLanguage(lang.code)}
                  className="px-3 py-1 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition-colors flex items-center gap-1"
                  title={`${t('common.add', 'Ajouter')} ${lang.name}`}
                >
                  <FaPlus size={10} />
                  <span>{lang.flag} {lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default MultilingualDescriptionInput;