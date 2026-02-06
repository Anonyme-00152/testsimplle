# DarkGPT - Déploiement sur Vercel

## 🚀 Instructions de Déploiement

### 1. Prérequis

- Un compte Vercel (https://vercel.com)
- Un compte GitHub avec ce dépôt
- Une base de données MySQL/TiDB (ex: PlanetScale, Vercel MySQL)
- Une clé API OpenRouter (https://openrouter.ai)

### 2. Configuration de la Base de Données

1. Créez une base de données MySQL/TiDB
2. Récupérez la chaîne de connexion (DATABASE_URL)
3. Assurez-vous que la base de données est accessible depuis Vercel

### 3. Déploiement sur Vercel

#### Option A: Via l'interface Vercel

1. Allez sur https://vercel.com/new
2. Importez ce dépôt GitHub
3. Sélectionnez le framework: **Other**
4. Configurez les variables d'environnement (voir section 4)
5. Cliquez sur "Deploy"

#### Option B: Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

### 4. Variables d'Environnement Requises

Ajoutez ces variables dans les paramètres du projet Vercel:

```
DATABASE_URL=mysql://user:password@host:3306/database
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxx
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/login
JWT_SECRET=your-jwt-secret-key
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Name
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-api-key
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

### 5. Configuration Build

Vercel devrait détecter automatiquement:
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

### 6. Vérification Post-Déploiement

1. Accédez à votre URL Vercel
2. Cliquez sur "START" pour accepter les conditions
3. Testez l'envoi d'un message
4. Vérifiez que les réponses arrivent correctement

### 7. Dépannage

**Erreur: "Failed to get response from AI"**
- Vérifiez que `OPENROUTER_API_KEY` est correctement configurée
- Vérifiez la connectivité réseau vers openrouter.ai

**Erreur: "Database connection failed"**
- Vérifiez que `DATABASE_URL` est correctement configurée
- Assurez-vous que la base de données est accessible depuis Vercel
- Vérifiez les pare-feu et les règles de sécurité

**Erreur: "OAuth failed"**
- Vérifiez que `VITE_APP_ID` et `OAUTH_SERVER_URL` sont corrects
- Assurez-vous que l'URL de callback est enregistrée dans Manus OAuth

### 8. Logs en Temps Réel

Pour voir les logs en temps réel sur Vercel:
```bash
vercel logs
```

## 📝 Notes Importantes

- Le projet utilise **pnpm** comme gestionnaire de paquets
- Les migrations de base de données se font automatiquement au démarrage
- Le système de retry automatique gère les erreurs réseau temporaires
- Chaque session utilisateur est isolée avec un sessionId unique

## 🔒 Sécurité

- La clé API OpenRouter est stockée côté serveur uniquement
- Les messages ne sont pas loggés
- Les sessions sont isolées par sessionId
