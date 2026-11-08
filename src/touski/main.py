from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from touski.routers import users, foods, recipes

app = FastAPI(title="Touski API")

app.include_router(foods.router)
app.include_router(users.router)
app.include_router(recipes.router)

app.mount("/static", StaticFiles(directory="static"), name="static") 
