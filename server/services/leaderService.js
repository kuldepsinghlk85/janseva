// server/services/leaderService.js
// Leader Service Layer communicating with leaders.js

const { leaders } = require('../data/leaders');

class LeaderService {
  getAllLeaders() {
    return leaders;
  }

  getLeaderById(id) {
    return leaders.find(l => l.id === Number(id) || l.id === id);
  }

  addLeader(data) {
    const newLeader = {
      id: leaders.length ? Math.max(...leaders.map(l => Number(l.id) || 0)) + 1 : 1,
      name: data.name || "नेता",
      nameEn: data.nameEn || data.name || "Leader",
      position: data.position || "मार्गदर्शक",
      party: data.party || "BJP",
      quote: data.quote || "",
      photo: data.photo || "/images/assets/modi_portrait.jpg",
      posts: data.posts || 1,
      engagement: data.engagement || "10K",
      socialUpdate: data.socialUpdate || null
    };

    leaders.push(newLeader);
    return newLeader;
  }

  deleteLeader(id) {
    const idx = leaders.findIndex(l => l.id === Number(id) || l.id === id);
    if (idx === -1) return false;
    leaders.splice(idx, 1);
    return true;
  }
}

module.exports = new LeaderService();
