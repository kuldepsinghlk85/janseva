const express = require('express');
const router = express.Router();
const socialSyncService = require('../services/socialSyncService');

// GET all social profiles, synced posts & overview
router.get('/', (req, res) => {
  try {
    const data = socialSyncService.getSocialData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// SYNC NOW (Syncs Instagram @mlaetawah and/or Facebook mlaetawah)
router.post('/sync', (req, res) => {
  try {
    const { profileId, user } = req.body;
    const result = socialSyncService.syncChannels(profileId, user);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Convert Social Post to MLA Daily Activity (Publisher Engine)
router.post('/convert-to-activity', (req, res) => {
  try {
    const { postId, user } = req.body;
    const result = socialSyncService.convertPostToActivity(postId, user);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Convert Social Post to Development Timeline Work
router.post('/convert-to-work', (req, res) => {
  try {
    const { postId, user } = req.body;
    const result = socialSyncService.convertPostToWork(postId, user);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Create / Manually Add Social Post
router.post('/create-post', (req, res) => {
  try {
    const { user, ...postData } = req.body;
    const result = socialSyncService.createPost(postData, user);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update Profile Details (URLs, bio, etc.)
router.put('/profiles/:id', (req, res) => {
  try {
    const { user, ...updateData } = req.body;
    const result = socialSyncService.updateProfile(req.params.id, updateData, user);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Delete Post
router.delete('/posts/:id', (req, res) => {
  try {
    const { user } = req.query;
    const result = socialSyncService.deletePost(req.params.id, user);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
