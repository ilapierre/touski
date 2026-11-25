from datetime import datetime
from touski.models.groups import Group
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from touski.core.dependencies import get_current_user
from touski.db.database import get_session_dependency as get_db
from touski.models.foods import Food
from touski.models.groups_foods import GroupFood
from touski.models.groups_users import GroupUser, UserRole

router = APIRouter(prefix="/frigo", tags=["frigo"])


class FrigoAdd(BaseModel):
    food_id: int
    group_id: int | None = None
    expires_at: datetime | None = None


@router.post("/", status_code=201)
def add_to_frigo(
    data: FrigoAdd,
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
):
    if not db.get(Food, data.food_id):
        raise HTTPException(404, "Aliment introuvable")

    query = db.query(GroupUser).filter_by(user_id=user.id)
    if data.group_id:
        query = query.filter_by(group_id=data.group_id)
        
        
    membership = query.first()

    if not membership:
        group = Group(name=f"Frigo {user.name}"[:20])
        db.add(group)
        db.flush()  # pour avoir group.id avant le commit

        membership = GroupUser(
            group_id=group.id,
            user_id=user.id,
            role=UserRole.OWNER,
        )
        db.add(membership)
    item = GroupFood(
        group_id=membership.group_id,
        food_id=data.food_id,
        expires_at=data.expires_at,
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    return {"id": item.id, "group_id": item.group_id, "food_id": item.food_id}

@router.get("/")
def get_frigo(
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
):
    rows = (
        db.query(GroupFood, Food)
        .join(Food, Food.id == GroupFood.food_id)
        .join(GroupUser, GroupUser.group_id == GroupFood.group_id)
        .filter(GroupUser.user_id == user.id)
        .all()
    )

    return [
        {
            **{c.name: getattr(food, c.name) for c in Food.__table__.columns},
            "frigo_id": gf.id,
            "expires_at": gf.expires_at,
        }
        for gf, food in rows
    ]