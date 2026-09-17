// server/data/analytics.js
// Node.js JavaScript Native Data Storage - Analytics & Monitoring

const analytics = {
  views: 542318,
  shares: 84210,
  likes: 198420,
  comments: 24890,
  engagement: "2.4M",
  pageVisits: 620450,
  villageBreakdown: [
    { name: "सैफई", worksCount: 18, citizensCount: 12450 },
    { name: "बकेवर", worksCount: 14, citizensCount: 9800 },
    { name: "रामपुर", worksCount: 12, citizensCount: 8500 },
    { name: "तकरोई", worksCount: 9, citizensCount: 6200 },
    { name: "उदी", worksCount: 8, citizensCount: 5400 }
  ],
  channels: [
    { platform: "YouTube", reach: "1.1M", followers: "25,300", growth: "+14%" },
    { platform: "Facebook", reach: "780K", followers: "12,450", growth: "+9%" },
    { platform: "Instagram", reach: "340K", followers: "8,920", growth: "+22%" },
    { platform: "X / Twitter", reach: "180K", followers: "4,870", growth: "+11%" }
  ],
  workStatus: {
    total: 125,
    completed: 45,
    inProgress: 48,
    approved: 20,
    notStarted: 12
  }
};

module.exports = { analytics };
