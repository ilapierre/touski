from fastapi import APIRouter

#ROUTE USER 
router = APIRouter(prefix="/users", tags=["users"])

#get tout users
@router.get("/")
def list_users():
    return []

#get user par id
@router.get("/{user_id}")
def get_user(user_id: int):
    return {"id": user_id}

#post créer un user
@router.post("/", status_code=201)
def create_user():
    return {"message": "Utilisateur créé avec succès"}

#Modification d'un user
@router.put("/{user_id}")
def update_user(user_id: int):
    return {"message": f"user {user_id} mis à jour avec succès"}

#Suppression d'un user
@router.delete("/{user_id}")
def delete_user(user_id: int):
    return {"message": f"user {user_id} supprimé avec succès"}