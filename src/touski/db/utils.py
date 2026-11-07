from touski.db.database import Base, engine

def create_db(sample: bool = False):
    import touski.models

    Base.metadata.create_all(engine)
