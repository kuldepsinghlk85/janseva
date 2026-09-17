const express = require('express');
const router = express.Router();
const { readDb, logAudit } = require('../utils/db');
const { classifySocialPost, generateBlogFromNews, queryConstituencyAI } = require('../utils/aiClassifier');

// Natural Language AI Chat Query
router.post('/query', (req, res) => {
  const { question, user } = req.body;
  const db = readDb();
  const response = queryConstituencyAI(question, db);

  logAudit(user, `AI Assistant Queried: "${question.slice(0, 45)}..."`, 'AI Assistant', { question });

  res.json({
    success: true,
    question,
    answer: response.answer,
    data: response.data
  });
});

// AI Classify Post Text
router.post('/classify', (req, res) => {
  const { text } = req.body;
  const classification = classifySocialPost(text);
  res.json({
    success: true,
    classification
  });
});

// AI Generate Article Draft
router.post('/generate-article', (req, res) => {
  const { topic, village, department, user } = req.body;
  const article = {
    title: `${village || 'इटावा'} में ${topic || 'विकास परियोजना'}: विधायक सरिता भदौरिया की विशेष पहल`,
    village: village || 'इटावा सदर',
    department: department || 'लोक निर्माण विभाग (PWD)',
    content: `
### ${village || 'इटावा'} के समग्र विकास की दिशा में ऐतिहासिक कदम

इटावा विधानसभा (200) को आदर्श विधानसभा बनाने के संकल्प के साथ विधायक श्रीमती सरिता भदौरिया ने ${topic || 'विकास कार्य'} की स्वीकृति एवं क्रियान्वयन हेतु संबंधित विभागीय अधिकारियों के साथ विस्तृत समीक्षा की।

#### मुख्य उपलब्धियां एवं कार्ययोजना:
1. **पारदर्शिता एवं गुणवत्ता:** निर्माण कार्य में उच्चस्तरीय गुणवत्ता सुनिश्चित करने हेतु तकनीकी टीम द्वारा नियमित जांच की जाएगी।
2. **समयबद्ध पूर्णता:** आगामी 60 दिनों के भीतर कार्य को पूर्ण कर जनता को समर्पित करने का लक्ष्य।
3. **सीधा जनलाभ:** इस कार्य से क्षेत्रीय ग्रामीणों एवं राहगीरों को वर्षों पुरानी समस्या से स्थायी मुक्ति मिलेगी।

> "हमारा निरंतर प्रयास है कि शासन की हर जनकल्याणकारी योजना का लाभ अंतिम पायदान पर खड़े व्यक्ति तक बिना किसी भेदभाव के पहुंचे।"  
> — **श्रीमती सरिता भदौरिया (विधायक, इटावा 200)**
    `.trim()
  };

  logAudit(user, `AI Generated Article for Topic: ${topic}`, 'AI Assistant', { topic, village });

  res.json({
    success: true,
    article
  });
});

module.exports = router;
