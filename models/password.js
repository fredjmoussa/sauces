const passwordValidator = require('password-validator');

// Crée un schema
const passwordSchema = new passwordValidator();

passwordSchema
.is().min(8)                                    // Minimum  8
.is().max(100)                                  // Maximum  100
.has().uppercase()                              // Contient des majucules
.has().lowercase()                              // Contient des minuscules
.has().digits(2)                                // Contient au moins deux chiffres
.has().not().spaces()                           // Ne contient pas d'espace
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist ces mdp

// Valide contre un mdp string
console.log(passwordSchema.validate('validPASS123'));
// => Vrai
console.log(passwordSchema.validate('invalidPASS'));
// => Faux
// le schéma passwordSchema est exporté pour être utilisé dans d'autres parties de l'application.
module.exports = passwordSchema;