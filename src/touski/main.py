from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from touski.routers import users, foods, recipes, abonnements, auth, groupes

app = FastAPI(title="Touski API")

app.include_router(foods.router)
app.include_router(users.router)
app.include_router(recipes.router)
app.include_router(abonnements.router)
app.include_router(auth.router)
app.include_router(groupes.router)

app.mount("/static", StaticFiles(directory="static"), name="static") 