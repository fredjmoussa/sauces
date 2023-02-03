const express = require('express'); //Importe "express"
const router = express.Router(); // crée une instance de routeur express.
const auth = require('../middleware/auth'); // Importe le middleware d'authentification.
const multer = require('../middleware/multer-config'); //Importe le middleware multer qui gère les fichiers (images) uploadés.

const sauceCtrl = require('../controllers/sauces'); //Importe les contrôleurs de sauces.

router.post('/', auth, multer, sauceCtrl.createSauce); //Définit une route POST pour créer une sauce qui nécessite une authentification et un traitement d'image via le middleware multer.
router.put('/:id', auth, multer, sauceCtrl.modifySauce); //Définit une route PUT pour modifier une sauce qui nécessite une authentification et un traitement d'image via le middleware multer.
router.delete('/:id', auth, sauceCtrl.deleteSauce); // Définit une route DELETE pour supprimer une sauce qui nécessite une authentification.
router.get('/:id', auth, sauceCtrl.getOneSauce); //Définit une route GET pour obtenir une sauce unique qui nécessite une authentification.
router.get('/', auth, sauceCtrl.getAllSauce); //Définit une route GET pour obtenir toutes les sauces qui nécessitent une authentification.
router.post('/:id/like', auth, sauceCtrl.likeOrDislike); //Définit une route POST pour aimer ou ne pas aimer une sauce qui nécessite une authentification.

module.exports = router; //Exporte le module de route.
