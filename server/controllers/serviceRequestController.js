// controllers/serviceRequestController.js

const ServiceRequest = require('../models/ServiceRequest'); // modèle mongoose à créer
const Service = require('../models/Service'); 

exports.createServiceRequest = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Le nom du service est obligatoire' });
    }

    const nameTrimmed = name.trim();

    // Vérifier si une demande avec ce nom existe déjà (en attente)
    const existingRequest = await ServiceRequest.findOne({ name: nameTrimmed, status: 'pending' });
    if (existingRequest) {
      return res.status(400).json({ message: 'Une demande avec ce nom de service est déjà en attente' });
    }


     const existingService = await Service.findOne({ name: nameTrimmed });
     if (existingService) {
       return res.status(400).json({ message: 'Ce service existe déjà' });
     }

    const serviceRequest = new ServiceRequest({
      name: nameTrimmed,
      description: description?.trim() || '',
      user: req.user.id,
      status: 'pending',
    });

    await serviceRequest.save();

    res.status(201).json({ message: 'Demande de service créée avec succès', serviceRequest });
  } catch (error) {
    console.error('Erreur création demande service:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de la demande' });
  }
};