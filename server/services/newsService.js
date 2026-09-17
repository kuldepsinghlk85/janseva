// server/services/newsService.js
// News RSS Service Layer communicating with news.js & blogService.js

const { news } = require('../data/news');
const blogService = require('./blogService');

class NewsService {
  getAllNews() {
    return news;
  }

  getNewsById(id) {
    return news.find(n => n.id === Number(id) || n.id === id);
  }

  addNewsSource(data) {
    const newItem = {
      id: news.length ? Math.max(...news.map(n => Number(n.id) || 0)) + 1 : 1,
      source: data.name || data.source || "स्थानीय समाचार",
      title: data.title || "इटावा विधानसभा विकास समाचार",
      location: data.location || "इटावा",
      date: new Date().toISOString().split('T')[0],
      content: data.content || "क्षेत्र में विकास कार्यों की विस्तृत समीक्षा।",
      summary: data.summary || "विकास समीक्षा एवं जनसंवाद।",
      category: data.category || "विकास कार्य",
      image: "/images/assets/work_school_children.jpg",
      tags: ["News", "Etawah"],
      status: "unread"
    };

    news.unshift(newItem);
    return newItem;
  }

  convertNewsToBlog(newsId) {
    const item = this.getNewsById(newsId);
    if (!item) throw new Error("News item not found");

    const newBlog = blogService.createBlog({
      title: `विकास की राह पर इटावा: ${item.title}`,
      content: `
### ${item.title}
**स्थान:** ${item.location} | **दिनांक:** ${item.date}

इटावा विधानसभा (200) के समग्र विकास के संकल्प के साथ विधायक श्रीमती सरिता भदौरिया निरंतर क्षेत्र में सक्रिय हैं। 

#### मुख्य बिंदु:
- **नागरिक सुविधा में विस्तार:** ${item.summary || item.content}
- **पारदर्शिता एवं गुणवत्ता:** विकास कार्यों में तय समय सीमा का पालन।
- **जनसंवाद का परिणाम:** जनता से सीधे संवाद और सुझावों के आधार पर योजनाओं का क्रियान्वयन।

> "हमारा संकल्प है कि इटावा के हर गांव, हर गली तक विकास पहुंचे।"  
> — **श्रीमती सरिता भदौरिया (विधायक, इटावा 200)**
      `.trim(),
      excerpt: item.summary || item.title,
      category: item.category || "विकास कार्य",
      village: item.location ? item.location.split(',')[0] : "इटावा",
      status: "published",
      image: item.image || "/images/assets/work_rampur_road.jpg"
    });

    item.status = "converted";
    return newBlog;
  }
}

module.exports = new NewsService();
