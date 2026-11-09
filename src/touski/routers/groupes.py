from fastapi import APIRouter

#ROUTE RECETTES 
router = APIRouter(prefix="/groupes", tags=["groupes"])

#get toutes les groupes
@router.get("/")
def list_groupe():
    return []

#get groupe par id
@router.get("/{groupe_id}")
def get_groupe(groupe_id: int):
    return {"id": groupe_id}    

#post pour créer un groupe
@router.post("/", status_code=201)
def create_groupe():
    return {"message": "Groupe créée avec succès"}

#modif d un groupe
@router.put("/{groupe_id}")
def update_groupe(groupe_id: int):
    return {"message": f"Groupe {groupe_id} mis à jour avec succès"}

#pour supprimer un groupe
@router.delete("/{groupe_id}")
def delete_groupe(groupe_id: int):
    return {"message": f"Groupe {groupe_id} supprimé avec succès"}



#----------CE QUI CONCERNE LES MEMBRES D UN GROUPE----------#

#get les membre d un groupe
@router.get("/{groupe_id}/membres")
def list_membres(groupe_id: int):
    return []
 
#Ajouter un membre à un groupe
@router.post("/{groupe_id}/membres", status_code=201)
def add_membre(groupe_id: int):
    return {"message": f"Membre ajouté au groupe {groupe_id}"}

#modif d'un membre d un groupe
@router.put("/{groupe_id}/membres/{user_id}")
def update_membre(groupe_id: int, user_id: int):
    return {"message": f"Membre {user_id} du groupe {groupe_id} mis à jour"}

#Retirer un membre
@router.delete("/{groupe_id}/membres/{user_id}")
def remove_membre(groupe_id: int, user_id: int):
    return {"message": f"Membre {user_id} retiré du groupe {groupe_id}"}

