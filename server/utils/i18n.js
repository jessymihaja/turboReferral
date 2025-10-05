const fs = require('fs');
const path = require('path');

const translations = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../locales/fr.json'), 'utf8')
);

function t(key, params = {}) {
  const keys = key.split('.');
  let value = translations;

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key;
    }
  }

  if (typeof value !== 'string') {
    return key;
  }

  return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
    return params[param] !== undefined ? params[param] : match;
  });
}

module.exports = { t };
