#!/usr/bin/env node

/**
 * Script de vérification de la configuration de production
 */

require('dotenv').config();

const chalk = require('chalk') || {
  green: (str) => `✓ ${str}`,
  red: (str) => `✗ ${str}`,
  yellow: (str) => `⚠ ${str}`,
  blue: (str) => str,
  bold: (str) => str,
};

console.log('\n🔍 Vérification de la configuration de production...\n');

let hasErrors = false;
let hasWarnings = false;

function checkError(condition, message) {
  if (!condition) {
    console.log(chalk.red(`✗ ${message}`));
    hasErrors = true;
  } else {
    console.log(chalk.green(`✓ ${message}`));
  }
}

function checkWarning(condition, message) {
  if (!condition) {
    console.log(chalk.yellow(`⚠ ${message}`));
    hasWarnings = true;
  } else {
    console.log(chalk.green(`✓ ${message}`));
  }
}

// Vérifier NODE_ENV
console.log(chalk.bold('\n📋 Environnement:'));
checkError(
  process.env.NODE_ENV === 'production',
  'NODE_ENV est configuré en production'
);

// Vérifier les variables requises
console.log(chalk.bold('\n🔐 Variables d\'environnement requises:'));
checkError(process.env.MONGO_URI, 'MONGO_URI est défini');
checkError(process.env.JWT_SECRET, 'JWT_SECRET est défini');
checkError(process.env.PORT, 'PORT est défini');

// Vérifier la sécurité du JWT
console.log(chalk.bold('\n🔒 Sécurité JWT:'));
if (process.env.JWT_SECRET) {
  const defaultSecrets = [
    'secret',
    'mysecret',
    'jwt_secret',
    'MaSuperChaineSecrete2025!@#',
  ];
  checkWarning(
    !defaultSecrets.includes(process.env.JWT_SECRET),
    'JWT_SECRET n\'utilise pas de valeur par défaut'
  );
  checkWarning(
    process.env.JWT_SECRET.length >= 32,
    'JWT_SECRET a au moins 32 caractères'
  );
}

// Vérifier CORS
console.log(chalk.bold('\n🌐 Configuration CORS:'));
checkError(process.env.CORS_ORIGIN, 'CORS_ORIGIN est défini');
if (process.env.CORS_ORIGIN) {
  const origins = process.env.CORS_ORIGIN.split(',').map((o) => o.trim());
  checkWarning(
    !origins.includes('*') && !origins.includes('true'),
    'CORS n\'autorise pas tous les domaines (*)'
  );
  checkWarning(
    origins.every((o) => o.startsWith('https://')),
    'Tous les CORS_ORIGIN utilisent HTTPS'
  );
  checkWarning(
    !origins.some((o) => o.includes('localhost')),
    'CORS_ORIGIN ne contient pas localhost'
  );
}

// Vérifier MongoDB
console.log(chalk.bold('\n💾 Base de données:'));
if (process.env.MONGO_URI) {
  checkWarning(
    !process.env.MONGO_URI.includes('localhost'),
    'MongoDB n\'utilise pas localhost'
  );
  checkWarning(
    process.env.MONGO_URI.includes('mongodb+srv://') ||
      process.env.MONGO_URI.includes('ssl=true'),
    'MongoDB utilise une connexion sécurisée (SSL/TLS)'
  );
}

// Vérifier JWT expiration
console.log(chalk.bold('\n⏰ Configuration JWT:'));
checkWarning(
  process.env.JWT_EXPIRES_IN,
  'JWT_EXPIRES_IN est défini'
);

// Résumé
console.log(chalk.bold('\n📊 Résumé:'));
if (hasErrors) {
  console.log(chalk.red('\n❌ Des erreurs critiques ont été détectées. Corrigez-les avant de déployer en production.\n'));
  process.exit(1);
} else if (hasWarnings) {
  console.log(chalk.yellow('\n⚠️  Des avertissements ont été détectés. Vérifiez la configuration avant de déployer.\n'));
  process.exit(0);
} else {
  console.log(chalk.green('\n✅ Configuration prête pour la production!\n'));
  process.exit(0);
}
