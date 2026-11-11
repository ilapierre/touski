from sqlalchemy import JSON, Double, String, Integer, Text, null
from sqlalchemy.orm import Mapped, mapped_column
from touski.db.database import Base


class Food(Base):
    __tablename__ = "foods"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))

    # Code Open Food Facts
    off_id: Mapped[str | None] = mapped_column(String(32), unique=True, nullable=True)
    source: Mapped[str | None] = mapped_column(String(255), nullable=True)

    brand: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    origin: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # Nutrition
    quantity: Mapped[str | None] = mapped_column(String(50), nullable=True)
    serving_size: Mapped[str | None] = mapped_column(String(50), nullable=True)
    per: Mapped[str | None] = mapped_column(String(10), nullable=True)
    kcal: Mapped[int | None] = mapped_column(Integer, nullable=True)

    fat: Mapped[int | None] = mapped_column(Integer, nullable=True)
    proteins: Mapped[int | None] = mapped_column(Integer, nullable=True)
    carbohydrates: Mapped[int | None] = mapped_column(Integer, nullable=True)
    values: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    nutriscore: Mapped[str | None] = mapped_column(String(1), nullable=True)

    allergens: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
