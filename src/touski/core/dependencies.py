from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from touski.core.security import decode_access_token
from touski.db.database import get_session_dependency
from touski.models.users import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/connexion")

def get_current_user(
    token: str = Depends(oauth2_scheme), 
    session: Session = Depends(get_session_dependency),
) ->User:
    error = HTTPException(
        status_code= status.HTTP_401_UNAUTHORIZED, 
        detail="Jeton invalide ou expiré", 
        headers={"WWW-Authenticate": "Bearer"},
    )
    user_id = decode_access_token(token)
    if user_id is None:
        raise error
    user = session.get(User, user_id)
    if user is None:
        raise error
    return user