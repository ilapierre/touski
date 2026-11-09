from touski.services.static_service import store_image_from_url
from touski.db.database import get_session
from touski.models import Food
import argparse
import json


def scrape_data(file_path: str, extract_size: int | None = None):
    foods = []

    # Extraction des données
    with open(file_path, "r") as f:
        session = get_session()

        for i, line in enumerate(f):
            data = json.loads(line)

            name = data.get("product_name", None)

            if not name:
                continue

            if nutriments := data.get("nutriments"):
                macros = extract_macros_old(nutriments)
            elif nutrition := data.get("nutrition"):
                macros = extract_macros(nutrition)
            else:
                continue

            if image_url := extract_image_url(data):
                image_url = store_image_from_url(image_url, "foods")

            foods.append(
                Food(
                    name=name,
                    image_url=image_url,
                    **(macros or {}),
                    **normalize_off_details(data),
                )
            )

            if extract_size:
                print(f"Add: {i + 1}/{extract_size}")

                if i >= extract_size:
                    break
                i += 1

        f.close()

    # Ajout à la BD
    with get_session() as session:
        for i, f in enumerate(foods):
            session.add(f)

            if extract_size:
                print(f"Add: {i + 1}/{extract_size}")

                if i >= extract_size:
                    break
                i += 1

        session.commit()


def extract_image_url(data: dict, size: str = "400") -> str | None:
    code = data.get("code")
    front = data.get("images", {}).get("selected", {}).get("front")
    if not code or not front:
        return None

    # Langue du produit en priorité, sinon la première disponible
    image = front.get(data.get("lc")) or next(iter(front.values()), None)
    if not image or "rev" not in image:
        return None

    # Le code est découpé en 3/3/3/reste (ex: 000/010/120/9159) quand il a plus de 8 chiffres
    code = code.zfill(13)
    path = (
        "/".join([code[0:3], code[3:6], code[6:9], code[9:]]) if len(code) > 8 else code
    )
    lang = next(k for k, v in front.items() if v is image)

    return f"https://images.openfoodfacts.org/images/products/{path}/front_{lang}.{image['rev']}.{size}.jpg"


def extract_macros_old(nutriments: dict) -> dict:
    kcal = nutriments.get("energy-kcal")
    fat = nutriments.get("fat")
    proteins = nutriments.get("proteins")
    carbohydrates = nutriments.get("carbohydrates")

    return {
        "per": "100g",
        "kcal": kcal,
        "fat": fat,
        "proteins": proteins,
        "carbohydrates": carbohydrates,
        "values": nutriments,
    }


def nutrient_in_grams(nutrient: dict) -> float | None:
    # Convertit un nutriment du nouveau format OFF ({"value": 36, "unit": "g"}) en grammes
    value = nutrient.get("value")
    if value is None:
        return None

    factor = {"g": 1, "mg": 1e-3, "µg": 1e-6, "mcg": 1e-6}.get(nutrient.get("unit"), 1)
    return round(value * factor, 3)


def extract_macros(nutrition: dict) -> dict | None:
    aggregated = nutrition.get("aggregated_set")
    if not aggregated:
        return None

    # Les nutriments sont sous aggregated_set["nutrients"]
    nutrients = aggregated.get("nutrients")
    if not nutrients:
        return None

    try:
        kcal = nutrients["energy-kcal"]["value"]
        fat = nutrient_in_grams(nutrients["fat"])
        carbohydrates = nutrient_in_grams(nutrients["carbohydrates"])
        proteins = nutrient_in_grams(nutrients["proteins"])
    except KeyError:
        return None

    if None in (kcal, fat, carbohydrates, proteins):
        return None

    return {
        "per": aggregated.get("per"),
        "kcal": kcal,
        "fat": fat,
        "carbohydrates": carbohydrates,
        "proteins": proteins,
        "values": nutrition,
    }


# Valeurs OFF qui signifient "inconnu"
UNKNOWN_VALUES = {"", "unknown", "not-applicable", "null"}


def clean_text(value, max_length: int | None = None) -> str | None:
    if not isinstance(value, str):
        return None

    value = " ".join(value.split())
    if value.lower() in UNKNOWN_VALUES:
        return None

    return value[:max_length] if max_length else value


def clean_tags(tags) -> list[str]:
    # ["en:nuts", "en:milk"] -> ["nuts", "milk"] (sans doublons ni valeurs inconnues)
    if not isinstance(tags, list):
        return []

    names = []
    for tag in tags:
        name = str(tag).split(":", 1)[-1].strip()
        if name.lower() not in UNKNOWN_VALUES and name not in names:
            names.append(name)

    return names


def normalize_off_details(data: dict) -> dict:
    # Formatte les informations d'un produit OFF pour Touski (None si absent ou inconnu)

    # Marques séparées par des virgules
    brands = [b.strip() for b in str(data.get("brands") or "").split(",") if b.strip()]

    # "350 g" sinon construit à partir de la quantité et de l'unité
    quantity = clean_text(data.get("quantity"), 50)
    if not quantity and data.get("product_quantity") and data.get("product_quantity_unit"):
        try:
            quantity = f"{float(data['product_quantity']):g} {data['product_quantity_unit']}"
        except (TypeError, ValueError):
            quantity = None

    nutriscore = (clean_text(data.get("nutriscore_grade")) or "").upper()

    # Description dans la langue de l'interface en priorité
    description = next(
        (
            text
            for key in ("generic_name_fr", "generic_name", "generic_name_en")
            if (text := clean_text(data.get(key)))
        ),
        None,
    )

    # "en:united-states" -> "United States"
    origin = ", ".join(
        name.replace("-", " ").title() for name in clean_tags(data.get("origins_tags"))
    )

    return {
        "brand": ", ".join(brands)[:255] or None,
        "description": description,
        "quantity": quantity,
        "serving_size": clean_text(data.get("serving_size"), 50),
        "nutriscore": nutriscore if nutriscore in ("A", "B", "C", "D", "E") else None,
        "origin": origin[:255] or None,
        "allergens": clean_tags(data.get("allergens_tags")) or None,
    }


def main():
    parser = argparse.ArgumentParser(
        description="Extraire des données de produits 'Open Food Facts' à partir d'un fichier JSONL"
    )
    parser.add_argument("-f", "--file", help="Le fichier à processer", required=True)
    parser.add_argument(
        "-m",
        "--max",
        help="Le nombre max de produits à processer",
        default=100,
        type=int,
    )

    args = parser.parse_args()
    scrape_data(args.file, extract_size=args.max)
