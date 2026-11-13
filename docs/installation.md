---
title: Installation
nav_order: 2
---

# Installation

## Prérequis

- [uv](https://docs.astral.sh/uv/) (backend, gestion des paquets Python)
- [Node.js](https://nodejs.org/en/download) et npm (frontend)

## Backend
### Local
1. À la racine du projet, créer le fichier `.env` à partir du modèle :
macOS / Linux / PowerShell:
```bash
cp .env.template .env
```

Invite de commandes Windows (cmd):
```bat
copy .env.template .env
```

2. Remplir les variables du `.env` :

| Variable | Description |
|---|---|
| `ENVIRONMENT` | Nom de l'environnement (`prod`, `dev` ou `test`) |
| `DATABASE_URL` | URL de connexion à la base de données |
| `SECRET_KEY` | Clé secrète |

Touski utilise MySQL pour la production ou SQLite pour le développement. Le dialecte est déterminé par `DATABASE_URL`. `ENVIRONMENT` doit rester cohérent avec celui-ci : la valeur `prod` active la syntaxe SQL de MySQL pour certaines requêtes, toute autre valeur utilise celle de SQLite.
```bash
# MySQL
DATABASE_URL="mysql+pymysql://<user>:<password>@<host>:<port>/<db>"

# SQLite
DATABASE_URL="sqlite:///touski.db"
```

3. Installer les dépendances:
```bash
uv sync
```

4. Créer les tables:
```bash
uv run alembic upgrade head
```

5. Lancer le backend:
```bash
uv run fastapi run src/touski/main.py --port 8080
```

> [!NOTE]  
> Pour lancer l'application en mode développement:
> `uv run fastapi dev src/touski/main.py --port 8080`

### Docker
TODO

## Frontend
Le frontend communique avec le backend sur le port 8080: le backend doit être démarré (dans un autre terminal) avant d'utiliser l'application.

Installer et démarrer l'application web:
```bash
cd frontend
npm install
npm run dev
```

## Commandes (optionnel)
Un `Makefile` à la racine du projet regroupe ces commandes en raccourcis. Make n'est pas nécessaire pour utiliser Touski.

| Commande | Équivalent |
|---|---|
| `make migrate` | `uv run alembic upgrade head` |
| `make run-app` | `uv sync && uv run fastapi run src/touski/main.py --port 8080` |
| `make run-dev` | `uv sync && uv run fastapi dev src/touski/main.py --port 8080` |
| `make run-frontend` | `cd frontend && npm install && npm run dev` |
| `make makemigrations` | `uv run alembic revision --autogenerate` |
| `make downgrade` | `uv run alembic downgrade -1` |

> [!NOTE]  
> Make n'est pas installé par défaut sur Windows. Les `&&` des équivalents ci-dessus ne fonctionnent pas dans Windows PowerShell 5.1 (PowerShell 7 et cmd les supportent).
>
> Make peut être ajouté avec `winget install ezwinports.make`, `choco install make` ou `scoop install make`, ou utilisé via WSL.
