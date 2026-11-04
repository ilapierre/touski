from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column
from touski.db.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(String(30))
    email: Mapped[str] = mapped_column(String(50), unique=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    # NOTE: Voir si on veut faire une table relationnelle
    # premium: Mapped[bool] = mapped_column(Boolean)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
