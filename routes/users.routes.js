var express = require('express');
const userController = require('../controllers/user.controller');
var router = express.Router();

/* GET users  */
router.get('/getAllUsers', userController.getAll) 
router.get('/getUserByEmail',userController.getUserByEmail)
router.get('/getUserById/:id', userController.getById);

router.post('/addUser', userController.create);

//Pour COMPTABLE
router.patch('/updateUser/:id', userController.update);

//  pour activer/désactiver
router.patch('/toggle/:id', userController.toggleActive);

router.delete('/deleteUserById/:id', userController.delete);


module.exports = router;
