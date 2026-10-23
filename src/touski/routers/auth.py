import APIRouter
 
#ROUTE AUTH
router = APIRouter(prefix="/auth", tags=["auth"])
 
#inscription (création de compte)
@router.post("/inscription", status_code=201)
def inscription():
    return {"message": "Compte créé avec succès"}
 
#connexion (retournera un token)
@router.post("/connexion")
def connexion():
    return {"access_token": "", "token_type": "bearer"}
 
#déconnexion
@router.post("/deconnexion")
def deconnexion():
    return {"message": "Déconnecté avec succès"}
 
#infos de l'utilisateur connecté
@router.get("/moi")
def get_moi():
    return {}
 