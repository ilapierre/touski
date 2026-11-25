"""Les 14 allergènes réglementaires de l'UE, codés en dur (source de vérité: le backend).

Les clés sont les noms Open Food Facts sans le préfixe `en:` (ex. "nuts").
`users_restrictions` et `foods_restrictions` stockent cette clé.
"""

from enum import StrEnum


class Restriction(StrEnum):
    MILK = "milk"
    EGGS = "eggs"
    GLUTEN = "gluten"
    PEANUTS = "peanuts"
    NUTS = "nuts"
    SOYBEANS = "soybeans"
    FISH = "fish"
    CRUSTACEANS = "crustaceans"
    MOLLUSCS = "molluscs"
    CELERY = "celery"
    MUSTARD = "mustard"
    SESAME_SEEDS = "sesame-seeds"
    SULPHUR_DIOXIDE_AND_SULPHITES = "sulphur-dioxide-and-sulphites"
    LUPIN = "lupin"


# Libellés par langue, exposés tels quels par `GET /restrictions/`
LABELS: dict[Restriction, dict[str, str]] = {
    Restriction.MILK: {"fr": "Lait", "en": "Milk"},
    Restriction.EGGS: {"fr": "Œufs", "en": "Eggs"},
    Restriction.GLUTEN: {"fr": "Gluten", "en": "Gluten"},
    Restriction.PEANUTS: {"fr": "Arachides", "en": "Peanuts"},
    Restriction.NUTS: {"fr": "Fruits à coque", "en": "Tree nuts"},
    Restriction.SOYBEANS: {"fr": "Soja", "en": "Soy"},
    Restriction.FISH: {"fr": "Poisson", "en": "Fish"},
    Restriction.CRUSTACEANS: {"fr": "Crustacés", "en": "Crustaceans"},
    Restriction.MOLLUSCS: {"fr": "Mollusques", "en": "Molluscs"},
    Restriction.CELERY: {"fr": "Céleri", "en": "Celery"},
    Restriction.MUSTARD: {"fr": "Moutarde", "en": "Mustard"},
    Restriction.SESAME_SEEDS: {"fr": "Sésame", "en": "Sesame"},
    Restriction.SULPHUR_DIOXIDE_AND_SULPHITES: {"fr": "Sulfites", "en": "Sulphites"},
    Restriction.LUPIN: {"fr": "Lupin", "en": "Lupin"},
}


def parse_off_tag(tag) -> Restriction | None:
    """`en:milk` -> `Restriction.MILK`. Retourne `None` si le tag n'est pas un des 14."""
    if not isinstance(tag, str) or not tag.lower().startswith("en:"):
        return None

    try:
        return Restriction(tag[3:].strip().lower())
    except ValueError:
        return None
