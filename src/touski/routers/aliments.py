from typing import Annotated

from fastapi import APIRouter, Depends, Query
from touski.db.database import get_session_dependency
from touski.models import Food

router = APIRouter(prefix="/aliments", tags=["aliments"])

# Pagination: nombre d'éléments à retourner et position de départ
Limit = Annotated[int, Query(ge=1, le=100, description="Nombre max d'aliments")]
Offset = Annotated[int, Query(ge=0, description="Nombre d'aliments à sauter")]


# GET les aliments (paginés), avec le total pour calculer le nombre de pages
@router.get("/")
def list_aliments(
    limit: Limit = 50,
    offset: Offset = 0,
    session=Depends(get_session_dependency),
):
    query = session.query(Food)
    total = query.count()
    foods = query.order_by(Food.id).limit(limit).offset(offset).all()
    return {"total": total, "resultats": foods}


# recherche d'aliment par nom (paginée)
@router.get("/recherche")
def rechercher_aliment(
    nom: str,
    limit: Limit = 50,
    offset: Offset = 0,
    session=Depends(get_session_dependency),
):
    query = session.query(Food).filter(Food.name.like(f"%{nom}%"))
    total = query.count()
    foods = query.order_by(Food.id).limit(limit).offset(offset).all()
    return {"recherche": nom, "total": total, "resultats": foods}

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
