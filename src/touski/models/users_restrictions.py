from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from touski.db.database import Base


class UserRestriction(Base):
    """Restrictions (allergènes) d'un utilisateur. `restriction` est une clé de `Restriction`."""

    __tablename__ = "users_restrictions"

    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    restriction: Mapped[str] = mapped_column(String(32), primary_key=True)
