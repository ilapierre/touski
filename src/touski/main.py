from fastapi import FastAPI
from touski.routers import users, aliments, recettes

app = FastAPI(title="Touski API")

app.include_router(aliments.router)
app.include_router(users.router)
app.include_router(recettes.router)
