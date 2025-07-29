const Notification = require('../models/Notification');

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notifId = req.params.id;
    await Notification.findByIdAndUpdate(notifId, { isRead: true });
    res.json({ message: 'Notification marquée comme lue' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const Report = require('../models/Report');

exports.warnUser = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findById(reportId).populate('referralId'); 

    if (!report) return res.status(404).json({ message: 'Report not found' });

    const referral = report.referralId;

    if (!referral) return res.status(404).json({ message: 'Referral not found' });

    const userId = referral.user._id; 
    const lien = referral.link || referral.code || 'lien inconnu';
    const raison = report.reason || 'Aucune raison spécifiée';

    const title = `Avertissement sur le lien "${lien}" pour contenue "${raison}"`;
    const content = `Veuillez modifier votre lien "${lien}" afin de respecter les termes et conditions de notre site.`;

    const newNotif = await Notification.create({ userId, title, content });

    res.json({ message: 'Notification envoyée', notification: newNotif });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id; // ou req.params.id si pas de token

    const count = await Notification.countDocuments({
      userId,
      isRead: false
    });

    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};