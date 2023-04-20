const dotenv = require('dotenv') //Le premier package requis est dotenv, utilisé pour charger les variables d'environnement depuis un fichier .env.
dotenv.config() //La méthode dotenv.config() est appelée pour charger les variables d'environnement.
const express = require('express'); //Le package express est ensuite requis
const app = express(); //une instance de l'application Express est créée
const bodyParser = require('body-parser') //Le package body-parser est requis pour aider à traiter les données envoyées avec les requêtes HTTP.
const mongoose = require('mongoose'); //Le package mongoose est utilisé pour se connecter à une base de données MongoDB en utilisant une URL de connexion.
const sauces = require('./models/sauces'); //Les modèles de données pour les sauces sont importés
const saucesRoutes = require('./routes/sauces'); //Les routes pour les sauces sont importées
const userRoutes = require('./routes/user'); //Les utilisateurs sont importées 
const path = require('path'); //Le package path est utilisé pour travailler avec les chemins de fichiers.
const helmet = require('helmet'); //Le package helmet est utilisé pour renforcer la sécurité de l'application en configurant différents en-têtes HTTP.
const rateLimit = require('express-rate-limit') //Le package express-rate-limit est utilisé pour limiter le nombre de requêtes d'un même client en utilisant un fenêtre de temps donnée.
//La méthode mongoose.connect est appelée pour établir une connexion à la base de données MongoDB.
mongoose.connect("mongodb+srv://fredjmoussa:test@cluster0.idvs3aw.mongodb.net/?retryWrites=true&w=majority",
//mongoose.connect("mongodb+srv://" + process.env.MONGO_USERNAME + ":" + process.env.MONGO_PASSWORD + "@cluster0.idvs3aw.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
//Les options pour les en-têtes Access-Control-Allow-* sont définies pour permettre les requêtes à l'API depuis des domaines différents.
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
//Le middleware body-parser est configuré pour que les données de la requête soient analysées et disponibles dans le corps de la requête.
  app.use(bodyParser.json());
//Les routes pour les sauces et les utilisateurs sont enregistrées 
  app.use('/api/sauces', saucesRoutes);
  app.use('/api/auth', userRoutes);
  //Un chemin pour les images est configuré pour être servi via express.static.
  app.use('/images', express.static(path.join(__dirname, 'images')));
//La bibliothèque helmet est configurée pour ne pas utiliser la politique de sécurité du contenu.
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
//Le middleware rate limiter est configuré avec les paramètres windowMs, max, standardHeaders et legacyHeaders.
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)
//exporte l'objet "app" en tant que module dans un autre fichier qui pourra le requérir
module.exports = app;