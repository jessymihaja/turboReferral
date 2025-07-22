require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

// Import des routes
const authRoutes = require('./routes/authRoute');
const serviceRoutes = require('./routes/serviceRoute');
const referralRoutes = require('./routes/referralRoute');
const serviceRequestRoute = require('./routes/serviceRequestRoute');
const adminRoutes = require('./routes/adminRoute');
const categoryRoutes = require('./routes/categoryRoute');
const referralVoteRoutes = require('./routes/ReferralVoteRoutes');
const reportRoutes = require('./routes/reportRoute');

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connecté'))
.catch(err => console.error(err));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api', serviceRequestRoute);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/referralVotes', referralVoteRoutes);
app.use('/api/reports', reportRoutes);
// Route racine
app.get('/', (req, res) => {
  res.send('API TurboReferral fonctionne');
});

// Démarrage serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
