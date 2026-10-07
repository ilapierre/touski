from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from touski.models.base import Base


class UserRestrictions(Base):
    __tablename__ = "users_restrictions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    user_id: Mapped[int] = mapped_column(Integer)
    food_id: Mapped[int] = mapped_column(Integer)

    note: Mapped[str | None] = mapped_column(String(50), nullable=True)
