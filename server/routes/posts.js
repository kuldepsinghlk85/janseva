// server/routes/posts.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getAll);
router.post('/sync', postController.syncAll);
router.post('/convert-to-work/:postId', postController.convertToWork);

module.exports = router;
