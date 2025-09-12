const Referral = require('../models/Referral');
const Service = require('../models/Service');

exports.getAllReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find().populate('service').populate('user');
    res.json(referrals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReferral = async (req, res) => {
  try {
    const { service, user, link, code, description } = req.body;

    if (!service) return res.status(400).json({ message: 'Service requis' });
    if (!user) return res.status(400).json({ message: 'Utilisateur requis' });

    if ((!link && !code) || (link && code)) {
      return res.status(400).json({ message: 'Veuillez renseigner soit un lien, soit un code (pas les deux).' });
    }

    const foundService = await Service.findById(service);
    if (!foundService) return res.status(400).json({ message: 'Service invalide' });

    if (link && foundService.validationPatterns && foundService.validationPatterns.length > 0) {
      // Vérifie que le lien correspond à au moins un des patterns
      const isValid = foundService.validationPatterns.some(patternStr => {
        const regex = new RegExp(patternStr);
        return regex.test(link);
      });
      if (!isValid) {
        return res.status(400).json({ message: `Lien non conforme pour le service ${foundService.name}` });
      }
    }

    const referral = new Referral({ service, user, link, code, description });
    await referral.save();

    await referral.populate('service');

    res.status(201).json(referral);
  } catch (error) {
    console.error('Erreur création referral :', error);
    if (error.code === 11000) {
      const key = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `${key} déjà utilisé.` });
    }
    res.status(500).json({ message: error.message });
  }
};

const Notification = require('../models/Notification');
const ReferralVote = require('../models/ReferralVote');
const Report = require('../models/Report');

exports.deleteReferral = async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id);
    if (!referral) {
      return res.status(404).json({ message: 'Referral non trouvé' });
    }

    // Supprimer d'abord les entités liées
    await Notification.deleteMany({ referral: referral._id });
    await ReferralVote.deleteMany({ referral: referral._id });
    await Report.deleteMany({ referralId: referral._id });

    // Supprimer le referral
    await Referral.deleteOne({ _id: referral._id });

    res.json({ message: 'Referral et ses dépendances supprimés' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getReferralsbyServiceId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Service ID requis' });
    const referrals = await Referral.find({ service: id }).populate('service').populate('user');
    res.json(referrals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const mongoose = require('mongoose');

exports.getAllReferralsbyUserid = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'User ID requis' });

    // S'assurer que c'est bien un ObjectId
    const objectId = new mongoose.Types.ObjectId(id);

    const referrals = await Referral.find({ user: objectId })
      .populate('user')
      .populate('service');

    res.json(referrals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const PromoReferral = require('../models/PromReferral');
exports.getReferralsWithPromoStatus = async (req, res) => {
  try {
    const referrals = await Referral.find().populate("user service");

    // Cherche les promotions actives
    const now = new Date();
    const promos = await PromoReferral.find({
      dateDebut: { $lte: now },
      dateFin: { $gte: now },
    });

    // Mets en map pour chercher vite
    const activePromoMap = new Map(
      promos.map((p) => [p.referral.toString(), true])
    );

    const referralsWithStatus = referrals.map((ref) => ({
      ...ref.toObject(),
      isPromoted: activePromoMap.has(ref._id.toString()),
    }));

    res.json(referralsWithStatus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};