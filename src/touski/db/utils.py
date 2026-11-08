from touski.db.database import Base, engine

def create_db(sample: bool = False):
    import touski.models

    Base.metadata.create_all(engine)


def store_image(image_url: str):
    pass
