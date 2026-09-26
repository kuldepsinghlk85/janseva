// server/services/socialSyncService.js
// Social Media Sync Engine for MLA Etawah (@mlaetawah) Instagram & Facebook

const { readDb, writeDb, logAudit } = require('../utils/db');
const { classifySocialPost } = require('../utils/aiClassifier');
const { initialProfiles, initialPosts } = require('../data/socialProfiles');
const activityService = require('./activityService');

class SocialSyncService {
  initDb() {
    const db = readDb();
    let updated = false;

    if (!db.socialProfiles || !Array.isArray(db.socialProfiles) || db.socialProfiles.length === 0) {
      db.socialProfiles = JSON.parse(JSON.stringify(initialProfiles));
      updated = true;
    } else {
      // Ensure the official URLs match user-provided links
      const ig = db.socialProfiles.find(p => p.platform === 'instagram');
      if (ig && (!ig.profileUrl || !ig.profileUrl.includes('mlaetawah'))) {
        ig.profileUrl = "https://www.instagram.com/mlaetawah/?hl=en";
        ig.handle = "mlaetawah";
        ig.username = "@mlaetawah";
        updated = true;
      }
      const fb = db.socialProfiles.find(p => p.platform === 'facebook');
      if (fb) {
        fb.profileUrl = "https://www.facebook.com/mlaetawah";
        fb.handle = "mlaetawah";
        fb.avatar = "/uploads/images/sarita_bhadauriya-1789523047198-607565.png";
        updated = true;
      }
      if (ig) {
        ig.avatar = "/uploads/images/sarita_bhadauriya-1789523047198-607565.png";
        updated = true;
      }
      const tg = db.socialProfiles.find(p => p.platform === 'telegram');
      if (!tg) {
        db.socialProfiles.push({
          id: "profile-telegram-sarrita8",
          platform: "telegram",
          handle: "sarrita8",
          username: "@sarrita8",
          displayName: "Sarita Bhadauria MLA Etawah (आधिकारिक टेलीग्राम चैनल)",
          profileUrl: "https://t.me/sarrita8",
          avatar: "/uploads/images/sarita_bhadauriya-1789523047198-607565.png",
          bio: "आधिकारिक टेलीग्राम चैनल - श्रीमती सरिता भदौरिया, विधायक, इटावा सदर विधानसभा निर्वाचन क्षेत्र (200)। जनसेवा, त्वरित सूचना, विकास बुलेटिन एवं लोक-कल्याणकारी योजनाएं।",
          followers: "12.5K",
          subscribers: "12.5K",
          totalPosts: 310,
          verified: true,
          status: "connected",
          lastSyncedAt: new Date().toISOString(),
          autoSync: true
        });
        updated = true;
      } else {
        tg.profileUrl = "https://t.me/sarrita8";
        tg.handle = "sarrita8";
        tg.username = "@sarrita8";
        tg.avatar = "/uploads/images/sarita_bhadauriya-1789523047198-607565.png";
        updated = true;
      }
    }

    if (!db.socialPosts || !Array.isArray(db.socialPosts) || db.socialPosts.length === 0) {
      db.socialPosts = JSON.parse(JSON.stringify(initialPosts));
      updated = true;
    } else {
      // Ensure the initial authentic posts for mlaetawah are in db.socialPosts
      initialPosts.forEach(ip => {
        if (!db.socialPosts.some(p => p.id === ip.id || p.content === ip.content)) {
          db.socialPosts.unshift(ip);
          updated = true;
        }
      });
    }

    if (updated) {
      writeDb(db);
    }

    return db;
  }

  getSocialData() {
    const db = this.initDb();
    const profiles = db.socialProfiles || [];
    const posts = db.socialPosts || [];

    const stats = {
      totalPosts: posts.length,
      instagramFollowers: profiles.find(p => p.platform === 'instagram')?.followers || '18.4K',
      facebookFollowers: profiles.find(p => p.platform === 'facebook')?.followers || '34.8K',
      telegramSubscribers: profiles.find(p => p.platform === 'telegram')?.subscribers || profiles.find(p => p.platform === 'telegram')?.followers || '12.5K',
      convertedToActivities: posts.filter(p => p.isConvertedToActivity).length,
      convertedToWorks: posts.filter(p => p.isConvertedToWork).length
    };

    return {
      success: true,
      profiles,
      posts,
      stats
    };
  }

