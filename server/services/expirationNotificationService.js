const Referral = require('../models/Referral');
const Notification = require('../models/Notification');
const { REFERRAL_LIMITS } = require('../config/constants');
const { t } = require('../utils/i18n');

async function checkAndNotifyExpiringReferrals() {
  try {
    const now = new Date();
    const warningDate = new Date(now.getTime() + (REFERRAL_LIMITS.EXPIRATION_WARNING_DAYS * 24 * 60 * 60 * 1000));

    const expiringReferrals = await Referral.find({
      isActive: true,
      dateFin: {
        $gte: now,
        $lte: warningDate
      }
    }).populate('user service');

    for (const referral of expiringReferrals) {
      const daysUntilExpiration = Math.ceil((new Date(referral.dateFin) - now) / (1000 * 60 * 60 * 24));

      const existingNotification = await Notification.findOne({
        user: referral.user._id,
        referral: referral._id,
        type: 'expiration_warning',
        isRead: false
      });

      if (!existingNotification) {
        await Notification.create({
          user: referral.user._id,
          referral: referral._id,
          type: 'expiration_warning',
          title: 'Parrainage bientôt expiré',
          message: `Votre parrainage "${referral.service?.name || 'Service'}" expire dans ${daysUntilExpiration} jour${daysUntilExpiration > 1 ? 's' : ''}. Pensez à le renouveler !`,
        });
      }
    }

    return { success: true, count: expiringReferrals.length };
  } catch (error) {
    console.error('Error checking expiring referrals:', error);
    return { success: false, error: error.message };
  }
}

async function getExpiringReferralsForUser(userId) {
  try {
    const now = new Date();
    const warningDate = new Date(now.getTime() + (REFERRAL_LIMITS.EXPIRATION_WARNING_DAYS * 24 * 60 * 60 * 1000));

    const expiringReferrals = await Referral.find({
      user: userId,
      isActive: true,
      dateFin: {
        $gte: now,
        $lte: warningDate
      }
    }).populate('service');

    return expiringReferrals.map(ref => ({
      ...ref.toObject(),
      daysUntilExpiration: Math.ceil((new Date(ref.dateFin) - now) / (1000 * 60 * 60 * 24))
    }));
  } catch (error) {
    console.error('Error getting expiring referrals:', error);
    return [];
  }
}

module.exports = {
  checkAndNotifyExpiringReferrals,
  getExpiringReferralsForUser
};
