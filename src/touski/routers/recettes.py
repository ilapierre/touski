import APIRouter

#ROUTE RECETTES 
router = APIRouter(prefix="/recettes", tags=["recettes"])

#get toutes les recettes
@router.get("/")
def list_recettes():
    return []

#get recette par id
@router.get("/{recette_id}")
def get_recette(recette_id: int):
    return {"id": recette_id}    

#post pour créer une recette
@router.post("/", status_code=201)
def create_recette():
    return {"message": "Recette créée avec succès"}

