from typing import Annotated
from fastapi import APIRouter, Depends, Query

from touski.db.database import get_session_dependency

# ROUTE RECETTES
router = APIRouter(prefix="/recipes", tags=["recipes"])

Limit = Annotated[int, Query(ge=1, le=100, description="Nombre max d'aliments")]
Offset = Annotated[int, Query(ge=0, description="Nombre d'aliments à sauter")]

# get toutes les recettes
@router.get("/")
def list_recipes(
    limit: Limit = 50, offset: Offset = 0, session=Depends(get_session_dependency())
):
    query = session.query(Recet)
    total = query.count()
    foods = query.order_by(Food.id).limit(limit).offset(offset).all()
    return {"total": total, "resultats": foods}

#recherhce recette par nom
@router.get("/recherche")
def search_recipe(nom: str):
    return {"recherche": nom, "resultats": []}
 
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
