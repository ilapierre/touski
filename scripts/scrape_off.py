from touski.db.database import get_session
from touski.models import Food
from pathlib import Path
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

            foods.append(
                Food(
                    name=name,
                    **macros,
                )
                if macros
                else Food(name=name)
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


def extract_macros(nutrition: dict) -> dict | None:
    nutrients = nutrition.get("aggregated_set")
    if not nutrients:
        return None

    per = nutrition["aggregated_set"]["per"]

    try:
        kcal_val = nutrients["energy-kcal"]
        fat_val = nutrients["fat"]
        carbohydrates_val = nutrients["carbohydrates"]
        proteins_val = nutrients["proteins"]
    except KeyError:
        return None

    kcal = kcal_val["value"]
    fat = str(fat_val["value"]) + fat_val["unit"]
    carbohydrates = str(carbohydrates_val["value"]) + carbohydrates_val["unit"]
    proteins = str(proteins_val["value"]) + proteins_val["unit"]

    return {
        "per": per,
        "kcal": kcal,
        "fat": fat,
        "carbohydrates": carbohydrates,
        "proteins": proteins,
        "values": nutrition,
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Extraire des données de produits 'Open Food Facts' à partir d'un fichier JSONL")
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
