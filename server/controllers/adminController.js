const Service = require('../models/Service');
exports.listServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAllReferrals = async (req, res) => {
  try {
    // Popule service et ne garde que les referrals liés à un service validé
    const referrals = await Referral.find().populate({
      path: 'service',
      match: { validated: true }
    });
    // Filtrer ceux dont le service est null (non validé)
    const filtered = referrals.filter(ref => ref.service !== null);
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.validateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service non trouvé' });

    service.isValidated = true;
    await service.save();

    res.json({ message: 'Service validé', service });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Pour les referrals, tu n'as plus besoin de validation
exports.listReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find().populate('service');
    res.json(referrals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateReferral = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const referral = await Referral.findById(id);
    if (!referral) return res.status(404).json({ message: 'Referral non trouvé' });

    // Mettre à jour les champs autorisés
    if (updateData.link !== undefined) referral.link = updateData.link;
    if (updateData.code !== undefined) referral.code = updateData.code;
    if (updateData.description !== undefined) referral.description = updateData.description;
    if (updateData.promo !== undefined) referral.promo = updateData.promo;

    await referral.save();

    // Populer le service si besoin
    await referral.populate('service');

    res.json({ message: 'Referral mis à jour', referral });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
