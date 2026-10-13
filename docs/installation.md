# Installation

## Prérequis

- [uv](https://docs.astral.sh/uv/) (backend, gestion des paquets Python)
- [Node.js](https://nodejs.org/en/download) et npm (frontend)

## Backend

1. À la racine du projet, créer le fichier `.env` à partir du modèle :
```bash
cp .env.template .env
```

2. Remplir les variables du `.env` :

| Variable | Description |
|---|---|
| `ENVIRONMENT` | Nom de l'environnement |
| `DATABASE_URL` | URL de connexion à la base de données (ex. `sqlite:///touski.db`) |
| `SECRET_KEY` | Clé secrète |


3. Installer les dépendances et créer les tables:
```bash
uv sync
```

4. Créer les tables:
```bash
make migrate
```

5. Lancer le backend:
```bash
make run
```

## Frontend
Installer et démarrer l'application web:
```bash
cd frontend/touski
npm install
npm run dev
```

## Commandes
Les commandes disponibles sont définies dans le `Makefile` à la racine du projet. Elles sont exécutables à partir du préfixe `make` (ex: `make run`)
