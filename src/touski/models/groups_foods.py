from sqlalchemy import DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column
from touski.db.database import Base
from .foods import Food
from .groups import Group
from datetime import datetime


class GroupFood(Base):
    __tablename__ = "groups_foods"

    id: Mapped[int] = mapped_column(primary_key=True)

    group_id: Mapped[int] = mapped_column(Integer, ForeignKey(Group.id))
    food_id: Mapped[int] = mapped_column(Integer, ForeignKey(Food.id))

    expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
