# node-note

Projet node.js noté pour l'alternance 2021

# Comment run : 
Après avoir cloné le repo, lancez un `node index.js` à la racine du dossier et vous trouverez l'app sur le port 5000

# Routes :
- [Post] /login : requiert un email et un password pour demander un jwt, si on a un compte existant en bd
- [Get] /article : retourne tous les articles en BD
- [Post] /article : Crée un article (requiert d'avoir un JWT), requiert title, content et user
- [Delete] /article : Supprime un article (Requiert d'avoir un JWT), requiert un id, un user, et on doit être le créateur de l'article pour pouvoir le supprimer
- [Put] / article : Modifier un article (Requert d'avoir un JWT), requiert id,content,title,user et d'être le créateur de l'article
- [Post] /account : Créer un compte, requiert email et password
- [Get] /article/:articleId : Affiche l'article correspondant à l'id passé en param
