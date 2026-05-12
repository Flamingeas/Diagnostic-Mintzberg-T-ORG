# Diagnostic Mintzberg — T-ORG

Questionnaire de diagnostic organisationnel basé sur les configurations de Mintzberg.
Les réponses sont stockées dans une base SQLite et consultables via un dashboard fonctionnel.

## Lancer en local

```bash
npm install
npm start
```

L'application est accessible sur `http://localhost:3001`.

## Liens par organisation

Chaque collaborateur dispose d'un lien dédié à l'entreprise à laquelle il/elle appartient:

```
https://diagnostic-mintzberg-t-org-production.up.railway.app/?org=NomOrganisation
```
Le champ est verrouillé pour éviter les erreurs de saisie.

## Consulter les résultats

- Dashboard complet : `/results.html`
- Toutes les réponses (JSON) : `/api/results/data` (protégées par auth)
- Réponses par organisation : `/api/results/NomOrganisation` (protégées par auth)
### Visuels
<img width="917" height="896" alt="image" src="https://github.com/user-attachments/assets/6dd539c5-f332-441d-8016-702537555cf1" />
<img width="1844" height="916" alt="image" src="https://github.com/user-attachments/assets/a2231e50-fe74-4a6e-885c-8397e78300ac" />


## Déploiement (Railway)

1. Pusher le projet sur GitHub
2. Connecter le repo sur [railway.app](https://railway.app)
3. Ajouter un volume monté sur `/app/data`
4. Ajouter la variable d'environnement : `DATABASE_PATH=/app/data/results.db`

## Stack

- Node.js / Express
- SQLite (better-sqlite3)
- HTML/CSS/JS vanilla


