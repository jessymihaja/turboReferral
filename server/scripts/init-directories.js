const fs = require('fs');
const path = require('path');

const directories = [
  'uploads',
  'uploads/services',
  'uploads/profiles',
  'uploads/logos'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Répertoire créé: ${dir}`);
  }
});

console.log('Initialisation des répertoires terminée');
