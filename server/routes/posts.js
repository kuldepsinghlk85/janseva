// server/routes/posts.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { readDb, writeDb, logAudit } = require('../utils/db');

// Existing social feed endpoints
router.get('/', postController.getAll);
router.post('/sync', postController.syncAll);
router.post('/convert-to-work/:postId', postController.convertToWork);

// ============================================================================
// ALL-IN-ONE POST CREATOR (ऑल इन वन पोस्ट क्रिएटर) SAAS ENDPOINTS
// ============================================================================

const DEFAULT_SAMPLE_POSTS = [
  {
    id: 'aio_sample_1',
    title: 'इटावा विधानसभा में 50 किमी नवीन सड़क निर्माण एवं नवीनीकरण कार्य का भूमिपूजन',
    category: 'विकास कार्य',
    rawText: 'इटावा विधानसभा के ग्रामीण अंचलों को मुख्य राजमार्ग से जोड़ने हेतु आज ₹42 करोड़ की लागत से 50 किलोमीटर लंबी नई सड़कों के निर्माण कार्य का विधिवत भूमिपूजन किया गया। क्षेत्रवासियों की वर्षों पुरानी मांग आज पूरी हो रही है। विकास ही हमारा संकल्प और जनसेवा ही हमारा ध्येय है।',
    htmlContent: '<p>इटावा विधानसभा के ग्रामीण अंचलों को मुख्य राजमार्ग से जोड़ने हेतु आज <strong>₹42 करोड़</strong> की लागत से <strong>50 किलोमीटर लंबी नई सड़कों</strong> के निर्माण कार्य का विधिवत भूमिपूजन किया गया।</p><p>क्षेत्रवासियों की वर्षों पुरानी मांग आज पूरी हो रही है। <em>विकास ही हमारा संकल्प और जनसेवा ही हमारा ध्येय है।</em></p>',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoFile: '',
    imageUrl: '/uploads/images/sarita_bhadauriya-1789523047198-607565.png',
    leader: {
      name: 'श्रीमती सरिता भदौरिया',
      title: 'विधायक, इटावा विधानसभा (200)',
      constituency: 'इटावा (200)',
      photo: '/uploads/images/sarita_bhadauriya-1789523047198-607565.png'
    },
    variants: {
      facebook: {
        text: '॥ विकास की अविरल धारा - इटावा विधानसभा ॥\n\nइटावा विधानसभा के ग्रामीण अंचलों को मुख्य राजमार्ग से जोड़ने हेतु आज ₹42 करोड़ की लागत से 50 किलोमीटर लंबी नई सड़कों के निर्माण कार्य का विधिवत भूमिपूजन किया गया।\n\nक्षेत्रवासियों की वर्षों पुरानी मांग आज पूरी हो रही है। विकास ही हमारा संकल्प और जनसेवा ही हमारा ध्येय है।\n\n📍 स्थान: इटावा विधानसभा (200)\n📞 जनसेवा हेल्पलाइन: +91 98765 43210\n\n#VikasKiRaftar #EtawahDevelopment #SaritaBhadauria #BJP #JanSeva',
        hashtags: ['#VikasKiRaftar', '#EtawahDevelopment', '#SaritaBhadauria', '#BJP', '#JanSeva']
      },
      twitter: {
        text: 'इटावा (200) में ₹42 करोड़ की लागत से 50 KM लंबी सड़कों का भूमिपूजन संपन्न। ग्रामीण संपर्क को मिलेगी नई गति। विकास ही संकल्प, जनसेवा ही ध्येय! 🛣️ #Etawah #VikasKiRaftar #BJP',
        hashtags: ['#Etawah', '#VikasKiRaftar', '#BJP'],
        charCount: 168
      },
      instagram: {
        text: '🛣️ विकास की नई उड़ान! 🛣️\n\nइटावा विधानसभा के ग्रामीण अंचलों को मुख्य राजमार्ग से जोड़ने हेतु आज ₹42 करोड़ की लागत से 50 किलोमीटर लंबी सड़कों का भूमिपूजन हुआ।\n\n✅ 50 KM नई सड़कें\n✅ 18+ गांवों को डायरेक्ट कनेक्टिविटी\n✅ ₹42 करोड़ की लागत\n\n🔗 अधिक जानकारी हेतु लिंक बायो में देखें!\n.\n.\n.\n#Etawah #SaritaBhadauria #Development #BJP4UP #Infrastructure #RoadConstruction #JanSeva #UttarPradesh #TransformingUP',
        hashtags: ['#Etawah', '#SaritaBhadauria', '#Development', '#BJP4UP', '#Infrastructure', '#JanSeva']
      },
      whatsapp: {
        text: '*📢 इटावा विधानसभा विकास समाचार*\n\n*५० किमी नवीन सड़कों का भव्य भूमिपूजन!*\n\nइटावा विधानसभा के ग्रामीण अंचलों को मुख्य राजमार्ग से जोड़ने हेतु आज *₹42 करोड़* की लागत से 50 किलोमीटर लंबी नई सड़कों का निर्माण कार्य आरंभ हुआ।\n\n📍 *विधानसभा:* इटावा सदर (200)\n🏛️ *जनप्रतिनिधि:* श्रीमती सरिता भदौरिया (विधायक)\n🌐 *वेबसाइट:* https://janseva-etawah200.org\n\n_जनसेवा ही सच्ची राजनीति है।_'
      },
      linkedin: {
        text: 'Delighted to inaugurate the ground-breaking ceremony for 50 km of rural-to-highway connectivity roads in Etawah Constituency (200) with a sanction of ₹42 Crores.\n\nRobust infrastructure is the bedrock of economic self-reliance. Committed to delivering world-class connectivity to every citizen.\n\n#InfrastructureDevelopment #Etawah #PublicService #GoodGovernance'
      }
    },
    status: 'published',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

// Helper to get or init allInOnePosts
function getAllInOnePosts(db) {
  if (!db.allInOnePosts || !Array.isArray(db.allInOnePosts) || db.allInOnePosts.length === 0) {
    db.allInOnePosts = DEFAULT_SAMPLE_POSTS;
    writeDb(db);
  }
  return db.allInOnePosts;
}

// GET all All-in-One Posts
router.get('/all-in-one', (req, res) => {
  try {
    const db = readDb();
    const posts = getAllInOnePosts(db);
    const socialConfig = db.socialConfig || {
      facebookPage: db.mla?.contact?.facebook || 'https://www.facebook.com/mlaetawah',
      twitterHandle: 'mlaetawah',
      instagramUsername: 'mlaetawah',
      whatsappNumber: db.mla?.contact?.whatsapp || '+919876543210',
      linkedinUrl: ''
    };
    res.json({
      success: true,
      posts,
      socialConfig,
      activeLeader: db.mla || {}
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// CREATE a new All-in-One Post
router.post('/all-in-one', (req, res) => {
  try {
    const { post, user = 'Admin' } = req.body;
    if (!post || (!post.title && !post.rawText)) {
      return res.status(400).json({ success: false, message: 'शीर्षक या विवरण अनिवार्य है!' });
    }

    const db = readDb();
    getAllInOnePosts(db);

    const newPost = {
      id: 'aio_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      title: post.title || 'नई सोशल मीडिया पोस्ट',
      category: post.category || 'विकास कार्य',
      rawText: post.rawText || '',
      htmlContent: post.htmlContent || post.rawText || '',
      videoUrl: post.videoUrl || '',
      videoFile: post.videoFile || '',
      imageUrl: post.imageUrl || '',
      leader: post.leader || {
        name: db.mla?.name || 'श्रीमती सरिता भदौरिया',
        title: db.mla?.title || 'विधायक, इटावा विधानसभा (200)',
        constituency: db.mla?.constituency || 'इटावा (200)',
        photo: db.mla?.photo || '/uploads/images/sarita_bhadauriya-1789523047198-607565.png'
      },
      variants: post.variants || {},
      status: post.status || 'published',
      createdAt: new Date().toISOString()
    };

    db.allInOnePosts.unshift(newPost);
    writeDb(db);
    logAudit(user, `Created All-in-One Social Post: "${newPost.title}"`, 'All-in-One Post Creator', newPost);

    res.json({
      success: true,
      message: 'ऑल इन वन पोस्ट सफलतापूर्वक सुरक्षित की गई!',
      post: newPost,
      posts: db.allInOnePosts
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE an existing All-in-One Post
router.put('/all-in-one/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { post, user = 'Admin' } = req.body;
    const db = readDb();
    const posts = getAllInOnePosts(db);

    const idx = posts.findIndex(p => p.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'पोस्ट नहीं मिली!' });
    }

    posts[idx] = {
      ...posts[idx],
      ...post,
      updatedAt: new Date().toISOString()
    };

    writeDb(db);
    logAudit(user, `Updated All-in-One Social Post: "${posts[idx].title}"`, 'All-in-One Post Creator', posts[idx]);

    res.json({
      success: true,
      message: 'पोस्ट सफलतापूर्वक अपडेट की गई!',
      post: posts[idx],
      posts
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE an All-in-One Post
router.delete('/all-in-one/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { user = 'Admin' } = req.body;
    const db = readDb();
    const posts = getAllInOnePosts(db);

    const filtered = posts.filter(p => p.id !== id);
    if (filtered.length === posts.length) {
      return res.status(404).json({ success: false, message: 'पोस्ट नहीं मिली!' });
    }

    db.allInOnePosts = filtered;
    writeDb(db);
    logAudit(user, `Deleted All-in-One Social Post id: ${id}`, 'All-in-One Post Creator', { id });

    res.json({
      success: true,
      message: 'पोस्ट सफलतापूर्वक हटाई गई!',
      posts: db.allInOnePosts
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET / PUT Social Media Config
router.get('/all-in-one/social-config', (req, res) => {
  try {
    const db = readDb();
    const config = db.socialConfig || {
      facebookPage: db.mla?.contact?.facebook || 'https://www.facebook.com/mlaetawah',
      twitterHandle: 'mlaetawah',
      instagramUsername: 'mlaetawah',
      whatsappNumber: db.mla?.contact?.whatsapp || '+919876543210',
      linkedinUrl: ''
    };
    res.json({ success: true, socialConfig: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/all-in-one/social-config', (req, res) => {
  try {
    const { config, user = 'Admin' } = req.body;
    const db = readDb();
    db.socialConfig = {
      ...(db.socialConfig || {}),
      ...config
    };
    writeDb(db);
    logAudit(user, 'Updated Social Media Profiles Configuration', 'All-in-One Post Creator', db.socialConfig);
    res.json({
      success: true,
      message: 'सोशल मीडिया लिंक्स सफलतापूर्वक सुरक्षित किए गए!',
      socialConfig: db.socialConfig
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

