const Badge = require('../models/Badge');
const Referral = require('../models/Referral');
const ReferralVote = require('../models/ReferralVote');
const Notification = require('../models/Notification');
const { BADGE_TYPES, BADGE_THRESHOLDS } = require('../config/constants');
const { t } = require('../utils/i18n');

const calculateUserBadges = async (userId) => {
  const activeReferralsCount = await Referral.countDocuments({
    user: userId,
    isActive: true
  });

  const referralIds = await Referral.find({ user: userId, isActive: true }).select('_id');
  const referralIdsArray = referralIds.map(r => r._id);

  let goodVotes = 0;
  let badVotes = 0;

  if (referralIdsArray.length > 0) {
    goodVotes = await ReferralVote.countDocuments({
      referral: { $in: referralIdsArray },
      voteType: 'good'
    });

    badVotes = await ReferralVote.countDocuments({
      referral: { $in: referralIdsArray },
      voteType: 'bad'
    });
  }

  const totalVotes = goodVotes + badVotes;
  const goodVotePercent = totalVotes > 0 ? (goodVotes / totalVotes) * 100 : 0;

  const badges = [];

  if (activeReferralsCount >= BADGE_THRESHOLDS.REFERRAL_100) {
    badges.push(BADGE_TYPES.REFERRAL_100);
  } else if (activeReferralsCount >= BADGE_THRESHOLDS.REFERRAL_50) {
    badges.push(BADGE_TYPES.REFERRAL_50);
  } else if (activeReferralsCount >= BADGE_THRESHOLDS.REFERRAL_10) {
    badges.push(BADGE_TYPES.REFERRAL_10);
  }

  if (totalVotes >= 10) {
    if (goodVotePercent >= BADGE_THRESHOLDS.TRUSTED_VOTE_PERCENT) {
      badges.push(BADGE_TYPES.TRUSTED);
    } else {
      badges.push(BADGE_TYPES.RISKY);
    }
  }

  return badges;
};

const getBadgeTitle = (badgeType) => {
  const titles = {
    [BADGE_TYPES.REFERRAL_10]: '🥉 Badge 10 Parrainages',
    [BADGE_TYPES.REFERRAL_50]: '🥈 Badge 50 Parrainages',
    [BADGE_TYPES.REFERRAL_100]: '🏆 Badge 100 Parrainages',
    [BADGE_TYPES.TRUSTED]: '✅ Badge Fiable',
    [BADGE_TYPES.RISKY]: '⚠️ Badge Risqué',
  };
  return titles[badgeType] || 'Nouveau badge';
};

const getBadgeDescription = (badgeType) => {
  const descriptions = {
    [BADGE_TYPES.REFERRAL_10]: 'Félicitations ! Vous avez publié 10 parrainages.',
    [BADGE_TYPES.REFERRAL_50]: 'Impressionnant ! Vous avez atteint 50 parrainages publiés.',
    [BADGE_TYPES.REFERRAL_100]: 'Incroyable ! Vous êtes un expert avec 100 parrainages publiés !',
    [BADGE_TYPES.TRUSTED]: 'Bravo ! Vos parrainages sont appréciés par la communauté (>50% de votes positifs).',
    [BADGE_TYPES.RISKY]: 'Attention : Vos parrainages reçoivent beaucoup de votes négatifs. Assurez-vous qu\'ils sont valides.',
  };
  return descriptions[badgeType] || 'Vous avez obtenu un nouveau badge !';
};

const updateUserBadges = async (userId) => {
  const newBadges = await calculateUserBadges(userId);
  const existingBadges = await Badge.find({ user: userId });
  const existingBadgeTypes = existingBadges.map(b => b.type);

  const badgesToAdd = newBadges.filter(type => !existingBadgeTypes.includes(type));
  const badgesToRemove = existingBadgeTypes.filter(type => !newBadges.includes(type));

  for (const type of badgesToAdd) {
    await Badge.create({ user: userId, type });

    await Notification.create({
      userId,
      title: getBadgeTitle(type),
      content: getBadgeDescription(type),
      link: '/dashboard',
      isRead: false
    });
  }

  if (badgesToRemove.length > 0) {
    await Badge.deleteMany({ user: userId, type: { $in: badgesToRemove } });
  }

  return Badge.find({ user: userId });
};

const getUserBadges = async (userId) => {
  return Badge.find({ user: userId }).sort({ earnedAt: -1 });
};

module.exports = {
  calculateUserBadges,
  updateUserBadges,
  getUserBadges,
};
