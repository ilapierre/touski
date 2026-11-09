from typing import Annotated

from fastapi import HTTPException, Request, APIRouter, Depends, Query
from touski.db.database import get_session_dependency
from touski.models import Food
from touski.services.static_service import with_image_url

router = APIRouter(prefix="/foods", tags=["foods"])

# Pagination: nombre d'éléments à retourner et position de départ
Limit = Annotated[int, Query(ge=1, le=100, description="Nombre max d'aliments")]
Offset = Annotated[int, Query(ge=0, description="Nombre d'aliments à sauter")]


# GET les aliments (paginés), avec le total pour calculer le nombre de pages
@router.get("/")
def list_foods(
    request: Request,
    q: Annotated[str | None, Query(description="Search food by name")] = None,
    limit: Limit = 50,
    offset: Offset = 0,
    session=Depends(get_session_dependency),
):
    query = session.query(Food)
    if q:
        query = query.filter(Food.name.like(f"%{q}%"))
    total = query.count()
    foods = query.order_by(Food.id).limit(limit).offset(offset).all()

    base_url = str(request.base_url)

    return {
        "limit": limit,
        "offset": offset,
        "total": total,
        "foods": [with_image_url(f, base_url) for f in foods],
    }


# GET Aliment par ID
@router.get("/{food_id}")
def get_food(food_id: int, request: Request, session=Depends(get_session_dependency)):
    if food := session.get(Food, food_id):
        return {"food": with_image_url(food, str(request.base_url))}

    raise HTTPException(404, detail="Food not found")


# TODO: ------ Les endpoints suivants nécessitent l'authentification ------


# POST Créer un aliment (ajout manuel)
@router.post("/", status_code=201)
def create_food():
    return {}


# PUT Modification d'un aliment
@router.put("/{food_id}")
def update_food(food_id: int):
    return {}


# DELETE Suppression d'un aliment
@router.delete("/{food_id}")
def delete_food(food_id: int):
    return {}
