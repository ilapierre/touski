from sqlalchemy import ForeignKey, Integer, Enum, String
from sqlalchemy.orm import Mapped, mapped_column
from touski.db.database import Base
from .users import User
from .groups import Group
from enum import Enum as PyEnum


class UserRole(PyEnum):
    OWNER = "owner"
    ADMIN = "admin"
    # NOTE: Voir si on veut différents types de privilèges
    PRIVILEGED = "privileged"
    STANDARD = "standard"


class GroupUser(Base):
    __tablename__ = "groups_users"

    id: Mapped[int] = mapped_column(primary_key=True)

    group_id: Mapped[int] = mapped_column(Integer, ForeignKey(Group.id))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey(User.id))

    nickname: Mapped[str | None] = mapped_column(String(30), nullable=True)
    role: Mapped[PyEnum] = mapped_column(Enum(UserRole))
