const http = require('http'); // Importe le module 'http' de Node.js
const app = require('./app'); // Importe le module 'app' défini dans un fichier séparé

const normalizePort = val => { // Définit une fonction qui normalise le numéro de port
  const port = parseInt(val, 10); // Convertit la valeur en entier

  if (isNaN(port)) { // Si la valeur n'est pas un nombre,
    return val; // retourne la valeur telle quelle
  }
  if (port >= 0) { // Si le port est positif,
    return port; // retourne le port
  }
  return false; // Dans tous les autres cas, retourne 'false'
};
const port = normalizePort(process.env.PORT || '3000'); // Utilise la fonction pour normaliser le port
app.set('port', port); // Définit le port dans l'application

const errorHandler = error => { // Définit une fonction de gestion des erreurs
  if (error.syscall !== 'listen') { // Si l'erreur ne concerne pas l'écoute du serveur,
    throw error; // lève une exception
  }
  const address = server.address(); // Récupère l'adresse du serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port; // Définit une chaîne de message d'erreur
  switch (error.code) { // Selon le code d'erreur,
    case 'EACCES': // Si le port nécessite des privilèges élevés,
      console.error(bind + ' requires elevated privileges.');  // Affiche un message d'erreur indiquant que le port nécessite des privilèges élevés
      process.exit(1); // Quitte le processus avec un code d'erreur non nul
      break; // Quitte le switch
    case 'EADDRINUSE': // Si le port est déjà utilisé,
      console.error(bind + ' is already in use.'); // Affiche un message d'erreur indiquant que le port est déjà utilisé
      process.exit(1); // Quitte le processus avec un code d'erreur non nul
      break; // Quitte le switch
    default: // Dans tous les autres cas,
      throw error; // lève une exception
  }
};

const server = http.createServer(app); // Crée un serveur HTTP en utilisant l'application définie dans le fichier './app'

server.on('error', errorHandler); // Configure un gestionnaire d'événements pour les erreurs du serveur
server.on('listening', () => { // Configure un gestionnaire d'événements pour l'écoute du serveur
  const address = server.address(); // Récupère l'adresse du serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port; // Définit une chaîne de message indiquant l'adresse d'écoute
  console.log('Listening on ' + bind); // Affiche le message dans la console
});

server.listen(port); // Met le serveur en écoute sur le port spécifié
