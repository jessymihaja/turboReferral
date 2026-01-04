export const AVAILABLE_LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

export const getAvailableLanguages = () => AVAILABLE_LANGUAGES;

export const getLanguageName = (langCode) => {
  const lang = AVAILABLE_LANGUAGES.find(l => l.code === langCode);
  return lang?.name || langCode;
};

export const getLanguageFlag = (langCode) => {
  const lang = AVAILABLE_LANGUAGES.find(l => l.code === langCode);
  return lang?.flag || '';
};

export const getDescriptionInLanguage = (description, language, fallbackLanguage = 'fr') => {
  if (!description) return '';
  if (typeof description === 'string') return description;
  if (typeof description === 'object') {
    return description[language] || description[fallbackLanguage] || '';
  }
  return '';
};

export const getDescriptionAvailableLanguages = (description) => {
  if (typeof description === 'string') return [];
  if (typeof description === 'object') {
    return Object.keys(description).filter(lang => description[lang] && description[lang].trim().length > 0);
  }
  return [];
};
