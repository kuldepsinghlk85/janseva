// server/routes/festivals.js
const express = require('express');
const router = express.Router();
const festivalController = require('../controllers/festivalController');

router.get('/', festivalController.getAll);
router.post('/', festivalController.create);
router.put('/:id', festivalController.updateItem);
router.delete('/:id', festivalController.deleteItem);
router.post('/activate/:id', festivalController.activate);
router.put('/', festivalController.update);
router.post('/toggle', festivalController.toggle);

module.exports = router;
