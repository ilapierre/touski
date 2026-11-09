from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query, Request

from touski.db.database import get_session_dependency
from touski.models import Recipe
from touski.services.recipe_service import fetch_mealdb_recipes
from touski.services.static_service import with_image_url

router = APIRouter(prefix="/recipes", tags=["recipes"])

Limit = Annotated[int, Query(ge=1, le=100, description="Nombre max de recettes")]
Offset = Annotated[int, Query(ge=0, description="Nombre de recettes à sauter")]


# GET les recettes (paginées), avec le total pour calculer le nombre de pages
@router.get("/")
def list_recipes(
    request: Request,
    q: Annotated[str | None, Query(description="Recherche par nom")] = None,
    limit: Limit = 50,
    offset: Offset = 0,
    session=Depends(get_session_dependency),
):
    query = session.query(Recipe)
    if q:
        # Importe d'abord les recettes correspondantes depuis MealDB
        fetch_mealdb_recipes(q)
        query = query.filter(Recipe.name.like(f"%{q}%"))
    total = query.count()
    recipes = query.order_by(Recipe.id).limit(limit).offset(offset).all()

    base_url = str(request.base_url)

    return {
        "limit": limit,
        "offset": offset,
        "total": total,
        "recipes": [with_image_url(r, base_url) for r in recipes],
    }


# GET Recette par ID
@router.get("/{recipe_id}")
def get_recipe(
    recipe_id: int, request: Request, session=Depends(get_session_dependency)
):
    if recipe := session.get(Recipe, recipe_id):
        return {"recipe": with_image_url(recipe, str(request.base_url))}

    raise HTTPException(404, detail="Recipe not found")


# TODO: ------ Les endpoints suivants nécessitent l'authentification ------


# POST Créer une recette
@router.post("/", status_code=201)
def create_recipe():
    return {"message": "Recette créée avec succès"}


# PUT Modifier une recette
@router.put("/{recipe_id}")
def update_recipe(recipe_id: int):
    return {"message": f"Recette {recipe_id} mise à jour avec succès"}


# DELETE Supprimer une recette
@router.delete("/{recipe_id}")
def delete_recipe(recipe_id: int):
    return {"message": f"Recette {recipe_id} supprimée avec succès"}


# POST Génération d'une recette par l'IA (abonnement requis)
@router.post("/generer", status_code=201)
def generate_recipe_ai():
    return {"message": "Recette générée par l'IA"}


# POST Ajouter un ingrédient (quantité + unité)
@router.post("/{recipe_id}/foods", status_code=201)
def add_ingredient(recipe_id: int):
    return {"message": f"Ingrédient ajouté à la recette {recipe_id}"}


# PUT Modifier un ingrédient (quantité, unité)
@router.put("/{recipe_id}/foods/{food_id}")
def update_ingredient(recipe_id: int, food_id: int):
    return {"message": f"Ingrédient {food_id} de la recette {recipe_id} mis à jour"}


# DELETE Retirer un ingrédient
@router.delete("/{recipe_id}/foods/{food_id}")
def remove_ingredient(recipe_id: int, food_id: int):
    return {"message": f"Ingrédient {food_id} retiré de la recette {recipe_id}"}
