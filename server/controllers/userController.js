const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../utils/errorHandler');
const { t } = require('../utils/i18n');
const { optimizeProfilePhoto, deleteImageVariants } = require('../utils/imageOptimizer');

exports.updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { username, email } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(t('user.userNotFound'), 404);
  }

  if (username && username !== user.username) {
    const existingUser = await User.findOne({ username, _id: { $ne: userId } });
    if (existingUser) {
      throw new AppError('Ce nom d\'utilisateur est déjà utilisé', 400);
    }
    user.username = username;
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      throw new AppError('Cet email est déjà utilisé', 400);
    }
    user.email = email;
  }

  await user.save();

  const userData = {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    profilePhoto: user.profilePhoto,
    deletedReferralsCount: user.deletedReferralsCount || 0,
  };

  ResponseHandler.success(res, userData, 'Profil mis à jour avec succès');
});

exports.updatePassword = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(t('user.userNotFound'), 404);
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Mot de passe actuel incorrect', 400);
  }

  user.password = newPassword;
  await user.save();

  ResponseHandler.success(res, null, 'Mot de passe mis à jour avec succès');
});

exports.uploadProfilePhoto = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (!req.file) {
    throw new AppError('Aucune photo fournie', 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(t('user.userNotFound'), 404);
  }

  if (user.profilePhoto) {
    await deleteImageVariants(user.profilePhoto);
  }

  const optimizedImages = await optimizeProfilePhoto(req.file.path, req.file.filename);

  user.profilePhoto = optimizedImages.original;
  await user.save();

  ResponseHandler.success(res, {
    profilePhoto: user.profilePhoto,
    thumbnail: optimizedImages.thumbnail
  }, 'Photo de profil mise à jour');
});
