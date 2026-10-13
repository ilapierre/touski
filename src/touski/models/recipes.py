from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column
from touski.db.database import Base


class Recipe(Base):
    __tablename__ = "recipes"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(String(30))
    is_ai: Mapped[bool] = mapped_column(Boolean)
    source: Mapped[str] = mapped_column(String(50))
