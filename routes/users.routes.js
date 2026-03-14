var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

// Toutes les routes nécessitent d'être authentifié
router.use(authMiddleware);

//   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//      Profil utilisateur connecté (TOUS)
// !!!!!!!!!!!!!!!!!!!!!!!!!!

router.get('/me', userController.getMyProfile);

router.patch('/updateMe', userController.updateMyProfile);

router.patch('/updatePassword', userController.updatePassword);

//     !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//     Consultation utilisateurs (ADMIN, MANAGER)
//     !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
router.get('/getAllUsers', roleMiddleware('ADMIN', 'MANAGER')  ,userController.getAll) 

router.get('/getUserByEmail',roleMiddleware('ADMIN', 'MANAGER'),userController.getUserByEmail)

router.get('/getUserById/:id', roleMiddleware('ADMIN', 'MANAGER'),userController.getById);

//    Gestion utilisateurs (ADMIN uniquement)
// POST - Créer un utilisateur (ADMIN uniquement)

router.post('/addUser', roleMiddleware('ADMIN'),userController.createUser);

// PATCH - Modification des utilisateur ( Admin uniquement )
router.patch('/updateUserByAdmin/:id', roleMiddleware('ADMIN'), userController.updateUserByAdmin);


// PATCH - Activer/Désactiver (ADMIN uniquement)

router.patch('/toggle/:id',roleMiddleware('ADMIN'), userController.toggleActive);

// DELETE - Supprimer un utilisateur (ADMIN uniquement)

router.delete('/deleteUserById/:id', roleMiddleware('ADMIN'),userController.deleteUserById);


module.exports = router;
