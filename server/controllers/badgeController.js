const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const badgeService = require('../services/badgeService');
const { t } = require('../utils/i18n');

const getUserBadges = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const badges = await badgeService.getUserBadges(userId);
  ResponseHandler.success(res, badges, t('badge.fetchSuccess'));
});

const updateBadges = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const badges = await badgeService.updateUserBadges(userId);
  ResponseHandler.success(res, badges, t('badge.updateSuccess'));
});

module.exports = {
  getUserBadges,
  updateBadges,
};
