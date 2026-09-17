// server/routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAll);
router.post('/', userController.create);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.delete('/:id', userController.remove);
router.post('/login', userController.login);
router.post('/citizen-login', userController.citizenLogin);
router.post('/citizen-register', userController.citizenRegister);
router.get('/citizen-grievances/:mobile', userController.getCitizenGrievances);

module.exports = router;

