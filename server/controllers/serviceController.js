const Service = require('../models/Service');

// Récupérer tous les services validés uniquement
exports.getAllServices = async (req, res) => {
  try {
    // On renvoie uniquement les services validés
    const services = await Service.find({ isValidated: true });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un service par ID (valide ou non ? ici on renvoie toujours)
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service non trouvé' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un service (non validé par défaut)
exports.createService = async (req, res) => {
  try {
    const { name, description, logo, website, validationPatterns } = req.body;

    const existing = await Service.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Service déjà existant' });

    const service = new Service({
      name,
      description,
      logo,
      website,
      validationPatterns,
      isValidated: false, // par défaut non validé
    });
    await service.save();

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour la validation d'un service (ex: admin valide ou invalide)
exports.setServiceValidation = async (req, res) => {
  try {
    const { id } = req.params;
    const { isValidated } = req.body; // true ou false

    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ message: 'Service non trouvé' });

    service.isValidated = isValidated;
    await service.save();

    res.json({ message: `Service ${isValidated ? 'validé' : 'invalidé'} avec succès`, service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const service = await Service.findByIdAndUpdate(id, updates, { new: true });
    if (!service) return res.status(404).json({ message: 'Service non trouvé' });

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};