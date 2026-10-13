# Architecture

## Vue d'ensemble

Le projet est divisé en deux parties :

- **Backend** (Python) dans `src/touski/`, avec FastAPI et SQLAlchemy.
- **Frontend** (React + Vite) dans `frontend/touski/`.

## Backend

```
src/touski/
├── main.py
├── core/
│   └── config.py
├── db/
│   ├── database.py
│   └── utils.py
└── models/
```

- **`core/config.py`**: Charge le fichier d'environnement `.env` et expose ses variables. Le programme s'arrête si le fichier ou une variable est
  manquant.
- **`db/database.py`**: Définit modèle de base `Base`, dont héritent tous les modèles. Gère également les sessions et les connexions à la BD.
- **`models/`**: Contient les tables. Tous les modèles doivent être importés dans `models/__init__.py` afin de faciliter l'import.

## Base de données

Le schéma est géré avec Alembic (voir [migrations.md](migrations.md)). Le schéma des tables est décrit dans [database.md](database.md).

## Frontend

N/A
