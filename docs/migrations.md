# Migrations (Alembic)

Les changements de schéma de la base de données (migrations) sont gérés avec Alembic.

## Comment modifier un modèle

1. Modifier un modèle dans `src/touski/models/`.
2. `make makemigrations` : génère une migration à partir des changements.
3. Vérifier le fichier généré dans `alembic/versions/`.
4. `make migrate` : applique la migration.

## Fichiers Alembic

```
alembic.ini
alembic/
├── env.py
├── script.py.mako
└── versions/
    └── 2026_10_13_1725-e6687aa20b56_.py
```

| Fichier | Rôle |
|---|---|
| `alembic.ini` | Configuration d'Alembic: emplacement du dossier `alembic/`, format du nom des fichiers de migration (`file_template`) et configuration des logs. |
| `alembic/env.py` | Script exécuté à chaque commande Alembic. Il lit `DATABASE_URL` depuis `touski.core.config`, importe les modèles et donne `Base.metadata` à Alembic. |
| `alembic/script.py.mako` | Gabarit utilisé pour créer chaque nouveau fichier de migration. Rarement modifié. |
| `alembic/versions/` | Une migration par fichier, avec `upgrade()` et `downgrade()`. Chaque fichier contient la date de la migration suivie d'un identifiant unique. |

