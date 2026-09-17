// server/services/blogService.js
// Blog Service Layer communicating with blogs.js

const { blogs } = require('../data/blogs');

class BlogService {
  getAllBlogs(filter = {}) {
    let list = [...blogs];
    if (filter.status && filter.status !== 'All') {
      list = list.filter(b => b.status === filter.status);
    }
    if (filter.publicOnly === 'true') {
      list = list.filter(b => b.status === 'published');
    }
    return list;
  }

  getBlogById(id) {
    return blogs.find(b => b.id === Number(id) || b.id === id || b.slug === id);
  }

  createBlog(data) {
    const newBlog = {
      id: blogs.length ? Math.max(...blogs.map(b => Number(b.id) || 0)) + 1 : 101,
      title: data.title || "शीर्षक रहित ब्लॉग",
      slug: (data.title || "blog").toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
      content: data.content || "",
      excerpt: data.excerpt || "",
      status: data.status || "published",
      village: data.village || "इटावा सदर",
      category: data.category || "विकास कार्य",
      author: data.author || "कार्यालय श्रीमती सरिता भदौरिया (विधायक, इटावा)",
      image: data.image || "/images/assets/work_rampur_road.jpg",
      tags: data.tags || ["Development", "Etawah"],
      views: 0,
      shares: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    blogs.unshift(newBlog);
    return newBlog;
  }

  updateBlog(id, data) {
    const idx = blogs.findIndex(b => b.id === Number(id) || b.id === id);
    if (idx === -1) return null;
    blogs[idx] = { ...blogs[idx], ...data };
    return blogs[idx];
  }

  deleteBlog(id) {
    const idx = blogs.findIndex(b => b.id === Number(id) || b.id === id);
    if (idx === -1) return false;
    blogs.splice(idx, 1);
    return true;
  }
}

module.exports = new BlogService();
