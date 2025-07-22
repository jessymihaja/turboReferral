const Report = require('../models/Report');

exports.createReport = async (req, res) => {
  try {
    const { referralId, reason } = req.body;
    const reporterId = req.user._id;

    // Check for existing report
    const existingReport = await Report.findOne({ referralId, reporterId });
    if (existingReport) {
      return res.status(400).json({ message: 'Vous avez dejà signaler ce referral' });
    }

    const newReport = new Report({ referralId, reporterId, reason });
    await newReport.save();

    res.status(201).json({ message: 'Signalement envoyé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Envoi du signalement échoué' });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('referralId')
      .populate('reporterId');

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Erreur de recuperation des signalements' });
  }
};
