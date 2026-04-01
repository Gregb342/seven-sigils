# Seven Sigils

FR | EN

---

## Francais

Seven Sigils est un quiz web sur les blasons de l'univers Game of Thrones, construit avec React, TypeScript et Vite.

### Fonctionnalites

- Quiz interactif avec 4 choix par question
- Deux modes de jeu: `partie fixe` et `partie infinie`
- Deux niveaux de difficulte:
  - `facile`: pool restreint a 30 familles configurables
  - `difficile`: pool etendu base sur l'ensemble des blasons jouables
- Systeme d'indices progressifs
- Liens vers les pages de reference La Garde de Nuit
- Attribution et credit des sources

### Base de donnees interne des blasons

La source de verite est:

- `src/infrastructure/data/blazonDb.json`

Ce fichier contient:

- `easyModeSlugs`: la liste des slugs utilises en mode facile
- `entries`: les metadonnees par slug (label, kind, variantOf, includeInHard, hints, housePageUrl, motto, domain, translation, etc.)

Important:

- Le jeu reste pilote par les fichiers images presents dans `All Blasons/`
- Une entree sans fichier image correspondant ne devient pas une question jouable

### Ajouter ou modifier une famille

1. Ajouter/mettre a jour l'entree dans `blazonDb.json`
2. Verifier que le fichier image suit le pattern `Blason-<slug>-2014-v01-256px.png`
3. Ajouter le slug a `easyModeSlugs` si tu veux l'inclure en mode facile

### Commandes

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
```

### Version et changelog

- Version actuelle: beta 0.1.2
- Changelog: voir `CHANGELOG.md`
- Regle d'equipe: mettre a jour le changelog a chaque evolution fonctionnelle, technique, test, ou correction.
- Commande utile: `npm run release:notes -- 0.1.3-beta` pour pre-creer une nouvelle entree datee.

### Structure (resume)

```text
src/
  domain/
  application/
  infrastructure/
    data/
      blazonDb.json
    repositories/
  presentation/
  test/
```

### Deploiement GitHub Pages

- Workflow: `.github/workflows/deploy.yml`
- Build Vite configure pour Pages (`base: /seven-sigils/`)

---

## English

Seven Sigils is a web quiz game about heraldic sigils from the Game of Thrones universe, built with React, TypeScript, and Vite.

### Features

- Interactive quiz with 4 options per question
- Two game modes: `fixed` and `infinite`
- Two difficulty levels:
  - `easy`: restricted pool of 30 configurable houses
  - `hard`: larger pool based on all playable blazons
- Progressive hint system
- Direct links to La Garde de Nuit reference pages
- Source attribution and credits

### Internal blazon database

Single source of truth:

- `src/infrastructure/data/blazonDb.json`

This file stores:

- `easyModeSlugs`: list of slugs used in easy mode
- `entries`: per-slug metadata (label, kind, variantOf, includeInHard, hints, housePageUrl, motto, domain, translation, etc.)

Important:

- Gameplay is still driven by actual image files in `All Blasons/`
- An entry without a matching image file will not become a playable question

### Adding or editing a house

1. Add/update the entry in `blazonDb.json`
2. Ensure the image file matches `Blason-<slug>-2014-v01-256px.png`
3. Add the slug to `easyModeSlugs` if you want it in easy mode

### Commands

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
```

### Version and changelog

- Current version: beta 0.1.2
- Changelog: see `CHANGELOG.md`
- Team rule: update the changelog for every feature, technical change, test update, or bug fix.
- Useful command: `npm run release:notes -- 0.1.3-beta` to pre-create a dated changelog entry.

### Structure (summary)

```text
src/
  domain/
  application/
  infrastructure/
    data/
      blazonDb.json
    repositories/
  presentation/
  test/
```

### GitHub Pages deployment

- Workflow: `.github/workflows/deploy.yml`
- Vite base path configured for Pages (`base: /seven-sigils/`)
