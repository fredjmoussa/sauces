const mongoose = require('mongoose'); //importe les modules requis, mongoose pour la gestion de la base de données MongoDB, uniqueValidator pour la validation unique des propriétés du schéma et MongooseErrors pour le traitement des erreurs Mongoose.
const uniqueValidator = require('mongoose-unique-validator'); //Le plugin uniqueValidator est ajouté au schéma pour assurer la validation unique des propriétés du schéma.
const MongooseErrors = require('mongoose-errors') //Le plugin MongooseErrors est ajouté pour traiter les erreurs Mongoose.
const userSchema = mongoose.Schema({
  //définit un schéma pour les utilisateurs avec les propriétés email et password qui sont requises et uniques respectivement.
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(MongooseErrors);
//le modèle de schéma est exporté avec la méthode module.exports pour être utilisé dans d'autres parties de l'application.
module.exports = mongoose.model('user', userSchema);

