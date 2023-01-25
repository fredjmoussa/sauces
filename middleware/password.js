const passwordSchema = require ('../models/password'); //importe le module de validation de mot de passe qui contient les règles de validation pour les mots de passe.

module.exports = (req, res, next) => { //exporte une fonction anonyme qui sera utilisée comme middleware pour la validation des mots de passe. Cette fonction prend en entrée les objets req (requête), res (réponse) et next (prochaine fonction middleware) de l'application Express.
    if(passwordSchema.validate(req.body.password)){ // utilise la méthode validate du module de validation de mot de passe pour valider le mot de passe contenu dans le corps de la requête (req.body.password). Si la validation est réussie, la condition if est vraie et la fonction next() est appelée.
        next(); // appelle la prochaine fonction middleware de l'application Express.
    }
    else {
     
        res.status(400).json({ message : 'Le mot de passe doit contenir au minimum 8 caractères, maximum 100 caractères, avec au minimum une majuscule, une minuscule, deux chiffres et sans espaces '}); //ligne est exécutée si la validation du mot de passe échoue. Elle envoie une réponse HTTP avec un statut 400 (erreur de la demande) et un message json qui décrit les règles de validation du mot de passe.
    }
}