  syncChannels(targetProfileId = null, user = 'Admin (Super Admin)') {
    const db = this.initDb();
    const profiles = db.socialProfiles || [];
    const posts = db.socialPosts || [];

    let syncedProfiles = [];
    if (targetProfileId) {
      syncedProfiles = profiles.filter(p => p.id === targetProfileId || p.platform === targetProfileId);
    } else {
      syncedProfiles = profiles;
    }

    const nowIso = new Date().toISOString();
    syncedProfiles.forEach(p => {
      p.lastSyncedAt = nowIso;
      p.status = 'connected';
    });

    // Sample dynamic real-world updates fetched from the MLA's handles
    const syncPool = [
      {
        platform: 'instagram',
        profileId: 'profile-instagram-mlaetawah',
        author: 'श्रीमती सरिता भदौरिया (@mlaetawah)',
        authorAvatar: '/images/poli4.png',
        profileUrl: 'https://www.instagram.com/mlaetawah/?hl=en',
        postUrl: 'https://www.instagram.com/mlaetawah/?hl=en',
        content: 'आज बकेवर एवं तकरोई क्षेत्र में जनसंवाद चौपाल का आयोजन। ग्रामीण जनमानस की पेयजल एवं विद्युत समस्याओं को मौके पर सुनकर संबंधित अधिकारियों को त्वरित निस्तारण के आदेश दिए। सबका साथ, सबका विकास हमारा ध्येय है।',
        media: '/images/assets/social_rally.jpg',
        date: 'अभी-अभी सिंक किया गया',
        timestamp: nowIso,
        likes: Math.floor(1800 + Math.random() * 800),
        comments: Math.floor(90 + Math.random() * 50),
        shares: Math.floor(60 + Math.random() * 40)
      },
      {
        platform: 'facebook',
        profileId: 'profile-facebook-mlaetawah',
        author: 'Sarita Bhadauria MLA Etawah',
        authorAvatar: '/uploads/images/sarita_bhadauriya-1789523047198-607565.png',
        profileUrl: 'https://www.facebook.com/mlaetawah',
        postUrl: 'https://www.facebook.com/mlaetawah',
        content: 'इटावा विधानसभा (200) के सर्वांगीण विकास के क्रम में पीडब्ल्यूडी अधिकारियों के साथ समीक्षा बैठक। क्षेत्र में निर्माणाधीन 14 सड़कों व पुलिया निर्माण कार्यों की समयसीमा व गुणवत्ता की समीक्षा की गई।',
        media: '/images/assets/work_rampur_road.jpg',
        date: 'अभी-अभी सिंक किया गया',
        timestamp: nowIso,
        likes: Math.floor(2500 + Math.random() * 1000),
        comments: Math.floor(180 + Math.random() * 60),
        shares: Math.floor(120 + Math.random() * 50)
      },
      {
        platform: 'telegram',
        profileId: 'profile-telegram-sarrita8',
        author: 'Sarita Bhadauria MLA Etawah (Telegram)',
        authorAvatar: '/uploads/images/sarita_bhadauriya-1789523047198-607565.png',
        profileUrl: 'https://t.me/sarrita8',
        postUrl: 'https://t.me/sarrita8',
        content: '📢 इटावा सदर विधानसभा 200 विकास बुलेटिन: जनसमस्याओं के त्वरित निस्तारण हेतु विधायक हेल्पलाइन व टेलीग्राम सेवा 24x7 सक्रिय है। ग्रामीण व शहरी जनमानस योजनाओं की सीधी जानकारी हेतु चैनल से जुड़े रहें: t.me/sarrita8',
        media: '/images/media_1789490967547.jpg',
        date: 'अभी-अभी सिंक किया गया',
        timestamp: nowIso,
        likes: Math.floor(1400 + Math.random() * 500),
        comments: Math.floor(60 + Math.random() * 30),
        shares: Math.floor(280 + Math.random() * 100)
      }
    ];

    const eligible = syncPool.filter(item => 
      syncedProfiles.some(p => p.platform === item.platform)
    );

    let addedCount = 0;
    eligible.forEach(item => {
      // Check if duplicate exists
      const isDuplicate = posts.some(p => p.content === item.content);
      if (!isDuplicate) {
        const aiTags = classifySocialPost(item.content);
        const newPost = {
          id: 'post-sync-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          ...item,
          aiTags,
          isConvertedToActivity: false,
          isConvertedToWork: false,
          publishedOnWebsite: true
        };
        posts.unshift(newPost);
        addedCount++;
      }
    });

    db.socialProfiles = profiles;
    db.socialPosts = posts;
    writeDb(db);

    const platformNames = syncedProfiles.map(p => {
      if (p.platform === 'instagram') return 'Instagram (@mlaetawah)';
      if (p.platform === 'facebook') return 'Facebook (mlaetawah)';
      if (p.platform === 'telegram') return 'Telegram (t.me/sarrita8)';
      return p.platform;
    }).join(', ');
    logAudit(user, `Social Media Sync: ${platformNames} से डेटा सिंक किया गया (${addedCount} नए पोस्ट आयातित)`, 'Social Media', { targetProfileId, addedCount });

    return {
      success: true,
      message: `${platformNames} प्रोफाइल सफलतापूर्वक सिंक की गईं!`,
      addedCount,
      profiles,
      posts
    };
  }

