export const getLocalizedText = (text, currentLanguage = 'fr') => {
  if (!text) return '';
  if (typeof text === 'string') return text;
  if (typeof text === 'object') {
    return text[currentLanguage] || text.fr || text.en || '';
  }
  return '';
};

export const getLocalizedServiceName = (service, currentLanguage = 'fr') => {
  if (!service || !service.name) return 'Unknown Service';
  return getLocalizedText(service.name, currentLanguage);
};

export const getLocalizedDescription = (entity, currentLanguage = 'fr') => {
  if (!entity || !entity.description) return '';
  return getLocalizedText(entity.description, currentLanguage);
};
