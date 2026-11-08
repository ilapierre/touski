from typing import Annotated
from fastapi import APIRouter, Depends, Query, Request

from touski.db.database import get_session_dependency
from touski.models import Recipe
from touski.services.recipe_service import fetch_mealdb_recipes

# ROUTE RECETTES
router = APIRouter(prefix="/recipes", tags=["recipes"])

Limit = Annotated[int, Query(ge=1, le=100, description="Nombre max d'aliments")]
Offset = Annotated[int, Query(ge=0, description="Nombre d'aliments à sauter")]

# get toutes les recettes
@router.get("/")
def list_recipes(
    request: Request, limit: Limit = 50, offset: Offset = 0, session=Depends(get_session_dependency)
):
    query = session.query(Recipe)
    total = query.count()
    recipes = query.order_by(Recipe.id).limit(limit).offset(offset).all()

    base_url = str(request.base_url)

    # NOTE: Potentiellement utiliser une Pydantic
    results = []
    for recipe in recipes:
        recipe_dict = recipe.__dict__.copy()
        if recipe.image_url:
            # Construct full image URL
            recipe_dict["image_url"] = f"{base_url}static/images/{recipe.image_url}"
        results.append(recipe_dict)

    return {"total": total, "resultats": results}


# recherche recette par nom
@router.get("/recherche")
def search_recipe(
    request: Request,
    query: str,
    limit: Limit = 50,
    offset: Offset = 0,
    session=Depends(get_session_dependency),
):
    # TODO: Add error handling
    fetch_mealdb_recipes(query)

    matches = session.query(Recipe).filter(Recipe.name.like(f"%{query}%"))
    total = matches.count()
    recipes = matches.order_by(Recipe.id).limit(limit).offset(offset).all()

    base_url = str(request.base_url)

    # NOTE: Potentiellement utiliser une Pydantic
    results = []
    for recipe in recipes:
        recipe_dict = recipe.__dict__.copy()
        if recipe.image_url:
            # Construct full image URL
            recipe_dict["image_url"] = f"{base_url}static/images/{recipe.image_url}"
        results.append(recipe_dict)

    return {"recherche": query, "total": total, "resultats": results}


#post pour créer une recette
@router.post("/", status_code=201)
def create_recipe():
    return {"message": "Recette créée avec succès"}


#modif une recette
@router.put("/{recipe_id}")
def update_recipe(recipe_id: int):
    return {"message": f"Recette {recipe_id} mise à jour avec succès"}


#delete pour supprimer une recette
@router.delete("/{recipe_id}")
def delete_recipe(recipe_id: int):
    return {"message": f"Recette {recipe_id} supprimée avec succès"}


#génération d'une recette par l'IA (abonnement requis)
@router.post("/generer", status_code=201)
def generate_recipe_ai():
    return {"message": "Recette générée par l'IA"}
 

#get recette par id
@router.get("/{recipe_id}")
def get_recipe(recipe_id: int):
    return {"id": recipe_id}
 

#----------INGRÉDIENTS (RecetteAliments)----------#
 
#get ingrédients d'une recette
@router.get("/{recipe_id}/foods")
def list_ingredients(recipe_id: int):
    return []
 

#ajouter un ingrédient (quantité + unité)
@router.post("/{recipe_id}/foods", status_code=201)
def add_ingredient(recipe_id: int):
    return {"message": f"Ingrédient ajouté à la recette {recipe_id}"}
 

#modifier un ingrédient (quantité, unité)
@router.put("/{recipe_id}/foods/{food_id}")
def update_ingredient(recipe_id: int, food_id: int):
    return {"message": f"Ingrédient {food_id} de la recette {recipe_id} mis à jour"}
 

#retirer un ingrédient
@router.delete("/{recipe_id}/foods/{food_id}")
def remove_ingredient(recipe_id: int, food_id: int):
    return {"message": f"Ingrédient {food_id} retiré de la recette {recipe_id}"}
