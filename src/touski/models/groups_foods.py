from sqlalchemy import DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column
from touski.models.base import Base
from touski.models.food import Food
from touski.models.groups import Group
from datetime import datetime


class GroupFood(Base):
    __tablename__ = "groups_foods"

    id: Mapped[int] = mapped_column(primary_key=True)

    group_id: Mapped[int] = mapped_column(Integer, ForeignKey(Group.id))
    food_id: Mapped[int] = mapped_column(Integer, ForeignKey(Food.id))

    expiry_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
