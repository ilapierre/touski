from sqlalchemy import DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from datetime import datetime


class Base(DeclarativeBase):
    creation_date: Mapped[datetime] = mapped_column(DateTime)
    modified_date: Mapped[datetime] = mapped_column(DateTime)
