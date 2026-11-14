from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from touski.db.database import get_session_dependency as get_db
from touski.models.users import User
from touski.core.dependencies import get_current_user
from touski.models.subscriptions import Subscription, SubscriptionStatus
from touski.models.groups_users import GroupUser

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
 
 
@router.get("/moi")
def get_mon_abonnement(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    membership  = db.query(GroupUser).filter(GroupUser.user_id == current_user.id).first()
    if not membership:
        return {"premium" : False}
    
    subscription = d.query(Subscription).filter(
        Subscription.group_id == membership.group_id,
        Subscription.status == SubscriptionStatus.ACTIVE,
        Subscription.ends_at > datetime.utcnow()
    ).first()
    
    if subscription:
        return {
           "premium": True,
           "ends_at": subscription.ends_at.isoformat(),
           "status": subscription.status.value
        }
        
    return {
        "premium": False
    }
    