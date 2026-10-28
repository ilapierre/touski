
# Touski

Touski est une expression venant de «Tout ce qui». Cela provient d'une méthode de cuisine permettant de se débarrasser des restes du réfrigérateur.

C'est un logiciel qui simplifie l'organisation virtuelle du réfrigérateur des utilisateurs. Il peut aussi suggérer des recettes tirées de la base de données selon les restrictions de l'utilisateur, ou générer des recettes personnalisées grâce à une fonctionnalité IA sur abonnement.

## Contributeurs

* [Alceus, Naïka](https://github.com/alceusnaika)
* [Juteau, Gaëlle](https://github.com/gaelle0-0)
* [Lapierre, Ian](https://github.com/ilapierre)
* [Nguyen, Thien Kim](https://github.com/thienkim26)

## Installation

Voir les étapes d'installation [installation.md](/docs/installation.md)

### Prérequis

* Git
* Docker Desktop

### Lancement

1. Cloné le dépôt Git
2. Ouvrir **PowerShell** (Windows)
3. 
```
cd /chemin/du/dossier

Copy-Item .env.example .env
```


## Construit avec

Les *langages*, qu'on va utiliser pour coder cet logiciel, sont :

### Backend

* Python
* MySQL

### Frontend

* React

### Autres

 * Docker

## React

Le frontend de l'application est développé avec **REACT** (Vite).

### Installation et lancement (avec *Docker*)

```
docker compose up --build
```

### Installation et lancement (en *Local*)

Après avoir cloner le [git](https://github.com/ilapierre/touski.git) dans un dossier, il faut installer les fichiers avec les dépendances nécessaires. 

```
npm install
```

Pour mettre à jour, les installations des packages (facultatif): 

```
npm update --save
```

Pour exécuter le projet : 

```
npm run dev
```