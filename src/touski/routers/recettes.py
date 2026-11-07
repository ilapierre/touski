from fastapi import APIRouter

#ROUTE RECETTES 
router = APIRouter(prefix="/recettes", tags=["recettes"])

#get toutes les recettes
@router.get("/")
def list_recettes():
    return []

#recherhce recette par nom
@router.get("/recherche")
def rechercher_recette(nom: str):
    return {"recherche": nom, "resultats": []}
 
#post pour créer une recette
@router.post("/", status_code=201)
def create_recette():
    return {"message": "Recette créée avec succès"}

#modif une recette
@router.put("/{recette_id}")
def update_recette(recette_id: int):
    return {"message": f"Recette {recette_id} mise à jour avec succès"}

#delete pour supprimer une recette
@router.delete("/{recette_id}")
def delete_recette(recette_id: int):
    return {"message": f"Recette {recette_id} supprimée avec succès"}

#génération d'une recette par l'IA (abonnement requis)
@router.post("/generer", status_code=201)
def generer_recette_ia():
    return {"message": "Recette générée par l'IA"}
 
#get recette par id
@router.get("/{recette_id}")
def get_recette(recette_id: int):
    return {"id": recette_id}
 

#----------INGRÉDIENTS (RecetteAliments)----------#
 
#get ingrédients d'une recette
@router.get("/{recette_id}/aliments")
def list_ingredients(recette_id: int):
    return []
 
#ajouter un ingrédient (quantité + unité)
@router.post("/{recette_id}/aliments", status_code=201)
def add_ingredient(recette_id: int):
    return {"message": f"Ingrédient ajouté à la recette {recette_id}"}
 
#modifier un ingrédient (quantité, unité)
@router.put("/{recette_id}/aliments/{aliment_id}")
def update_ingredient(recette_id: int, aliment_id: int):
    return {"message": f"Ingrédient {aliment_id} de la recette {recette_id} mis à jour"}
 
#retirer un ingrédient
@router.delete("/{recette_id}/aliments/{aliment_id}")
def remove_ingredient(recette_id: int, aliment_id: int):
    return {"message": f"Ingrédient {aliment_id} retiré de la recette {recette_id}"}
