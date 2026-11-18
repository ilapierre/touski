from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
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
def get_mon_abonnement(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    membership  = db.query(GroupUser).filter(GroupUser.user_id == current_user.id).first()
    if not membership:
        return {"premium" : False}
    
    subscription = db.query(Subscription).filter(
        Subscription.group_id == membership.group_id,
        Subscription.status == SubscriptionStatus.ACTIVE,
        Subscription.ends_at > datetime.now()
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
 
#acheter l'abonnement IA
@router.post("/", status_code=201)
def acheter_abonnement(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    membership = db.query(GroupUser).filter(GroupUser.user_id == current_user.id).first()
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="L'utilisateur n'appartient à aucun groupe."
        )
    
    existing_sub = db.query(Subscription).filter(
        Subscription.group_id == membership.group_id,
        Subscription.status == SubscriptionStatus.ACTIVE
    ).first()
    
    ends_at = datetime.now() + timedelta(days=356)
    
    if existing_sub:
        existing_sub.ends_at = ends_at
        existing_sub.status = SubscriptionStatus.ACTIVE
        subscription = existing_sub
    else:
        subscription = Subscription(
            group_id = membership.group_id,
            status = SubscriptionStatus.ACTIVE,
            ends_at = ends_at
        )
        db.add(subscription)
        
    db.commit()
    db.refresh(subscription)
    
    return {"message": "Abonnement activé avec succès",
            "ends_at" : subscription.ends_at.isoformat()}
 
#annuler l'abonnement
@router.delete("/moi")
def annuler_abonnement(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    membership = db.query(GroupUser).filter(GroupUser.user_id == current_user.id).first()
    if not membership:
        return {"message": "Aucun groupe trouvé pour l'utilisateur."}
    
    subscription = db.query(Subscription).filter(
        Subscription.group_id == membership.group_id,
        Subscription.status == SubscriptionStatus.ACTIVE
    ).first()
    
    if subscription:
        subscription.status = SubscriptionStatus.CANCELLED
        db.commit()
        return {"message": "Abonnement annulé avec succès."}
    
    return {"message": "Abonnement annulé"}