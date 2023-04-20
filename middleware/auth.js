const jwt = require('jsonwebtoken'); //importe la bibliothèque jsonwebtoken qui permet de créer, signer et vérifier des jetons JWT.
const dotenv = require('dotenv'); //importe la bibliothèque dotenv qui permet de charger des variables d'environnement à partir d'un fichier .env.
dotenv.config(); //charge les variables d'environnement à partir d'un fichier .env .
 
module.exports = (req, res, next) => {  //exporte une fonction anonyme qui sera utilisée comme middleware pour l'authentification. Cette fonction prend en entrée les objets req (requête), res (réponse) et next (prochaine fonction middleware) de l'application Express.

   try {
       const token = req.headers.authorization.split(' ')[1]; //récupère le jeton JWT de l'en-tête d'autorisation de la requête. Il utilise la méthode split pour séparer l'en-tête d'autorisation en deux parties, séparées par un espace, et récupère la deuxième partie, qui est le jeton JWT.
       const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); //utilise la méthode verify de la bibliothèque jsonwebtoken pour vérifier la validité du jeton JWT. Le jeton et la clé secrète 'RANDOM_TOKEN_SECRET' sont passés en entrée. Si le jeton est valide, la méthode renvoie les données décodées contenues dans le jeton.
       //const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
       const userId = decodedToken.userId; // récupère l'identifiant de l'utilisateur contenu dans les données décodées du jeton JWT.
       req.auth = {
           userId: userId
       }; //ajoute les informations d'authentification de l'utilisateur (ici uniquement l'userId) à l'objet req pour que d'autres fonctions middleware puissent y accéder.
	next(); //appelle la prochaine fonction middleware de l'application Express.
   } catch(error) { // gérer les erreurs qui peuvent survenir dans le bloc try. Il est exécuté uniquement si une exception est levée dans le bloc try. Il contient une seule instruction, celle qui suit:
       res.status(401).json({ error }); // est exécutée si une exception est levée dans le bloc try. Elle envoie une réponse HTTP avec un statut 401 (non autorisé) et un message d'erreur json .
   }
};