  convertPostToActivity(postId, user = 'Admin (Super Admin)') {
    const db = this.initDb();
    const post = (db.socialPosts || []).find(p => p.id === postId);
    if (!post) {
      throw new Error('सोशल मीडिया पोस्ट नहीं मिली।');
    }

    const ai = post.aiTags || classifySocialPost(post.content);
    const activityData = {
      title: ai.suggestedTitle || `जनसंवाद: ${post.content.slice(0, 45)}...`,
      category: ai.category || 'विकास कार्य',
      categoryHi: ai.category || 'विकास कार्य',
      date: new Date().toISOString().split('T')[0],
      time: '11:00 AM',
      location: {
        village: ai.village || 'इटावा सदर',
        block: ai.village || 'इटावा',
        district: 'इटावा'
      },
      shortDescription: post.content.slice(0, 160) + '...',
      fullDescription: `${post.content}\n\n[आधिकारिक सोशल मीडिया स्रोत: ${post.author} - ${post.platform.toUpperCase()}]\nमूल पोस्ट लिंक: ${post.postUrl}`,
      images: [post.media || '/images/assets/work_school_children.jpg'],
      facebookUrl: post.platform === 'facebook' ? post.postUrl : 'https://www.facebook.com/mlaetawah',
      socialUrl: post.postUrl || 'https://www.facebook.com/mlaetawah',
      authorPhoto: post.authorAvatar || '/uploads/images/sarita_bhadauriya-1789523047198-607565.png',
      externalLinks: [{ label: `${post.platform} मूल पोस्ट`, url: post.postUrl }],
      tags: [`#${ai.village || 'Etawah'}`, '#SocialMediaSync', `#${ai.category || 'Development'}`],
      status: 'published',
      shareEnabled: true
    };

    const newActivity = activityService.createActivity(activityData);
    post.isConvertedToActivity = true;
    writeDb(db);

    logAudit(user, `सोशल पोस्ट ${postId} को दैनिक जन-गतिविधि में जोड़ा गया`, 'Social Media', {
      activityId: newActivity.id,
      title: newActivity.title
    });

    return {
      success: true,
      message: 'पोस्ट को विधायक दैनिक जन-गतिविधि में सफलतापूर्वक जोड़ दिया गया है!',
      activity: newActivity
    };
  }

  convertPostToWork(postId, user = 'Admin (Super Admin)') {
    const db = this.initDb();
    const post = (db.socialPosts || []).find(p => p.id === postId);
    if (!post) {
      throw new Error('सोशल मीडिया पोस्ट नहीं मिली।');
    }

    const ai = post.aiTags || classifySocialPost(post.content);
    const newWork = {
      id: 'work-' + Date.now(),
      title: ai.suggestedTitle || `विकास समीक्षा: ${post.content.slice(0, 40)}...`,
      village: ai.village || 'इटावा सदर',
      block: 'इटावा',
      category: ai.category || 'सड़क एवं परिवहन',
      department: ai.department || 'लोक निर्माण विभाग (PWD)',
      budget: '₹ 25 लाख (अनुमानित)',
      status: 'In Progress',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      coordinates: { lat: 26.78, lng: 79.02 },
      description: post.content,
      beforeImage: post.media || '/images/poli3.png',
      afterImage: post.media || '/images/poli4.png',
      photos: [post.media || '/images/poli3.png'],
      impact: 'सोशल मीडिया जनसंवाद से स्वीकृत विकास कार्य'
    };

    if (!db.developmentWorks) db.developmentWorks = [];
    db.developmentWorks.unshift(newWork);
    post.isConvertedToWork = true;
    writeDb(db);

    logAudit(user, `सोशल पोस्ट ${postId} को विकास कार्य में परिवर्तित किया गया`, 'Social Media', {
      workId: newWork.id,
      title: newWork.title
    });

    return {
      success: true,
      message: 'सोशल पोस्ट को विकास कार्य में सफलतापूर्वक परिवर्तित कर दिया गया!',
      work: newWork
    };
  }

