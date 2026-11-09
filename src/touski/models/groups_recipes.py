from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column
from touski.db.database import Base
from .recipes import Recipe
from .groups import Group


class GroupeRecipe(Base):
    __tablename__ = "groups_recipes"

    id: Mapped[int] = mapped_column(primary_key=True)

    group_id: Mapped[int] = mapped_column(Integer, ForeignKey(Group.id))
    recipe_id: Mapped[int] = mapped_column(Integer, ForeignKey(Recipe.id))
