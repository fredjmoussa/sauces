const multer = require('multer'); //importe la bibliothèque Multer qui permet de gérer l'upload de fichiers dans une application Express.

const MIME_TYPES = { //déclare une constante qui contient un objet qui associe les types de fichier avec leurs extensions. Ici il contient les types de fichier jpeg et png.
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ //déclare une constante qui contient un objet de configuration pour Multer. Il utilise la méthode diskStorage pour configurer le stockage des fichiers sur le disque.
  destination: (req, file, callback) => { //Cette propriété de l'objet de configuration définit le dossier de destination pour les fichiers téléchargés. La fonction prend en entrée req (requête), file (fichier) et callback (fonction de rappel) et utilise la méthode callback pour définir le dossier de destination comme étant 'images'.
    callback(null, 'images'); 
  },
  filename: (req, file, callback) => { // Cette propriété de l'objet de configuration définit le nom de fichier pour les fichiers téléchargés. La fonction prend en entrée req (requête), file (fichier) et callback (fonction de rappel) et utilise la méthode callback pour définir le nom de fichier en utilisant le nom original du fichier, la date actuelle et l'extension associée au type MIME du fichier.
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image'); //exporte une instance de Multer configurée avec le stockage défini précédemment et qui s'attend à recevoir un seul fichier nommé 'image' dans la requête.