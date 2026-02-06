# Project TODO

- [x] Configurer la clé API OpenRouter côté serveur
- [x] Créer le schéma de base de données pour l'historique des messages
- [x] Implémenter les procédures tRPC backend pour le chat (envoi message, récupération historique, effacement)
- [x] Créer la page d'avertissement avec boutons START/EXIT
- [x] Créer l'interface de chat avec thème Matrix (vert/noir)
- [x] Implémenter l'affichage des messages avec formatage markdown
- [x] Ajouter le bouton pour effacer l'historique
- [x] Tester l'intégration complète de l'API OpenRouter
- [x] Appliquer le thème visuel terminal Matrix sur toute l'application

## Modifications Requises

- [x] Enlever l'authentification des procédures tRPC chat
- [x] Modifier l'interface Chat pour enlever les vérifications d'authentification
- [x] Utiliser un identifiant de session client au lieu de userId
- [x] Tester le flux sans authentification


## Bug Fixes

- [x] Corriger l'erreur "Failed to get response from AI" lors de l'appel API OpenRouter
- [x] Améliorer la gestion des erreurs et les messages d'erreur
