from collections.abc import Iterable

from sqlalchemy import select
from sqlalchemy.orm import Session

from touski.models import Food, FoodRestriction, GroupUser, UserRestriction
from touski.restrictions import Restriction


def user_restrictions(session: Session, user_id: int) -> set[Restriction]:
    rows = session.scalars(
        select(UserRestriction.restriction).where(UserRestriction.user_id == user_id)
    )
    return {Restriction(r) for r in rows}


def group_restrictions(session: Session, group_id: int) -> set[Restriction]:
    # Union des restrictions de tous les membres du groupe
    rows = session.scalars(
        select(UserRestriction.restriction)
        .join(GroupUser, GroupUser.user_id == UserRestriction.user_id)
        .where(GroupUser.group_id == group_id)
        .distinct()
    )
    return {Restriction(r) for r in rows}


def blocked_food_ids(restrictions: Iterable[Restriction]):
    # Sous-requête: aliments qui contiennent au moins une des restrictions données
    return select(FoodRestriction.food_id).where(
        FoodRestriction.restriction.in_([r.value for r in restrictions])
    )


def safe_foods_query(restrictions: set[Restriction]):
    # Aliments qui ne contiennent aucune des restrictions données
    return select(Food).where(Food.id.not_in(blocked_food_ids(restrictions)))
