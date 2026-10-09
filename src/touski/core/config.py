import sys
import os
from dotenv import find_dotenv, load_dotenv

env_file = load_dotenv(find_dotenv())

ENVIRONMENT = os.getenv("ENVIRONMENT")
DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")

if not env_file:
    # TODO: Remplacer par un Logger
    print(
        "[ERREUR] Fichier .env manquant! Veuillez le créer à la racine du répertoire et réessayer."
    )
    sys.exit(1)

if [var for var in [ENVIRONMENT, DATABASE_URL, SECRET_KEY] if var is None]:
    # TODO: Remplacer par un Logger
    print("[ERREUR] Variable(s) d'environnement manquante: ENVIRONMENT, DATABASE_URL, SECRET_KEY")
    sys.exit(1)
