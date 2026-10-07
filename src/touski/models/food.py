from sqlalchemy import JSON, String
from sqlalchemy.orm import Mapped, mapped_column
from touski.models.base import Base


class Food(Base):
    __tablename__ = "foods"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30))
    values: Mapped[dict | None] = mapped_column(JSON, nullable=True)
