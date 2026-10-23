import APIRouter

router = APIRouter(prefix="/aliments", tags=["aliments"])

#get tous les aliments
@router.get("/")
def list_aliments():
    return []

#recherche d'aliment par nom 
@router.get("/recherche")
def rechercher_aliment(nom: str):
    return {"recherche": nom, "resultats": []}

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