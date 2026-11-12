from fastapi import Request
from touski.models.users import User


def user_out(user: User, request: Request) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "photo": f"{request.base_url}static/images/{user.photo}" if user.photo else None,
    }