// server/services/analyticsService.js
// Service layer for Dashboard & Social Analytics

const { analytics } = require('../data/analytics');
const { developmentWorks } = require('../data/developmentWorks');
const { citizens } = require('../data/citizens');
const { posts } = require('../data/posts');
const { teams } = require('../data/teams');

function getOverviewStats() {
  return {
    ...analytics,
    liveStats: {
      worksCount: developmentWorks.length,
      villagesCount: 80,
      populationReach: "5.4L+",
      socialUpdates: posts.length,
      citizenConnectCount: citizens.length,
      activeMembers: teams.filter(t => t.status === 'Active').length
    }
  };
}

function getVillageBreakdown() {
  return analytics.villageBreakdown || [];
}

function getChannelMetrics() {
  return analytics.channels || [];
}

module.exports = {
  getOverviewStats,
  getVillageBreakdown,
  getChannelMetrics
};
