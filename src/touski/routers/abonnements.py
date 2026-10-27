from fastapi import APIRouter
 
#ROUTE ABONNEMENT IA
router = APIRouter(prefix="/abonnements", tags=["abonnements"])
 
#état de l'abonnement de l'utilisateur connecté
@router.get("/moi")
def get_mon_abonnement():
    return {"premium": False}
 
#acheter l'abonnement IA
@router.post("/", status_code=201)
def acheter_abonnement():
    return {"message": "Abonnement activé avec succès"}
 
#annuler l'abonnement
@router.delete("/moi")
def annuler_abonnement():
    return {"message": "Abonnement annulé"}
 
