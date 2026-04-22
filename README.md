# Forum Interactif - Projet Nuxt 4

> Projet réalisé dans le cadre du module SpeWebJS - Développement Web / Spécialité Développement côté serveur en javascript

> IUT Nancy-Charlemagne - Université de Lorraine

- Réalisé par : **[Vivien Herrmann](https://github.com/Vivienhrm)**

![NodeJS](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Nuxt](https://img.shields.io/badge/Nuxt-00C58E?style=flat-square&logo=nuxtdotjs&logoColor=white)
![Vue](https://img.shields.io/badge/Vue.js-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![WebSockets](https://img.shields.io/badge/WebSockets-010101?style=flat-square&logo=socketdotio&logoColor=white)

Ce projet est une plateforme de forum moderne et interactive développée avec Nuxt 4. Il intègre une gestion complète de la base de données MySQL, un système d'authentification sécurisé et des fonctionnalités de communication en temps réel via WebSockets.

## Fonctionnalités principales

- **Authentification complète** : Inscription, connexion (hachage bcrypt) et gestion de session.
- **Forums & Discussions** : Navigation par catégories, création de sujets et de messages.
- **Temps Réel** : Notifications instantanées via WebSockets lors de nouveaux messages ou de modérations.
- **Administration & Modération** : 
  - Verrouillage/déverrouillage de sujets.
  - Suppression de messages.
  - Gestion des rôles utilisateurs (Passage admin/user).
  - Création et modification des catégories de forums.
- **Pagination** : Optimisation de l'affichage pour les grands volumes de sujets et messages.
- **Initialisation Automatique** : La base de données et les tables sont créées automatiquement au premier lancement.

## Pré-requis

- **Node.js** (v18+)
- **Serveur MySQL** local fonctionnel.

## Installation et démarrage

1. **Cloner le projet et installer les dépendances**
```bash
git clone https://github.com/Vivienhrm/nuxt_interactive_forum_project.git
cd nuxt_interactive_forum_project
npm install
```

2. **Configuration**
Renommez le fichier `.env.example` en `.env` et ajustez vos identifiants MySQL.

3. **Lancer le serveur de développement**
```bash
npm run dev
```
*Le script d'initialisation détectera automatiquement votre base de données et créera les tables nécessaires.*

## Informations de connexion par défaut

Pour tester les fonctionnalités d'administration dès le lancement, un compte admin est créé par défaut :
- **Utilisateur** : `admin`
- **Mot de passe** : `admin`

## Accès

- **Application Front-end** : `http://localhost:3000` (ou 3001 selon disponibilité)
- **API** : `http://localhost:3000/api/forums`
- **WebSocket** : `ws://localhost:3000/_ws`
