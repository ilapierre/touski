from decimal import Decimal
from sqlalchemy import ForeignKey, Integer, String, DECIMAL
from sqlalchemy.orm import Mapped, mapped_column
from touski.db.database import Base
from .foods import Food
from .recipes import Recipe


class RecipesFoods(Base):
    __tablename__ = "recipes_foods"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    recipe_id: Mapped[int] = mapped_column(Integer, ForeignKey(Recipe.id))
    food_id: Mapped[int] = mapped_column(Integer, ForeignKey(Food.id))

    quantity: Mapped[Decimal] = mapped_column(DECIMAL)
    unity: Mapped[str] = mapped_column(String(20))
