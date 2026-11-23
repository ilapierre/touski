---
title: Base de données
nav_order: 4
has_children: true
---

# Base de données

## Modèle de base

Toutes les tables héritent de `Base` (`src/touski/db/database.py`) et ont donc:

| Colonne | Type | Description |
|---|---|---|
| `created_at` | `DateTime`, non nul | Date de création, remplie à l'insertion |
| `updated_at` | `DateTime`, non nul | Date de dernière modification, mise à jour à chaque `UPDATE` via l'ORM |

## Diagramme

Les colonnes `created_at` et `updated_at` (voir plus haut) sont présentes sur toutes les tables et omises du diagramme.

```mermaid
erDiagram
    users ||--o{ groups_users : "est membre"
    groups ||--o{ groups_users : "a des membres"
    groups ||--o{ groups_foods : "possède"
    foods ||--o{ groups_foods : "stocké dans"
    groups ||--o{ groups_recipes : "possède"
    recipes ||--o{ groups_recipes : "enregistrée dans"
    recipes ||--o{ recipes_foods : "contient"
    foods ||--o{ recipes_foods : "utilisé dans"
    groups ||--o{ subscriptions : "souscrit"
    subscriptions ||--o{ payments : "réglé par"
    users ||--o{ payments : "effectue"
    users ||--o{ users_restrictions : "a"
    foods ||--o{ foods_restrictions : "a"

    users {
        int id PK
        string name "30"
        string email UK "50"
        string hashed_password "255"
        bool is_admin "défaut false"
    }

    groups {
        int id PK
        string name "20"
    }

    groups_users {
        int id PK
        int group_id FK
        int user_id FK
        string nickname "nullable, 30"
        enum role "owner, admin, privileged, standard"
    }

    foods {
        int id PK
        string name "255"
        string off_id UK "nullable, code Open Food Facts"
        string source "nullable"
        string brand "nullable"
        text description "nullable"
        string image_url "nullable"
        string origin "nullable"
        string quantity "nullable"
        string serving_size "nullable"
        string per "nullable"
        int kcal "nullable"
        int fat "nullable"
        int proteins "nullable"
        int carbohydrates "nullable"
        json values "nullable"
        string nutriscore "nullable, 1 caractère"
    }

    groups_foods {
        int id PK
        int group_id FK
        int food_id FK
        datetime expires_at "nullable"
    }

    recipes {
        int id PK
        string name "255"
        bool is_ai
        string source "50"
        int mealdb_id UK "nullable"
        string image_url "nullable, 100"
        text instructions "nullable"
        json ingredients "nullable"
    }

    groups_recipes {
        int id PK
        int group_id FK
        int recipe_id FK
    }

    recipes_foods {
        int id PK
        int recipe_id FK
        int food_id FK
        decimal quantity
        string unity "20"
    }

    subscriptions {
        int id PK
        int group_id FK
        enum status "active, cancelled, expired"
        datetime ends_at
    }

    payments {
        int id PK
        int user_id FK
        int subscription_id FK
        decimal amount
        enum status "pending, paid, failed"
    }

    users_restrictions {
        int user_id PK, FK
        string restriction PK "32, clé de Restriction"
    }

    foods_restrictions {
        int food_id PK, FK
        string restriction PK "32, clé de Restriction"
        string kind "contains ou may_contain"
    }
```

## Tables

| Table | Rôle |
|---|---|
| `users` | Utilisateurs (nom, courriel unique, `is_admin`) |
| `groups` | Groupes d'utilisateurs (ex. un foyer) |
| `groups_users` | Membres d'un groupe, avec surnom et rôle (`owner`, `admin`, `privileged`, `standard`) |
| `foods` | Aliments (nom, valeurs nutritives en JSON) |
| `groups_foods` | Aliments d'un groupe, avec la date d'expiration `expires_at` (nullable) |
| `recipes` | Recettes (nom, `is_ai`, source) |
| `groups_recipes` | Recettes d'un groupe |
| `recipes_foods` | Ingrédients d'une recette (quantité et unité) |
| `subscriptions` | Abonnement d'un groupe (statut : `active`, `cancelled`, `expired`, et `ends_at`) |
| `payments` | Paiements d'un utilisateur pour un abonnement (montant, statut : `pending`, `paid`, `failed`) |
| `users_restrictions` | Restrictions (allergènes) d'un utilisateur: clé courte `restriction` (ex. `nuts`), clé primaire (`user_id`, `restriction`) |
| `foods_restrictions` | Allergènes d'un aliment: `restriction` et `kind` (`contains` ou `may_contain`), clé primaire (`food_id`, `restriction`) |

## Restrictions alimentaires

Les 14 allergènes réglementaires de l'UE sont codés en dur dans `src/touski/restrictions.py` (enum `Restriction`: `milk`, `eggs`, `gluten`, `peanuts`, `nuts`, `soybeans`, `fish`, `crustaceans`, `molluscs`, `celery`, `mustard`, `sesame`, `sulphites`, `lupin`). Il n'y a pas de table de référence: `users_restrictions` et `foods_restrictions` stockent la clé courte en `varchar`, validée par l'enum (API) et par le scraper.

Les tags Open Food Facts sont convertis par `parse_off_tag()` (insensible à la casse et aux accents, ignore le préfixe de langue, accepte des synonymes comme `en:sesame-seeds` ou `fr:lait`). Les tags inconnus sont ignorés.

Un aliment est sécuritaire pour un groupe si aucune des restrictions de ses membres n'y apparaît (voir `services/restriction_service.py`).
