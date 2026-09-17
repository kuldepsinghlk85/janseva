// server/routes/templates.js
const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

router.get('/', templateController.getTemplates);
router.post('/activate/:id', templateController.activate);
router.get('/sections', templateController.getSections);
router.put('/sections', templateController.updateSections);
router.patch('/sections/:key', templateController.toggleSection);

module.exports = router;
