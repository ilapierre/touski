from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from touski.core.dependencies import get_current_user
from touski.core.security import create_access_token, hash_password, verify_password
from touski.db.database import get_session_dependency
from touski.models.users import User
 
# ------ Schemas ------ #
class InscriptionIn(BaseModel):
    name: str = Field(min_length=1, max_length=30)
    email: EmailStr
    password: str = Field(min_length=8)
    
    
class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: str
    is_admin: bool


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    
 
# ------ Route ------ #
router = APIRouter(prefix="/auth", tags=["auth"])
 
#inscription (création de compte)
@router.post("/inscription", status_code=201, response_model=UserOut)
def inscription(data: InscriptionIn, session: Session = Depends(get_session_dependency)):
    if session.scalar(select(User).where(User.email == data.email)):
        raise HTTPException(status.HTTP_409_CONFLICT, "Ce courriel est deja utilisé")
    
    user = User(
        name = data.name,
        email = data.email,
        hashed_password = hash_password(data.password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
 
#connexion (retournera un token)
@router.post("/connexion")
def connexion():
    return {"access_token": "", "token_type": "bearer"}
 
#déconnexion
@router.post("/deconnexion")
def deconnexion():
    return {"message": "Déconnecté avec succès"}
 
#infos de l'utilisateur connecté
@router.get("/moi")
def get_moi():
    return {}
 