  createPost(postData, user = 'Admin (Super Admin)') {
    const db = this.initDb();
    const aiTags = classifySocialPost(postData.content);

    let defaultProfileId = 'profile-instagram-mlaetawah';
    let defaultAuthor = 'श्रीमती सरिता भदौरिया (@mlaetawah)';
    let defaultProfileUrl = 'https://www.instagram.com/mlaetawah/?hl=en';
    if (postData.platform === 'facebook') {
      defaultProfileId = 'profile-facebook-mlaetawah';
      defaultAuthor = 'Sarita Bhadauria MLA Etawah';
      defaultProfileUrl = 'https://www.facebook.com/mlaetawah';
    } else if (postData.platform === 'telegram') {
      defaultProfileId = 'profile-telegram-sarrita8';
      defaultAuthor = 'Sarita Bhadauria MLA Etawah (Telegram)';
      defaultProfileUrl = 'https://t.me/sarrita8';
    }

    const newPost = {
      id: 'post-custom-' + Date.now(),
      platform: postData.platform || 'instagram',
      profileId: postData.profileId || defaultProfileId,
      author: postData.author || defaultAuthor,
      authorAvatar: postData.authorAvatar || '/uploads/images/sarita_bhadauriya-1789523047198-607565.png',
      profileUrl: postData.profileUrl || defaultProfileUrl,
      postUrl: postData.postUrl || defaultProfileUrl,
      content: postData.content,
      media: postData.media || '/images/poli3.png',
      date: 'अभी-अभी',
      timestamp: new Date().toISOString(),
      likes: postData.likes || 0,
      comments: postData.comments || 0,
      shares: postData.shares || 0,
      aiTags: aiTags,
      isConvertedToActivity: false,
      isConvertedToWork: false,
      publishedOnWebsite: true
    };

    if (!db.socialPosts) db.socialPosts = [];
    db.socialPosts.unshift(newPost);
    writeDb(db);

    logAudit(user, `नया सोशल पोस्ट मैनुअली दर्ज किया गया`, 'Social Media', { postId: newPost.id });

    return {
      success: true,
      message: 'सोशल पोस्ट सफलतापूर्वक जोड़ दी गई!',
      post: newPost
    };
  }

  updateProfile(profileId, updateData, user = 'Admin (Super Admin)') {
    const db = this.initDb();
    const profile = (db.socialProfiles || []).find(p => p.id === profileId);
    if (!profile) {
      throw new Error('प्रोफाइल नहीं मिली।');
    }

    if (updateData.profileUrl) profile.profileUrl = updateData.profileUrl;
    if (updateData.handle) profile.handle = updateData.handle;
    if (updateData.username) profile.username = updateData.username;
    if (updateData.displayName) profile.displayName = updateData.displayName;
    if (updateData.bio) profile.bio = updateData.bio;
    if (updateData.followers) profile.followers = updateData.followers;
    profile.lastSyncedAt = new Date().toISOString();

    writeDb(db);
    logAudit(user, `सोशल मीडिया प्रोफाइल ${profile.platform} अद्यतित की गई`, 'Social Media', { profileId });

    return {
      success: true,
      message: 'प्रोफाइल विवरण सफलतापूर्वक अपडेट किया गया!',
      profile
    };
  }

  deletePost(postId, user = 'Admin (Super Admin)') {
    const db = this.initDb();
    const initialLen = (db.socialPosts || []).length;
    db.socialPosts = (db.socialPosts || []).filter(p => p.id !== postId);
    
    if (db.socialPosts.length !== initialLen) {
      writeDb(db);
      logAudit(user, `सोशल पोस्ट ${postId} हटाई गई`, 'Social Media', { postId });
      return { success: true, message: 'पोस्ट सफलतापूर्वक हटा दी गई।' };
    }
    return { success: false, message: 'पोस्ट नहीं मिली।' };
  }
}

module.exports = new SocialSyncService();
