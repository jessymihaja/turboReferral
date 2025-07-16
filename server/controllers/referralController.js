const Referral = require('../models/Referral');
const Service = require('../models/Service');

exports.getAllReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find().populate('service');
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

exports.deleteReferral = async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id);
    if (!referral) return res.status(404).json({ message: 'Referral non trouvé' });

    await Referral.deleteOne({ _id: req.params.id });
    res.json({ message: 'Referral supprimé' });
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