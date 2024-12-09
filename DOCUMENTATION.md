# Documentation du Projet Réseau Social

## Structure du Projet

```
projetfinal-dany/
├── client/               # Frontend de l'application
├── server.js            # Point d'entrée du serveur
├── app.js              # Configuration Express
├── config/             # Configuration de l'application
├── controllers/        # Logique métier
├── middleware/         # Middlewares personnalisés
├── models/            # Modèles de données Mongoose
├── routes/            # Routes de l'API
├── utils/             # Utilitaires
└── test/              # Tests unitaires et d'intégration
```

## Technologies Utilisées

### Backend
- **Node.js** avec **Express.js** comme framework
- **MongoDB** avec **Mongoose** pour la base de données
- **JWT** (JSON Web Tokens) pour l'authentification
- **Bcrypt** pour le hachage des mots de passe
- **Multer** pour la gestion des fichiers uploadés
- **Validator** pour la validation des données

### Tests
- **Jest** comme framework de test
- **Supertest** pour les tests d'API
- **MongoDB Memory Server** pour les tests d'intégration

## Scripts Disponibles

- `npm start` : Démarre le serveur en production
- `npm run dev` : Démarre le serveur en mode développement avec nodemon
- `npm test` : Lance les tests
- `npm run test:watch` : Lance les tests en mode watch
- `npm run test:coverage` : Génère un rapport de couverture des tests

## Architecture de l'Application

### Backend (Node.js/Express)
1. **Configuration** (`config/`)
   - Configuration de la base de données
   - Variables d'environnement
   - Configuration de sécurité

2. **Modèles** (`models/`)
   - Schémas Mongoose pour les données
   - Validation des données

3. **Contrôleurs** (`controllers/`)
   - Logique métier de l'application
   - Gestion des requêtes/réponses

4. **Routes** (`routes/`)
   - Définition des endpoints API
   - Routage des requêtes

5. **Middleware** (`middleware/`)
   - Authentification
   - Validation
   - Gestion des erreurs

6. **Utilitaires** (`utils/`)
   - Fonctions helpers
   - Services partagés

### Frontend (client/)
- Interface utilisateur
- Gestion des états
- Composants réutilisables
- Intégration avec l'API

## Sécurité

L'application implémente plusieurs mesures de sécurité :
- Hachage des mots de passe avec Bcrypt
- Authentification par JWT
- Validation des données entrantes
- Protection CORS
- Gestion sécurisée des cookies

## Tests

L'application utilise Jest pour les tests avec :
- Tests unitaires
- Tests d'intégration
- Tests d'API
- Base de données en mémoire pour les tests

## Déploiement

Pour déployer l'application :
1. Configurer les variables d'environnement
2. Installer les dépendances : `npm install`
3. Construire le frontend (si nécessaire)
4. Démarrer le serveur : `npm start`

## Maintenance

Pour maintenir l'application :
- Surveiller les logs serveur
- Mettre à jour régulièrement les dépendances
- Effectuer des sauvegardes de la base de données
- Surveiller les performances 