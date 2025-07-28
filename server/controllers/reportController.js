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

exports.getPendingReports = async (req, res) => {
  try {
    const reports = await Report.aggregate([
      { $match: { status: 1 } }, // ne garder que ceux à vérifier
      { $sort: { createdAt: 1 } }, // plus ancien d’abord
      {
        $group: {
          _id: '$referralId',
          report: { $first: '$$ROOT' } // on garde le premier pour chaque referralId
        }
      },
      {
        $replaceRoot: { newRoot: '$report' }
      }
    ]);

    // On peuple referralId et reporterId, puis on peuple referralId.user
    const populatedReports = await Report.populate(reports, [
      {
        path: 'referralId',
        populate: {
          path: 'user',
          select: 'username'
        }
      },
      {
        path: 'reporterId',
        select: 'username'
      }
    ]);

    res.status(200).json(populatedReports);
  } catch (error) {
    console.error('Error fetching pending reports:', error);
    res.status(500).json({ message: 'Error retrieving pending reports' });
  }
};
exports.ignoreReport = async (req, res) => {
  try {
    const reportId = req.params.id;

    // D'abord, on récupère le report pour trouver le referralId associé
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const referralId = report.referralId;

    // Ensuite, on met à jour tous les reports liés à ce referralId
    const result = await Report.updateMany(
      { referralId: referralId },
      { $set: { status: 0 } }
    );

    res.json({
      message: 'All reports related to the referral were ignored successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
