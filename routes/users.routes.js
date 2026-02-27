var express = require('express');
const userController = require('../controllers/user.controller');
var router = express.Router();

/* GET users listing. */
router.get('/getAllUsers', userController.getAll) 
router.get('/getUserByEmail',userController.getUserByEmail)
router.get('/getUserById/:id', userController.getById);

router.post('/addUser', userController.create);

module.exports = router;
