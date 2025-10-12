# Guide de Déploiement en Production

## Préparation du Backend

### 1. Configuration de l'environnement

Créez un fichier `.env` dans `/server` basé sur `.env.production.example` :

```bash
cd server
cp .env.production.example .env
```

Modifiez le fichier `.env` avec vos valeurs de production :

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://votre-uri-mongodb-production/turboreferral
JWT_SECRET=VOTRE_SECRET_JWT_TRES_LONG_ET_SECURISE
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://votre-domaine.com,https://www.votre-domaine.com
```

### 2. Installation des dépendances

```bash
cd server
npm install --production
```

### 3. Structure des répertoires

**Important** : Les répertoires d'upload sont automatiquement créés au démarrage du serveur (depuis `server.js`). Cependant, assurez-vous que le processus a les permissions d'écriture :

```bash
# Les répertoires suivants seront créés automatiquement :
# - uploads/
# - uploads/services/
# - uploads/profiles/
# - uploads/logos/

# Si besoin de les créer manuellement :
mkdir -p uploads/{services,profiles,logos}
chmod 755 uploads
chmod 755 uploads/*
```

### 4. Démarrage

```bash
npm start
```

## Préparation du Frontend

### 1. Variables d'environnement

Créez un fichier `.env.production` dans `/client` :

```env
VITE_API_URL=https://votre-api.com
```

### 2. Build de production

```bash
cd client
npm install
npm run build
```

Le dossier `dist/` contient les fichiers optimisés pour la production.

### 3. Déploiement

#### Option 1 : Serveur statique (Nginx, Apache)

Copiez le contenu de `client/dist/` vers votre serveur web.

Configuration Nginx exemple :

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    root /var/www/turboreferral;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Option 2 : Vercel / Netlify

Connectez votre repository Git et configurez :
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: `VITE_API_URL`

## Sécurité

### Points importants

1. **JWT_SECRET** : Utilisez une chaîne aléatoire longue et sécurisée
2. **CORS_ORIGIN** : Limitez aux domaines autorisés uniquement
3. **MongoDB** : Utilisez une connexion sécurisée (SSL/TLS) et des credentials robustes
4. **HTTPS** : Toujours utiliser HTTPS en production
5. **Rate Limiting** : Considérez ajouter un rate limiter (express-rate-limit)

## Optimisations

### Backend

1. Activez la compression gzip
2. Utilisez PM2 pour la gestion des processus :

```bash
npm install -g pm2
pm2 start server.js --name turboreferral-api
pm2 save
pm2 startup
```

### Frontend

Le build Vite inclut déjà :
- ✅ Minification du code
- ✅ Tree-shaking
- ✅ Code splitting
- ✅ Compression des assets

## Monitoring

### Logs

En production, les console.log sont désactivés (NODE_ENV=production).

Pour les erreurs critiques, utilisez un service comme :
- Sentry
- LogRocket
- Datadog

### Base de données

Configurez des backups automatiques de MongoDB.

## Checklist de déploiement

- [ ] Variables d'environnement configurées
- [ ] JWT_SECRET changé et sécurisé
- [ ] CORS_ORIGIN configuré avec les bons domaines
- [ ] MongoDB en production avec credentials sécurisés
- [ ] HTTPS configuré
- [ ] Build frontend optimisé
- [ ] Tests de l'API en production
- [ ] Monitoring configuré
- [ ] Backups MongoDB configurés
- [ ] PM2 ou équivalent pour le backend
- [ ] Logs d'erreur configurés

## Support

Pour toute question, consultez la documentation ou contactez l'équipe de développement.
