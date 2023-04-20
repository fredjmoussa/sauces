const bcrypt = require ('bcrypt'); //importe les bibliothèques externes nécessaires à l'exécution du code, y compris "bcrypt" pour hasher le mot de passe de l'utilisateur,
const User = require ('../models/user') //"User" est un modèle Mongoose pour les utilisateurs
const jwt = require('jsonwebtoken'); // "jsonwebtoken" pour générer un jeton JWT pour l'authentification
const dotenv = require('dotenv'); // dotenv pour gérer les variables d'environnement.
dotenv.config(); // cette méthode permet de configurer les variables d'environnement définies dans un fichier .env.
//définit la méthode "signup" qui sera utilisée pour enregistrer un nouvel utilisateur.
exports.signup = (req, res, next) => { //Il prend en entrée une requête HTTP et une réponse HTTP, ainsi qu'une fonction "next" (qui n'est pas utilisée dans ce code). 
    bcrypt.hash(req.body.password, 10) //La méthode "bcrypt.hash" est utilisée pour hasher le mot de passe de l'utilisateur
      .then(hash => { //puis un nouvel objet "User" est créé avec les informations d'e-mail et de mot de passe.
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save() //L'objet est ensuite enregistré dans la base de données en utilisant la méthode "save".
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) //En cas de réussite, un message de confirmation est retourné dans la réponse avec un statut HTTP 201. 
          .catch(error => res.status(400).json({ error }));
      }) //En cas d'erreur, un message d'erreur est retourné dans la réponse avec un statut HTTP 400 ou 500 en fonction de la nature de l'erreur.
      .catch(error => res.status(500).json({ error }));
  };
//définit la méthode "login" qui sera utilisée pour authentifier un utilisateur existant. 
  exports.login = (req, res, next) => { //prend en entrée une requête HTTP et une réponse HTTP, ainsi qu'une fonction "next" 
    User.findOne({ email: req.body.email }) //Il utilise la méthode "User.findOne" pour trouver un utilisateur correspondant à l'adresse e-mail donnée dans la requête.
        .then(user => {
            if (!user) { //Si les mots de passe ne correspondent pas, un message d'erreur est retourné dans la réponse avec un statut HTTP 401. 
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            } //Si un utilisateur est trouvé, la méthode "bcrypt.compare" est utilisée pour comparer le mot de passe fourni dans la requête avec le mot de passe hashé enregistré dans la base de données pour cet utilisateur. 
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) { //Si les mots de passe correspondent, un token JWT est généré avec les informations de l'utilisateur
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }//  et un objet JSON contenant l'identifiant de l'utilisateur et le jeton est retourné dans la réponse avec un statut HTTP 200.
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            "RANDOM_TOKEN_SECRET" ,
                            //process.env.RANDOM_TOKEN_SECRET
                            { expiresIn: '24h' }
                        )
                    });
                }) 
                .catch(error => res.status(500).json({ error }));
        }) // En cas d'erreur, un message d'erreur est retourné dans la réponse avec un statut HTTP 500.
        .catch(error => res.status(500).json({ error }));
 };



















