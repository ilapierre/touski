from fastapi import FastAPI
from touski.routers import users, recettes, abonnements, aliments, auth, groupes

app = FastAPI(title="Touski API")

app.include_router(users.router)
app.include_router(recettes.router)
app.include_router(abonnements.router)
app.include_router(aliments.router)
app.include_router(auth.router)
app.include_router(groupes.router)