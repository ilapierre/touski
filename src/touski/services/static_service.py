import requests
import hashlib
from typing import Any


def image_type(content_type) -> str:
    match content_type:
        case "image/jpeg":
            return ".jpg"
        case "image/png":
            return ".png"
        case _:
            return ".jpg"


def store_image_from_url(image_url: str) -> str:
    res = requests.get(image_url)
    content_type = res.headers.get("Content-Type")

    file_path = hashlib.sha256(res.content).hexdigest() + image_type(content_type)

    with open(f"static/images/{file_path}", "wb") as f:
        f.write(res.content)

    return file_path


def with_image_url(obj: Any, base_url: str) -> dict:
    # Convertit un modèle SQLAlchemy en dict avec l'URL complète de son image
    # FIX: Utiliser un modèle Pydantic?
    data = obj.__dict__.copy()
    if obj.image_url:
        data["image_url"] = f"{base_url}static/images/{obj.image_url}"
    return data
