from fastapi import APIRouter, Depends
from touski.db.database import get_session_dependency
from touski.models import Food

router = APIRouter(prefix="/aliments", tags=["aliments"])

# GET tous les aliments
# TODO: Paginer la liste d'aliments
@router.get("/")
def list_aliments(session=Depends(get_session_dependency)):
    foods = session.query(Food).all()
    return foods


# recherche d'aliment par nom
# TODO: Paginer la liste d'aliments recherchés
@router.get("/recherche")
def rechercher_aliment(nom: str, session=Depends(get_session_dependency)):
    foods = session.query(Food).filter(Food.name.like(f"%{nom}%")).all()
    return {"recherche": nom, "resultats": foods}

#get aliment par id
@router.get("/{aliment_id}")
def get_aliment(aliment_id: int):
    return {"id": aliment_id}
 
#post pour créer un aliment (ajout manuel)
@router.post("/", status_code=201)
def create_aliment():
    return {"message": "Aliment créé avec succès"}

#modification d'un aliment
@router.put("/{aliment_id}")
def update_aliment(aliment_id: int):
    return {"message": f"Aliment {aliment_id} mis à jour avec succès"}

#suppression d'un aliment
@router.delete("/{aliment_id}")
def delete_aliment(aliment_id: int):
    return {"message": f"Aliment {aliment_id} supprimé avec succès"}
