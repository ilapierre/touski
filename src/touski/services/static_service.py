import requests
from pathlib import Path
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


def store_image_from_url(image_url: str, folder: str) -> str:
    res = requests.get(image_url)
    content_type = res.headers.get("Content-Type")

    filename = hashlib.sha256(res.content).hexdigest() + image_type(content_type)

    directory = Path("static/images") / folder
    directory.mkdir(parents=True, exist_ok=True)
    (directory / filename).write_bytes(res.content)

    return f"{folder}/{filename}"


def with_image_url(obj: Any, base_url: str) -> dict:
    # Convertit un modèle SQLAlchemy en dict avec l'URL complète de son image
    # FIX: Utiliser un modèle Pydantic?
    data = obj.__dict__.copy()
    if obj.image_url:
        data["image_url"] = f"{base_url}static/images/{obj.image_url}"
    return data
