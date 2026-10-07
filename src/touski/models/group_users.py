from sqlalchemy import ForeignKey, Integer, Enum, String
from sqlalchemy.orm import Mapped, mapped_column
from touski.models.base import Base
from touski.models.users import User
from touski.models.groups import Group
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

    nickname: Mapped[str] = mapped_column(String(30))
    role: Mapped[PyEnum] = mapped_column(Enum(UserRole))
    spending_limit: Mapped[int] = mapped_column(Integer, default=0)
