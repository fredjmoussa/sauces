const Sauce = require('../models/sauces'); //importe le modèle de données Sauce depuis un fichier situé dans un dossier parent.
const fs = require('fs'); //importe le module fs qui fournit des fonctionnalités pour manipuler les fichiers sur le système de fichiers.

// crée une nouvelle sauce en utilisant les données fournies dans le corps de la requête et en les enregistrant dans la base de données.
exports.createSauce = (req, res, next) => { // createSauce est une fonction qui crée une nouvelle sauce en utilisant les données reçues dans la requête HTTP req et en enregistrant ces données dans la base de données. Elle envoie également une réponse HTTP avec le message "Sauce enregistrée !" en cas de succès ou une erreur en cas d'échec.
    const sauceObject = JSON.parse(req.body.sauce); // définit une constante "sauceObject" qui est un objet JSON décodé depuis la chaîne de caractères contenue dans le corps de la requête "req.body.sauce".
    delete sauceObject.userId; // supprime la propriété "userId" de "sauceObject".
    const sauce = new Sauce({ //crée une nouvelle instance de "Sauce" 
        ...sauceObject, //en utilisant les propriétés de "sauceObject"
        likes: 0, //avec des valeurs supplémentaires pour "likes", "dislikes", "userId", et "imageUrl".
        dislikes: 0,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    sauce.save() //appelle la méthode "save" sur l'instance de sauce pour l'enregistrer en base de données.
    .then(() => { res.status(201).json({message: 'Sauce enregistrée !'})})
    .catch(error => { res.status(400).json( { error })})
 };

 //récupère une sauce unique en fonction de son identifiant.
exports.getOneSauce = (req, res, next) => { //getOneSauce est une fonction qui trouve une seule sauce en utilisant l'identificateur de la sauce qui est passé dans la requête HTTP req. Elle envoie également une réponse HTTP avec les données de la sauce trouvée ou une erreur en cas d'échec.
    Sauce.findOne({ //utilise la méthode "findOne" de la classe "Sauce" pour trouver un document correspondant à un filtre spécifié. Le filtre est ici défini pour trouver un document dont l'ID correspond à celui reçu dans les paramètres de la requête HTTP.
    _id: req.params.id //spécifie le filtre pour trouver un document dont l'ID correspond à celui dans les paramètres de la requête HTTP.
  }).then( //définit un gestionnaire "then" qui sera appelé lorsque le document correspondant à l'ID sera trouvé.
    (sauce) => { //définit une fonction anonyme qui sera appelée avec le document trouvé comme argument.
      res.status(200).json(sauce); //envoie une réponse HTTP avec un statut "200" et le contenu du document trouvé dans le corps de la réponse au format JSON.
    }
  ).catch( //définit un gestionnaire "catch" qui sera appelé en cas d'erreur lors de la recherche du document.
    (error) => { //définit une fonction anonyme qui sera appelée avec l'erreur renvoyée par la méthode "findOne".
      res.status(404).json({ //envoie une réponse HTTP avec un statut "404 Not Found" et un corps de réponse contenant un objet JSON avec le message d'erreur.
        error: error //ajoute l'erreur renvoyée à l'objet JSON dans le corps de la réponse.
      });
    }
  );
};

//modifie une sauce en utilisant les données fournies dans le corps de la requête.
exports.modifySauce = (req, res, next) => { //Déclaration de la fonction d'exportation "modifySauce" qui sera utilisée pour modifier une sauce. Les arguments "req" et "res" sont des objets standard utilisés pour les requêtes HTTP, tandis que "next" est une fonction qui peut être appelée pour passer à la prochaine étape du processus de middleware.
    const sauceObject = req.file ? { //Déclaration de la variable "sauceObject". Si "req.file" existe (c'est-à-dire qu'un fichier a été envoyé avec la requête), "sauceObject" sera égal à un objet qui contient les propriétés de "JSON.parse(req.body.sauce)" et une nouvelle propriété "imageUrl" avec une URL qui pointe vers l'image associée.
        ...JSON.parse(req.body.sauce), //La syntaxe "..." est utilisée pour décompacter l'objet obtenu après l'analyse JSON de la propriété "sauce" de l'objet "req.body".
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //Définition de la propriété "imageUrl" qui sera construite en utilisant la syntaxe template literals. Le protocole utilisé pour la requête (HTTP ou HTTPS) est obtenu à partir de la propriété "req.protocol", tandis que le nom d'hôte est obtenu en appelant la fonction "req.get('host')". Le nom de fichier de l'image est obtenu à partir de la propriété "req.file.filename".
    } : { ...req.body }; //Sinon, "sauceObject" sera défini comme un objet qui contient les propriétés de "req.body".
  
    delete sauceObject.userId; //La propriété "userId" est supprimée de "sauceObject".
    Sauce.findOne({_id: req.params.id}) //La méthode "findOne" de la classe "Sauce" est appelée pour trouver une sauce qui correspond à l'identifiant fourni dans "req.params.id".
        .then((sauce) => { //Si la sauce est trouvée, une fonction callback est appelée avec la sauce trouvée comme argument.
            if (sauce.userId != req.auth.userId) { //Si "sauce.userId" n'est pas égal à "req.auth.userId", 
                res.status(401).json({ message : 'Not authorized'}); //alors un message d'erreur "Not authorized" est retourné avec un statut 401.
            } else { // Sinon, la méthode "updateOne" est appelée pour mettre à jour la sauce avec les propriétés de "sauceObject".
                sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Sauce modifiée!'})) //Si la mise à jour se passe bien, un message de réussite "Sauce modifiée!" est retourné avec un statut 200. 
                .catch(error => res.status(401).json({ error })); //Si la mise à jour échoue, un message d'erreur est retourné avec un statut 401.
            }
        })
        .catch((error) => { // Si la sauce n'est pas trouvée, un message d'erreur est retourné avec un statut 400.
            res.status(400).json({ error });
        });
 };

 //supprime une sauce en fonction de son identifiant.
 exports.deleteSauce = (req, res, next) => { //Elle prend en entrée une requête (req), une réponse (res) et un gestionnaire d'erreur (next).
    Sauce.findOne({ _id: req.params.id}) //La méthode "findOne" de la classe "Sauce" est appelée pour trouver une sauce qui correspond à l'identifiant fourni dans "req.params.id".
        .then(sauce => { //Si la sauce est trouvée, une fonction callback est appelée avec la sauce trouvée comme argument.
            if (sauce.userId != req.auth.userId) { //Si "sauce.userId" n'est pas égal à "req.auth.userId", 
                res.status(401).json({message: 'Not authorized'}); //alors un message d'erreur "Not authorized" est retourné avec un statut 401.
            } else { //Sinon, 
                const filename = sauce.imageUrl.split('/images/')[1]; //le fichier image associé à la sauce est supprimé 
                fs.unlink(`images/${filename}`, () => { //à l'aide de la méthode "unlink" de la bibliothèque "fs". 
                    sauce.deleteOne({_id: req.params.id}) //Puis, la méthode "deleteOne" est appelée pour supprimer la sauce de la base de données. 
                        .then(() => { res.status(200).json({message: 'Sauce supprimée !'})}) //Si la suppression se passe bien, un message de réussite "Sauce supprimée !" est retourné avec un statut 200. 
                        .catch(error => res.status(401).json({ error })); //Si la suppression échoue, un message d'erreur est retourné avec un statut 401.
                });
            }
        })
        .catch( error => { //Si la sauce n'est pas trouvée, un message d'erreur est retourné avec un statut 500
            res.status(500).json({ error });
        });
 };

//récupère toutes les sauces de la base de données.
exports.getAllSauce = (req, res, next) => { //récupère toutes les sauces à partir de la base de données 
    Sauce.find().then( //en utilisant la méthode find sur l'objet Sauce.
    (sauce) => { // Si la requête est un succès, 
      res.status(200).json(sauce); //il retourne un objet JSON avec le statut 200 et les sauces. 
    }
  ).catch( //Si il y a une erreur
    (error) => {
      res.status(400).json({ //il retourne un objet JSON avec le statut 400 et un message d'erreur.
        error: error
      });
    }
  );
};

//permet à un utilisateur de donner un "j'aime" ou un "je n'aime pas" à une sauce.
exports.likeOrDislike = (req, res, next) => { // Elle effectue des mises à jour en fonction du corps de la requête req.
  if (req.body.like === 1) { // Si req.body.like est égal à 1, la méthode updateOne est utilisée pour incrémenter le nombre de "j'aime" de 1 et pour ajouter l'identifiant de l'utilisateur dans la liste usersLiked.
      Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
          .then(() => res.status(200).json({ message: 'Like' }))
          .catch(error => res.status(400).json({ error }))
  } else if (req.body.like === -1) { //Si req.body.like est égal à -1, la méthode updateOne est utilisée pour incrémenter le nombre de "je n'aime pas" de 1 et pour ajouter l'identifiant de l'utilisateur dans la liste usersDisliked. 
      Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
          .then(() => res.status(200).json({ message: 'Dislike' }))
          .catch(error => res.status(400).json({ error }))
  } else { //Si req.body.like est égal à 0, la méthode findOne est utilisée pour trouver la sauce correspondante, puis il vérifie si l'utilisateur a donné un "j'aime" ou un "je n'aime pas"
      Sauce.findOne({ _id: req.params.id })
          .then(sauce => { //Si c'est un "j'aime", la méthode updateOne est utilisée pour retirer l'utilisateur de la liste usersLiked et décrémenter le nombre de "j'aime" de 1. 
              if (sauce.usersLiked.includes(req.body.userId)) {
                  Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                      .then(() => { res.status(200).json({ message: 'No Like' }) })
                      .catch(error => res.status(400).json({ error }))
              } else if (sauce.usersDisliked.includes(req.body.userId)) { //Si c'est un "je n'aime pas", la méthode updateOne est utilisée pour retirer l'utilisateur de la liste usersDisliked et décrémenter le nombre de "je n'aime pas" de 1. 
                  Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                      .then(() => { res.status(200).json({ message: 'No Dislike' }) })
                      .catch(error => res.status(400).json({ error }))
              }
          })
          .catch(error => res.status(400).json({ error })) //Si une erreur est levée, un objet JSON avec le statut 400 et un message d'erreur est retourné.




  }
}
