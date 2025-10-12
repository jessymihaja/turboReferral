const mongoose = require('mongoose');
const { mongoUri, nodeEnv } = require('./env');

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    if (nodeEnv === 'development') {
      console.log('MongoDB connecté');
    }
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
