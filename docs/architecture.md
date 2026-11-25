---
title: Architecture
nav_order: 3
---

# Architecture

## Vue d'ensemble

Le projet est divisé en deux parties :

- **Backend** (Python) dans `src/touski/`, avec FastAPI et SQLAlchemy.
- **Frontend** (React + Vite) dans `frontend/`.

```
Navigateur ──► Frontend (Vite, React) ──/api──► Backend (FastAPI :8080) ──► BD (SQLite ou MySQL)
                                                      │
                                                      ├──► APIs externes (TheMealDB)
                                                      └──► static/ (images)
```

## Backend

```
src/touski/
├── main.py
├── core/
│   ├── config.py
│   ├── dependencies.py
│   └── security.py
├── db/
│   └── database.py
├── models/
├── routers/
├── services/
└── scripts/
    └── scraper.py
```

**Notables:**
- **`main.py`**: Crée l'application FastAPI, enregistre les routers et expose le dossier `static/` sous `/static`. Le dossier `static/` est résolu à partir du répertoire courant : le backend doit donc être lancé depuis la racine du projet.
- **`static/`**: Stockage de données statiques (ex: images, fichiers, etc.).
- **`core/config.py`**: Charge le fichier d'environnement `.env` et expose ses variables. Le programme s'arrête si le fichier ou une variable est manquant.
- **`db/database.py`**: Définit le modèle de base `Base`, dont héritent tous les modèles, ainsi que l'engine et les sessions. Le dialecte (SQLite ou MySQL) est déduit de `DATABASE_URL`.
- **`models/`**: Contient les tables. Tous les modèles doivent être importés dans `models/__init__.py` afin de faciliter l'import.
- **`routers/`**: Un fichier par ressource (voir [Routes](#routes)).
- **`services/`**: Logique métier et accès aux ressources externes (voir [Services](#services)).
- **`scripts/`**: Commandes exécutables en dehors du serveur, comme le [scraper]({{ site.baseurl }}{% link scraper.md %}).

### Routes

| Préfixe | Fichier | Contenu |
|---|---|---|
| `/auth` | `routers/auth.py` | Inscription, connexion, déconnexion, utilisateur courant |
| `/users` | `routers/users.py` | Gestion des utilisateurs, de leur profil, de leurs groupes et de leurs allergies |
| `/foods` | `routers/foods.py` | CRUD des aliments |
| `/recipes` | `routers/recipes.py` | CRUD des recettes, génération de recettes |
| `/groupes` | `routers/groupes.py` | CRUD des groupes et gestion de leurs membres |
| `/abonnements` | `routers/abonnements.py` | Abonnements utilisateurs |

La liste complète des routes est disponible via l'adresse `/docs` (Swagger) lorsque le backend est démarré, par exemple `http://127.0.0.1:8080/docs`.

## Base de données

Le schéma est géré avec Alembic (voir [Migrations]({{ site.baseurl }}{% link migrations.md %})). Le schéma des tables est décrit dans [Base de données]({{ site.baseurl }}{% link database.md %}).

Touski supporte deux dialectes : SQLite (développement) et MySQL (production). Le code et les migrations doivent fonctionner sur les deux. Cette compatibilité est vérifiée par le workflow GitHub Actions `migrations.yml`.

## Frontend

```
frontend/src/
├── main.jsx
├── App.jsx
├── components/
└── pages/
```

- **`App.jsx`**: Déclare les routes de l'application (React Router). La route `/profil` est protégée : sans jeton dans le `localStorage`, l'utilisateur est redirigé vers `/connexion`.
- **`pages/`**: Une page par route (`Landing`, `Foods`, `Recipes`, `Connexion`, `Inscription`, `Profil`, `groupes`, `Abonnement`).
- **`components/`**: Composants réutilisables (`TopBar`, `FoodCard`, `FoodModal`, `RecipeCard`, `RecipeModal`).

En développement, Vite redirige les appels vers le backend (`frontend/vite.config.js`) :

| Préfixe côté frontend | Destination |
|---|---|
| `/api/*` | `http://127.0.0.1:8080/*` (le préfixe `/api` est retiré) |
| `/static/*` | `http://127.0.0.1:8080/static/*` |

Le backend doit donc tourner sur le port 8080 pour que le frontend fonctionne.
