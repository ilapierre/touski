from sqlalchemy import JSON, Double, String, Integer, null
from sqlalchemy.orm import Mapped, mapped_column
from touski.db.database import Base


class Food(Base):
    __tablename__ = "foods"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30))

    # Macros
    per: Mapped[str | None] = mapped_column(String(10), nullable=True)
    kcal: Mapped[int | None] = mapped_column(Integer, nullable=True)

    fat: Mapped[int | None] = mapped_column(Integer, nullable=True)
    proteins: Mapped[int | None] = mapped_column(Integer, nullable=True)
    carbohydrates: Mapped[int | None] = mapped_column(Integer, nullable=True)

    values: Mapped[dict | None] = mapped_column(JSON, nullable=True)
