from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from touski.db.database import Base


class FoodRestriction(Base):
    """Allergènes d'un aliment. `restriction` est une clé de `Restriction`."""

    __tablename__ = "foods_restrictions"

    food_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("foods.id", ondelete="CASCADE"), primary_key=True
    )
    restriction: Mapped[str] = mapped_column(String(32), primary_key=True)
