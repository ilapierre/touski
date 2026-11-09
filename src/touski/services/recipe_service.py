import requests
from touski.core.config import ENVIRONMENT
from sqlalchemy import insert, select

from touski.db.database import get_session
from touski.models import Recipe
from touski.services.static_service import store_image_from_url


def normalize_meal_db_ingredients(recipe: dict) -> list[dict] | None:
    # Formatte le format des ingrédients MealDB pour Touski
    # MealDB expose jusqu'à 20 paires strIngredientN / strMeasureN, vides ou None si inutilisées
    # Format: [{"name": "olive oil", "measure": "1/4 cup"}, ...]
    ingredients = []
    for i in range(1, 21):
        name = (recipe.get(f"strIngredient{i}") or "").strip()
        if not name:
            continue

        measure = (recipe.get(f"strMeasure{i}") or "").strip()
        ingredients.append({"name": name, "measure": measure})

    # Retourne None si aucun ingrédient
    return ingredients or None


def fetch_mealdb_recipes(query: str) -> list[dict]:
    res = requests.get(
        f"https://www.themealdb.com/api/json/v1/1/search.php?s={query}",
    )

    recipes = res.json().get("meals")

    if not recipes:
        return []

    new_recipes = filter_new_mealdb_recipes(recipes)

    if new_recipes:
        save_mealdb_recipes(new_recipes)

    return recipes


def filter_new_mealdb_recipes(recipes: list[dict]) -> list[dict]:
    ids = [r.get("idMeal") for r in recipes if r.get("idMeal")]

    if not ids:
        return []

    with get_session() as session:
        existing = {
            str(mealdb_id)
            for mealdb_id in session.execute(
                select(Recipe.mealdb_id).where(Recipe.mealdb_id.in_(ids))
            ).scalars()
        }

    return [r for r in recipes if str(r.get("idMeal")) not in existing]


def save_mealdb_recipes(recipes: list[dict]):
    to_save = []
    for r in recipes:
        if image_url := r.get("strMealThumb"):
            image_url = store_image_from_url(image_url)

        to_save.append(
            {
                "name": r.get("strMeal"),
                "is_ai": False,
                "source": "https://www.themealdb.com",
                "mealdb_id": r.get("idMeal"),
                "image_url": image_url,
                "instructions": r.get("strInstructions"),
                "ingredients": normalize_meal_db_ingredients(r),
            }
        )

    with get_session() as session:
        # La syntaxe de IGNORE sur MySQL est différente de SQLite
        stmt = (
            insert(Recipe).prefix_with("IGNORE").values(to_save)
            if ENVIRONMENT == "prod"
            else insert(Recipe).prefix_with("OR IGNORE").values(to_save)
        )
        session.execute(stmt)
        session.commit()
