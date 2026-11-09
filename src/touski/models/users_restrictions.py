from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from touski.db.database import Base
from .foods import Food
from .users import User


class UserRestrictions(Base):
    __tablename__ = "users_restrictions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey(User.id))
    food_id: Mapped[int] = mapped_column(Integer, ForeignKey(Food.id))

    note: Mapped[str | None] = mapped_column(String(50), nullable=True)
