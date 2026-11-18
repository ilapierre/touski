from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from touski.routers.auth import get_current_user, hash_password
from touski.models.users import User
from touski.db.database import get_session_dependency

class RestrictionCreate(BaseModel):
    food_id: int
    note: str | None = Field(max_length=50, default=None)


# ------ Routes ------ #
router = APIRouter(prefix="/restrictions", tags=["restrictions"])



# ----------ALLERGIES / RESTRICTIONS (AllergieUtilisateur)----------#
 
#get restrictions du user
@router.get("/{user_id}/restrictions")
def list_restrictions(user_id: int):
    return []
 
#ajouter une restriction
@router.post("/{user_id}/restrictions", status_code=201)
def add_restriction(user_id: int, data: RestrictionCreate, db: Session = Depends(get_session_dependency)):
    r = RestrictionCreate(user_id=user_id, food_id=data.food_id, note=data.note)
    db.add(r)
    db.commit()
    db.refresh(r)
    return {"id": r.id, "user_id": r.user_id, "food_id": r.food_id, "note": r.note}

#modifier une restriction (note)
@router.put("/{user_id}/restrictions/{restriction_id}")
def update_restriction(user_id: int, restriction_id: int, data: RestrictionCreate, db: Session = Depends(get_session_dependency)):
    return {"message": f"Restriction {restriction_id} mise à jour"}
 
#retirer une restriction
@router.delete("/{user_id}/restrictions/{restriction_id}")
def remove_restriction(user_id: int, restriction_id: int, db: Session = Depends(get_session_dependency)):
    return {"message": f"Restriction {restriction_id} retirée du user {user_id}"}
