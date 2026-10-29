# Site de l'Union Locale CGT d'Annonay

Site statique, sans dépendance : `index.html`, `style.css`, `script.js`.
Ouvre `index.html` dans un navigateur, ou dépose le dossier sur n'importe quel hébergeur (Netlify, OVH, GitHub Pages…).

## Mettre à jour le contenu

Tout est en haut de `script.js` :

- `ACTUS` : les actualités (catégorie `lutte`, `droits` ou `vie`)
- `AGENDA` : les rendez-vous (le compte à rebours suit automatiquement le prochain)
- `PERMANENCES` : jours et horaires (le voyant « ouvert / fermé » s'allume en direct)
- `PHOTOS` : la galerie. Dépose les images dans `photos/`, puis ajoute une ligne par photo :
  `{ src: "photos/manif.jpg", legende: "Manif salaires", format: "large" }`
  (`format` : `"large"`, `"haute"` ou rien). Tant que la liste est vide, des cases « Photo à venir » s'affichent.

## Photo du secrétaire général

Dépose `photos/raphael-fois.jpg` (format carré idéalement). Elle remplace automatiquement les initiales « RF ».
Conseil : images en .jpg, 1600 px de large maximum, pour que le site reste rapide.

## À compléter avant mise en ligne

- Adresse, téléphone et email dans la section Contact (`index.html`)
- `EMAIL_UL` dans `script.js` (destinataire du formulaire)
- Les actus et dates d'agenda sont des exemples : remplace-les par les vraies
- Le logo officiel est dans `logo-cgt.png` (rouge #d20012, jaune #feea00 repris dans tout le site)
