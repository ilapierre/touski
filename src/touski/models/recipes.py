from sqlalchemy import Boolean, String, Integer
from sqlalchemy.orm import Mapped, mapped_column
from touski.db.database import Base


class Recipe(Base):
    __tablename__ = "recipes"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(String(255))
    is_ai: Mapped[bool] = mapped_column(Boolean)
    source: Mapped[str] = mapped_column(String(50))
    mealdb_id: Mapped[int | None] = mapped_column(Integer, unique=True, nullable=True)
    image_url: Mapped[str] = mapped_column(String(100), nullable=True)
