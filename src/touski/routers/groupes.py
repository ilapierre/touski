from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session
from touski.db.database import get_session_dependency as get_db
from touski.models.groups_users import GroupUser, User, UserRole, Group
from pydantic import BaseModel

#ROUTE RECETTES 
router = APIRouter(prefix="/groupes", tags=["groupes"])

class AddMemberSchema(BaseModel):
    email: str
    role: str = "standard"

class UpdateRoleSchema(BaseModel):
    role: str

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
def list_membres(groupe_id: int, db: Session = Depends(get_db)):
    membres = (
        db.query(GroupUser, User)
        .join(User, GroupUser.user_id == User.id)
        .filter(GroupUser.group_id == groupe_id)
        .all()
    )
    return [
        {
            "id": u.id,
            "email": u.email,
            "role": g.role.value if hasattr(g.role, "value") else g.role
        }
        for g, u in membres
    ]
 
#Ajouter un membre à un groupe
@router.post("/{groupe_id}/membres", status_code=201)
def add_membre(groupe_id: int, body: AddMemberSchema, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"erreur": f"Aucun utilisateur trouvé avec le courriel '{body.email}'."}
    
    existing = db.query(GroupUser).filter_by(group_id=groupe_id, user_id=user.id).first()
    if existing:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"erreur" : "L'utilisateur est déjà membre de ce groupe."}
    
    new_membre = GroupUser(group_id=groupe_id, user_id=user.id, role=UserRole(body.role))
    db.add(new_membre)
    db.commit()
    
    return {
        "message" : f"Membre ajouté au groupe {groupe_id}",
        "membre" : {"id": user.id, "email": user.email, "role": body.role}
    }

#modif d'un membre d un groupe
@router.put("/{groupe_id}/membres/{user_id}")
def update_membre(groupe_id: int, user_id: int, body: UpdateRoleSchema, response: Response, db: Session = Depends(get_db)):
    membre = db.query(GroupUser).filter_by(group_id=groupe_id, user_id=user_id).first()
    if not membre:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"erreur": "Membre introuvable."}
    
    membre.role = UserRole(body.role)
    db.commit()
    return {"message": f"Membre {user_id} du groupe {groupe_id} mis à jour"}

#Retirer un membre
@router.delete("/{groupe_id}/membres/{user_id}")
def remove_membre(groupe_id: int, user_id: int, response: Response, db: Session = Depends(get_db)):
    member = db.query(GroupUser).filter_by(group_id=groupe_id, user_id=user_id).first()
    if not member:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"error": "Membre introuvable."}
    
    db.delete(member)
    db.commit()
    return {"message": f"Membre {user_id} retiré"}

