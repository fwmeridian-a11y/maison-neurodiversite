# Centraliser les réponses dans Google Sheets

Le site est un site statique (GitHub Pages) : sans backend, chaque réponse reste
sur l'appareil de la personne qui l'a saisie (`localStorage`). Ces étapes ajoutent
un Google Sheet central qui reçoit automatiquement toutes les réponses, où
qu'elles soient saisies.

## 1. Créer le Google Sheet

1. Va sur [sheets.google.com](https://sheets.google.com) et crée un classeur vide,
   par exemple nommé **"Maison de la Neurodiversité — Réponses"**.

## 2. Créer le script

1. Dans ce classeur : menu **Extensions → Apps Script**.
2. Supprime le contenu par défaut (`Code.gs`) et colle-y le contenu du fichier
   [google-apps-script.js](google-apps-script.js) de ce dossier.
3. Enregistre (icône disquette ou `Ctrl/Cmd+S`).

## 3. Déployer comme application web

1. En haut à droite : **Déployer → Nouveau déploiement**.
2. Clique sur l'icône ⚙️ à côté de "Sélectionner le type" → **Application Web**.
3. Renseigne :
   - **Exécuter en tant que** : Moi (ton compte Google)
   - **Qui a accès** : Tout le monde
4. Clique sur **Déployer**.
5. Google va demander d'autoriser le script à accéder à ta feuille de calcul
   (fenêtre d'autorisation Google) : accepte (c'est ton propre script, sur ton
   propre compte).
6. Copie l'**URL de l'application Web** obtenue — elle ressemble à :
   `https://script.google.com/macros/s/AKfycb.../exec`

## 4. Brancher l'URL sur le site

Dans [app.js](app.js), ligne ~13, remplace :

```js
const SYNC_URL = "REMPLACER_PAR_URL_APPS_SCRIPT";
```

par l'URL copiée à l'étape précédente, par exemple :

```js
const SYNC_URL = "https://script.google.com/macros/s/AKfycb.../exec";
```

Une fois cette ligne modifiée (et le site republié sur GitHub Pages) :
- chaque nouvelle réponse, où qu'elle soit saisie, part automatiquement vers le
  Google Sheet ;
- la page **Synthèse** va chercher toutes les réponses du Sheet à l'ouverture
  (bouton **🔄 Recharger depuis Google Sheets** pour forcer une actualisation) ;
- si le site est ouvert hors ligne ou que le script est indisponible, la
  réponse reste quand même sauvegardée localement (rien n'est perdu).

## 5. Redéployer après une modification du script

Si tu modifies `google-apps-script.js` plus tard, il faut créer une **nouvelle
version** du déploiement (**Déployer → Gérer les déploiements → ✏️ → Nouvelle
version**) pour que les changements soient pris en compte — l'URL, elle, ne
change pas.

## Retrouver les 2 réponses déjà données à distance

Ce mécanisme ne s'applique qu'aux réponses données **après** sa mise en place.
Pour les 2 réponses données avant, demande aux personnes concernées de rouvrir
le questionnaire sur l'appareil utilisé, d'aller dans **Synthèse** (code
`neurodiv2026`), de cliquer sur **⬇️ Exporter tout (JSON)** et de t'envoyer le
fichier. Tu pourras ensuite l'importer via **⬆️ Importer / fusionner (JSON)**
dans ta propre Synthèse — la fusion évite les doublons.
