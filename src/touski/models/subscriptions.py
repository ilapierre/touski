from datetime import datetime
from sqlalchemy import DateTime, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from touski.db.database import Base
from .groups import Group
from enum import Enum as PyEnum


class SubscriptionStatus(PyEnum):
    ACTIVE = "active"
    CANCELLED = "cancelled"
    EXPIRED = "expired"


class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(primary_key=True)

    group_id: Mapped[int] = mapped_column(ForeignKey(Group.id))
    status: Mapped[PyEnum] = mapped_column(Enum(SubscriptionStatus))
    ends_at: Mapped[datetime] = mapped_column(DateTime)
