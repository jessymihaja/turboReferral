const Badge = require('../models/Badge');
const Referral = require('../models/Referral');
const { BADGE_TYPES } = require('../config/constants');

const calculateReferralScore = async (referral, voteStats, userBadges = []) => {
  let score = 0;

  // 1. Vote Quality Score (0-40 points)
  const totalVotes = voteStats.upvotes + voteStats.downvotes;
  if (totalVotes > 0) {
    const voteRatio = voteStats.upvotes / totalVotes;
    const voteScore = voteRatio * 40;

    // Bonus for high confidence (many votes)
    const confidenceMultiplier = Math.min(1 + (totalVotes / 20), 1.5);
    score += voteScore * confidenceMultiplier;
  } else {
    // Neutral score for no votes (25 points)
    score += 25;
  }

  // 2. Creator Reputation Score (0-25 points)
  const hasTrustedBadge = userBadges.some(b => b.type === BADGE_TYPES.TRUSTED);
  const hasRiskyBadge = userBadges.some(b => b.type === BADGE_TYPES.RISKY);
  const hasExperienceBadge = userBadges.some(b =>
    [BADGE_TYPES.REFERRAL_10, BADGE_TYPES.REFERRAL_50, BADGE_TYPES.REFERRAL_100].includes(b.type)
  );

  if (hasTrustedBadge) {
    score += 25;
  } else if (hasRiskyBadge) {
    score -= 15;
  } else if (hasExperienceBadge) {
    score += 10;
  } else {
    score += 5; // Neutral for new users
  }

  // 3. Recency Score (0-20 points) - boost new referrals
  const daysSinceCreation = (Date.now() - new Date(referral.createdAt)) / (1000 * 60 * 60 * 24);
  if (daysSinceCreation < 7) {
    score += 20; // Very recent (last week)
  } else if (daysSinceCreation < 30) {
    score += 15; // Recent (last month)
  } else if (daysSinceCreation < 90) {
    score += 10; // Moderately recent (last 3 months)
  } else {
    score += 5; // Old but still valid
  }

  // 4. Engagement Score (0-15 points)
  if (totalVotes >= 20) {
    score += 15; // Highly engaged
  } else if (totalVotes >= 10) {
    score += 10; // Well engaged
  } else if (totalVotes >= 5) {
    score += 5; // Some engagement
  }

  return Math.round(score);
};

const enrichReferralsWithScores = async (referrals, voteStatsMap, promotions = []) => {
  const userBadgesCache = {};
  const userReferralCounts = {};

  // Pre-fetch user data in bulk
  const userIds = [...new Set(referrals.map(r => r.user?._id?.toString()).filter(Boolean))];

  for (const userId of userIds) {
    if (!userBadgesCache[userId]) {
      userBadgesCache[userId] = await Badge.find({ user: userId });
      userReferralCounts[userId] = await Referral.countDocuments({ user: userId, isActive: true });
    }
  }

  const promoMap = new Map(promotions.map(p => [p.referral?._id?.toString() || p.referral, true]));

  const enrichedReferrals = await Promise.all(referrals.map(async (ref) => {
    const refId = ref._id.toString();
    const userId = ref.user?._id?.toString();

    const voteStats = voteStatsMap[refId] || { upvotes: 0, downvotes: 0 };
    const userBadges = userBadgesCache[userId] || [];
    const isPromoted = promoMap.has(refId);

    const score = await calculateReferralScore(ref, voteStats, userBadges);

    return {
      ...ref.toObject(),
      score,
      isPromoted,
      upvotes: voteStats.upvotes,
      downvotes: voteStats.downvotes,
      totalVotes: voteStats.upvotes + voteStats.downvotes,
      userBadges: userBadges.map(b => b.type),
      userReferralCount: userReferralCounts[userId] || 0
    };
  }));

  return enrichedReferrals;
};

const sortReferrals = (referrals, sortBy = 'pertinence') => {
  const sorted = [...referrals];

  switch (sortBy) {
    case 'pertinence':
    case 'score':
      // Sort by score (promoted first, then by score)
      sorted.sort((a, b) => {
        if (a.isPromoted && !b.isPromoted) return -1;
        if (!a.isPromoted && b.isPromoted) return 1;
        return b.score - a.score;
      });
      break;

    case 'votes':
      // Most voted first
      sorted.sort((a, b) => b.totalVotes - a.totalVotes);
      break;

    case 'positive':
      // Best ratio first (with minimum votes)
      sorted.sort((a, b) => {
        const ratioA = a.totalVotes > 0 ? a.upvotes / a.totalVotes : 0.5;
        const ratioB = b.totalVotes > 0 ? b.upvotes / b.totalVotes : 0.5;
        return ratioB - ratioA;
      });
      break;

    case 'recent':
      // Most recent first
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;

    case 'oldest':
      // Oldest first
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;

    default:
      // Default to pertinence
      sorted.sort((a, b) => {
        if (a.isPromoted && !b.isPromoted) return -1;
        if (!a.isPromoted && b.isPromoted) return 1;
        return b.score - a.score;
      });
  }

  return sorted;
};

module.exports = {
  calculateReferralScore,
  enrichReferralsWithScores,
  sortReferrals
};
