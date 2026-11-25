---
title: Scraper
parent: Base de données
nav_order: 2
---

# Scraper (Open Food Facts)

Le scraper importe des aliments dans la table `Food` à partir d'un export JSONL d'[Open Food Facts](https://world.openfoodfacts.org/data) (un produit JSON par ligne).

Code : `src/touski/scripts/scraper.py`, exposé par la commande `scrape` dans `pyproject.toml` :

```toml
[project.scripts]
scrape = "touski.scripts:scraper.main"
```

## Utilisation

Prérequis : `.env` configuré (`DATABASE_URL`) et migrations appliquées (`make migrate`). Voir [Installation]({{ site.baseurl }}{% link installation.md %}).

```bash
uv run scrape -f docs/assets/openfoodsfacts_sample.jsonl  # 100 premières lignes (défaut)
uv run scrape -f foods.jsonl -m 5000        # 5000 premières lignes
uv run scrape -f foods.jsonl -m 0           # tout le fichier
```

| Option | Description |
|---|---|
| `-f`, `--file` | Fichier JSONL à traiter (obligatoire). |
| `-m`, `--max` | Nombre max de lignes à lire (défaut : `100`, `0` = aucune limite). |

> Le dump complet d'Open Food Facts pèse plusieurs dizaines de Go. Utiliser `docs/assets/openfoodsfacts_sample.jsonl` (extrait du dump) pour le développement. Comme tous les produits sont gardés en mémoire avant l'insertion, éviter `-m 0` sur le dump complet.

## Fonctionnement

1. Lecture du fichier ligne par ligne.
2. Les produits sans `product_name` sont ignorés.
3. Extraction des macros selon le format du produit (sinon le produit est ignoré) :
   - `nutriments` (ancien format) → `extract_macros_old()`, valeurs pour `100g`.
   - `nutrition.aggregated_set.nutrients` (nouveau format) → `extract_macros()`, valeurs converties en grammes.
4. Construction de l'URL de l'image avec `extract_image_url()`.
5. Insertion de tous les objets `Food` dans une seule transaction.

## Champs remplis

| Champ `Food` | Source |
|---|---|
| `name` | `product_name` |
| `per` | `"100g"` ou `nutrition.aggregated_set.per` |
| `kcal` | `energy-kcal` |
| `fat`, `carbohydrates`, `proteins` | `fat`, `carbohydrates`, `proteins` |
| `values` | Objet nutritionnel brut (`nutriments` ou `nutrition`) |
| `off_id` | `code` (code-barres, texte). Les produits déjà en BD sont ignorés |
| `brand` | `brands` (séparées par des virgules) |
| `description` | `generic_name_fr`, sinon `generic_name`, sinon `generic_name_en` |
| `quantity` | `quantity` (ex. `350 g`), sinon `product_quantity` + `product_quantity_unit` |
| `serving_size` | `serving_size` |
| `nutriscore` | `nutriscore_grade` (`A` à `E`, `None` si inconnu) |
| `origin` | `origins_tags` (ex. `France, Spain`) |
| `allergens` | `allergens_tags` sans préfixe de langue (ex. `["milk", "nuts"]`) |
| `source` | URL de la page du produit (`https://world.openfoodfacts.org/product/{code}`) |

Ces champs sont normalisés par `normalize_off_details()` : les valeurs vides ou inconnues (`""`, `unknown`, `not-applicable`, `en:null`) deviennent `None`, les textes sont nettoyés (espaces) et tronqués à la taille de la colonne.
| `image_url` | Image de face du produit (voir ci-dessous) |

## URL d'image

Construite à partir de `code` et `images.selected.front` (langue du produit `lc` en priorité, sinon la première disponible) :

```
https://images.openfoodfacts.org/images/products/{chemin}/front_{langue}.{rev}.400.jpg
```

Le code-barres est complété à 13 chiffres puis découpé en `3/3/3/reste` (ex. `0000101209159` → `000/010/120/9159`). Si le produit n'a pas d'image de face, `image_url` vaut `None`.
