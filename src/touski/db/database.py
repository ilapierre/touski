from datetime import datetime
from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker, DeclarativeBase, Mapped, mapped_column
from sqlalchemy import DateTime
from touski.core.config import DATABASE_URL


class Base(DeclarativeBase):
    creation_date: Mapped[datetime] = mapped_column(DateTime)
    modified_date: Mapped[datetime] = mapped_column(DateTime)


engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# NOTE: Revoir l'implémentation des sessions et du async plus tard.
#       - Ian Lapierre <ian.lapierre@live.ca>


# FastAPI
# TODO: Bouger dans un fichier plus approprié pour FastAPI.
def get_session_dependency():
    session: Session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


# Utilisation générale
@contextmanager
def get_session():
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
