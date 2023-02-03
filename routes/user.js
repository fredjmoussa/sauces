const express = require('express'); //crée un module de routeur express pour gérer les demandes de l'utilisateur.
const router = express.Router(); //importe le module d'express et utilise les fonctionnalités de routeur de express.
const password = require('../middleware/password'); //importe  le module de mots de passe et le contrôleur utilisateur.

const userCtrl = require('../controllers/user'); //importe le module contrôleur utilisateur.
//définit ensuite deux routes: une pour l'inscription et une pour la connexion.
router.post('/signup', userCtrl.signup); 
router.post('/login', userCtrl.login);
//Les demandes reçues à ces routes seront redirigées vers les fonctions signup et login définies dans le contrôleur utilisateur. 
module.exports = router; // le module de routeur est exporté pour être utilisé ailleurs dans l'application.