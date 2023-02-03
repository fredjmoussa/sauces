const mongoose = require('mongoose'); 
//importe les packages mongoose et mongoose-errors
const MongooseErrors = require('mongoose-errors')

const sauceSchema = mongoose.Schema({

  userId: { type: String, required: true }, //ID de l'utilisateur associé à cette sauce, de type String et requis
  name: { type: String, required: true }, // nom de la sauce, de type String et requis
  manufacturer: { type: String, required: true }, //fabricant de la sauce, de type String et requis
  description: { type: String, required: true }, //description de la sauce, de type String et requis
  mainPepper: { type: String, required: true }, //piment principal utilisé dans la sauce, de type String et requis
  imageUrl: { type: String, required: true }, //URL de l'image de la sauce, de type String et requis
  heat: { type: Number, required: true }, //niveau piquant de la sauce, de type Number et requis
  likes: { type: Number, required: true }, // nombre de j'aime pour la sauce, de type Number et requis
  dislikes: { type: Number, required: true }, //nombre de dislikes pour la sauce, de type Number et requis
  usersLiked: { type: [String], required: true }, //tableau de ID d'utilisateurs qui ont aimé la sauce, de type [String] et requis
  usersDisliked: { type: [String], required: true }, //tableau de ID d'utilisateurs qui ont disliké la sauce, de type [String] et requis
});
//Le package mongoose-errors est utilisé en tant que plugin pour le schéma de la sauce.
sauceSchema.plugin(MongooseErrors);
//le modèle MongoDB pour les sauces est exporté en utilisant mongoose.model avec le nom 'sauce' pour le modèle et le schéma défini précédemment.
module.exports = mongoose.model('sauce', sauceSchema);
