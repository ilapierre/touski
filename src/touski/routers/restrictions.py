from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import delete
from sqlalchemy.orm import Session

from touski.core.dependencies import get_current_user
from touski.db.database import get_session_dependency
from touski.models import UserRestriction
from touski.models.users import User
from touski.restrictions import LABELS, Restriction
from touski.services.restriction_service import user_restrictions


class RestrictionIn(BaseModel):
    # Une clé inconnue est refusée (422) par l'enum
    restriction: Restriction


class RestrictionsIn(BaseModel):
    restrictions: list[Restriction]


# ------ Routes ------ #
router = APIRouter(prefix="/restrictions", tags=["restrictions"])


def check_user(user_id: int, current_user: User):
    # Un utilisateur ne gère que ses propres restrictions
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès refusé")


def restrictions_out(session: Session, user_id: int) -> dict:
    return {"restrictions": sorted(user_restrictions(session, user_id))}


# Les 14 restrictions disponibles avec leurs libellés
@router.get("/")
def list_available_restrictions():
    return {r.value: LABELS[r] for r in Restriction}


# ----------ALLERGIES / RESTRICTIONS (AllergieUtilisateur)----------#


# get restrictions du user
@router.get("/{user_id}/restrictions")
def list_restrictions(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session_dependency),
):
    check_user(user_id, current_user)
    return restrictions_out(db, user_id)


# ajouter une restriction
@router.post("/{user_id}/restrictions", status_code=201)
def add_restriction(
    user_id: int,
    data: RestrictionIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session_dependency),
):
    check_user(user_id, current_user)
    if data.restriction not in user_restrictions(db, user_id):
        db.add(UserRestriction(user_id=user_id, restriction=data.restriction.value))
        db.flush()
    return restrictions_out(db, user_id)


# remplacer toutes les restrictions du user
@router.put("/{user_id}/restrictions")
def update_restriction(
    user_id: int,
    data: RestrictionsIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session_dependency),
):
    check_user(user_id, current_user)
    db.execute(delete(UserRestriction).where(UserRestriction.user_id == user_id))
    db.add_all(
        UserRestriction(user_id=user_id, restriction=r.value) for r in set(data.restrictions)
    )
    db.flush()
    return restrictions_out(db, user_id)


# retirer une restriction
@router.delete("/{user_id}/restrictions/{restriction}")
def remove_restriction(
    user_id: int,
    restriction: Restriction,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session_dependency),
):
    check_user(user_id, current_user)
    db.execute(
        delete(UserRestriction).where(
            UserRestriction.user_id == user_id,
            UserRestriction.restriction == restriction.value,
        )
    )
    db.flush()
    return restrictions_out(db, user_id)
