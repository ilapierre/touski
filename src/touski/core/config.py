import sys
from dotenv import find_dotenv, load_dotenv, get_key

# Valider l'existence du fichier .env
env_file = find_dotenv()
load_dotenv(env_file)

if not env_file:
    # TODO: Remplacer par un Logger
    print(
        "[ERREUR] Fichier .env manquant! Veuillez le créer à la racine du répertoire et réessayer."
    )
    sys.exit(1)

# Variables d'environnement
ENVIRONMENT = get_key(env_file, "ENVIRONMENT")
DATABASE_URL = get_key(env_file, "DATABASE_URL")
SECRET_KEY = get_key(env_file, "SECRET_KEY")

if [var for var in [ENVIRONMENT, DATABASE_URL, SECRET_KEY] if var is None]:
    # TODO: Remplacer par un Logger
    print("[ERREUR] Variable(s) d'environnement manquantes")
    sys.exit(1)
