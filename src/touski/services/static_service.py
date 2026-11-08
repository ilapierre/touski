import requests
import hashlib


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
