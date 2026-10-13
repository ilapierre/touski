# Base de données

## Modèle de base

Toutes les tables héritent de `Base` (`src/touski/db/database.py`) et ont donc:

| Colonne | Type | Description |
|---|---|---|
| `created_at` | `DateTime`, non nul | Date de création, remplie à l'insertion |
| `updated_at` | `DateTime`, non nul | Date de dernière modification, mise à jour à chaque `UPDATE` via l'ORM |

## Diagramme

> [!WARNING]  
> Ce schéma doit être mis à jour.

![Modèle d'objets](/assets/schema-bd.png)

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
| `users_restrictions` | Restrictions alimentaires d'un utilisateur (aliment et note) |
