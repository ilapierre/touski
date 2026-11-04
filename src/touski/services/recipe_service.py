import requests
from touski.core.config import ENVIRONMENT
from sqlalchemy import insert

from touski.db.database import get_session
from touski.models import Recipe


def fetch_mealdb_recipes(query: str) -> list[dict]:
    res = requests.get(
        f"https://www.themealdb.com/api/json/v1/1/search.php?s={query}",
    )

    recipes = res.json().get("meals")

    if not recipes:
        return []

    save_mealdb_recipes(recipes)

    return recipes


def save_mealdb_recipes(recipes: list[dict]):
    to_save = []
    for r in recipes:
        to_save = [
            {
                "name": r.get("strMeal"),
                "is_ai": False,
                "source": "https://www.themealdb.com",
                "mealdb_id": r.get("idMeal"),
            }
            for r in recipes
        ]

    with get_session() as session:
        # La syntaxe de IGNORE sur MySQL est différente de SQLite
        stmt = (
            insert(Recipe).prefix_with("IGNORE").values(to_save)
            if ENVIRONMENT == "prod"
            else insert(Recipe).prefix_with("OR IGNORE").values(to_save)
        )
        session.execute(stmt)
        session.commit()
