// server/routes/activityRoutes.js
const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// All activity routes as specified in technical specification
router.post('/create', activityController.create);
router.get('/all', activityController.getAll);
router.get('/featured', activityController.getFeatured);
router.get('/timeline', activityController.getTimeline);

// Top Homepage Featured Slider (2 to 4 activities & ordering control)
router.get('/featured-slider', activityController.getFeaturedSlider);
router.post('/featured-slider/order', activityController.updateFeaturedSliderOrder);
router.post('/featured-slider/toggle/:id', activityController.toggleFeaturedSlider);

router.get('/:id', activityController.getById);
router.put('/update/:id', activityController.update);
router.delete('/delete/:id', activityController.remove);
router.post('/share/:id', activityController.share);

// Also support RESTful shortcuts
router.get('/', activityController.getAll);
router.post('/', activityController.create);
router.put('/:id', activityController.update);
router.delete('/:id', activityController.remove);

module.exports = router;
