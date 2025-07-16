// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'une_chaine_secrete_a_changer';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // format "Bearer TOKEN"

  if (!token) return res.status(401).json({ message: 'Token manquant' });

  const User = require('../models/User'); // n'oublie pas d'importer le modèle

jwt.verify(token, JWT_SECRET, async (err, decoded) => {
  if (err) return res.status(403).json({ message: 'Token invalide' });

  try {
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });

    req.user = user; // maintenant req.user._id est dispo
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});
}

module.exports = authenticateToken;
