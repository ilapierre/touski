from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from touski.routers.auth import get_current_user, hash_password
from touski.models.users import User
from touski.db.database import get_session_dependency

    
class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    password: str | None = Field(min_length=8, default=None)

# ------ Routes ------ #
router = APIRouter(prefix="/users", tags=["users"])



#Modifie le user connecter
@router.put("/moi")
def update_current_user(
    data: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_session_dependency)
):
    if data.email and data.email != current_user.email:
        if db.query(User).filter(User.email == data.email).first():
            raise HTTPException(status_code=409, detail="Ce courriel est déjà utilisé")
        current_user.email = data.email

    if data.name:
        current_user.name = data.name.strip()

    if data.password:
        current_user.password = hash_password(data.password)

    db.commit()
    db.refresh(current_user)
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email}
    

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

# ----------GROUPES DU USER----------#
 
#get les groupes dont le user fait partie
@router.get("/{user_id}/groupes")
def list_groupes_user(user_id: int):
    return []
 
 
 # ----------ALLERGIES / RESTRICTIONS (AllergieUtilisateur)----------#
 
#get allergies du user
@router.get("/{user_id}/allergies")
def list_allergies(user_id: int):
    return []
 
#ajouter une allergie / restriction
@router.post("/{user_id}/allergies", status_code=201)
def add_allergie(user_id: int):
    return {"message": f"Allergie ajoutée au user {user_id}"}
 
#modifier une allergie (note)
@router.put("/{user_id}/allergies/{allergie_id}")
def update_allergie(user_id: int, allergie_id: int):
    return {"message": f"Allergie {allergie_id} mise à jour"}
 
#retirer une allergie
@router.delete("/{user_id}/allergies/{allergie_id}")
def remove_allergie(user_id: int, allergie_id: int):
    return {"message": f"Allergie {allergie_id} retirée du user {user_id}"}
