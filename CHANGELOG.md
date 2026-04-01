# Changelog

Toutes les evolutions notables de Seven Sigils sont documentees dans ce fichier.

Le format s'inspire de Keep a Changelog et suit une logique semver adaptee au projet.

## [0.1.2-beta] - 2026-04-01

### Ajoute
- Bouton Menu principal dans l'interface de jeu.
- Bouton Menu principal dans l'ecran de fin.
- Affichage de la version de l'application dans l'accueil et le footer.
- Fichier CHANGELOG.md pour tracer les evolutions.

### Modifie
- Les liens source fichier et source maison ne s'affichent qu'apres validation de la reponse.
- Ajout d'un leger effet de fade a l'apparition des sources.
- Aucun blason ne peut reapparaitre dans la meme session.
- Le mode facile est plafonne a 30 manches max.
- Version projet alignee en 0.1.2.

### Tests
- Mise a jour des tests unitaires et integration pour couvrir les nouveaux comportements (anti repetition, limite facile, affichage conditionnel des sources).
