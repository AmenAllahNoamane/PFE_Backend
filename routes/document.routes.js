const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const upload = require('../middleware/upload');


router.use(authMiddleware);

router.post( '/upload',roleMiddleware('COMPTABLE', 'MANAGER', 'ADMIN'), (req, res,next) => {
  upload.single("file")(req, res, (err) => {

    if (err) {
      return res.status(400).json({
        error: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "Aucun fichier fourni"
      });
    }

  next();
  }); 
},documentController.upload);

router.get('/all',roleMiddleware( 'MANAGER', 'ADMIN'),documentController.getAllDocuments);

router.get('/myDocuments',roleMiddleware( 'COMPTABLE','MANAGER', 'ADMIN'),documentController.getMyDocuments)

router.get('/DocumentById/:id',roleMiddleware('COMPTABLE', 'MANAGER', 'ADMIN'),documentController.getById);


router.delete('/delete/:id',roleMiddleware('COMPTABLE', 'MANAGER', 'ADMIN'),documentController.delete);








module.exports = router;