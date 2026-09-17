// server/routes/team.js
const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

// Categories endpoints (placed before :id to prevent collision)
router.get('/categories', teamController.getCategories);
router.post('/categories', teamController.addCategory);
router.delete('/categories/:id', teamController.deleteCategory);

// User Types endpoints
router.get('/user-types', teamController.getUserTypes);
router.post('/user-types', teamController.addUserType);
router.delete('/user-types/:id', teamController.deleteUserType);

// Team Members CRUD
router.get('/', teamController.getAll);
router.get('/:id', teamController.getById);
router.post('/', teamController.create);
router.put('/:id', teamController.update);
router.delete('/:id', teamController.remove);

module.exports = router;
