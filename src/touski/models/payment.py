from decimal import Decimal
from enum import Enum as PyEnum
from sqlalchemy import Enum, ForeignKey, Integer, DECIMAL
from sqlalchemy.orm import Mapped, mapped_column
from touski.db.database import Base
from .subscriptions import Subscription
from .users import User


class PaymentStatus(PyEnum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey(User.id))
    subscription_id: Mapped[int] = mapped_column(Integer, ForeignKey(Subscription.id))
    amount: Mapped[Decimal] = mapped_column(DECIMAL)
    status: Mapped[PyEnum] = mapped_column(Enum(PaymentStatus))
