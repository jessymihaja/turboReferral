const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/database');
const { port, nodeEnv, corsOrigin } = require('./config/env');
const { errorHandler } = require('./utils/errorHandler');

const authRoutes = require('./routes/authRoute');
const serviceRoutes = require('./routes/serviceRoute');
const referralRoutes = require('./routes/referralRoute');
const serviceRequestRoute = require('./routes/serviceRequestRoute');
const adminRoutes = require('./routes/adminRoute');
const categoryRoutes = require('./routes/categoryRoute');
const referralVoteRoutes = require('./routes/referralVoteRoutes');
const reportRoutes = require('./routes/reportRoute');
const notificationRoutes = require('./routes/notificationRoute');
const promReferralRoutes = require('./routes/promReferralRoute');
const userRoutes = require('./routes/userRoute');
const badgeRoutes = require('./routes/badgeRoute');

const app = express();

const initDirectories = () => {
  const directories = [
    'uploads',
    'uploads/services',
    'uploads/profiles',
    'uploads/logos'
  ];

  directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      if (nodeEnv === 'development') {
        console.log(`Répertoire créé: ${dir}`);
      }
    }
  });
};

initDirectories();
connectDB();

const corsOptions = {
  origin: corsOrigin,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'API TurboReferral fonctionne', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api', serviceRequestRoute);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/referralVotes', referralVoteRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/promotions', promReferralRoutes);
app.use('/api/users', userRoutes);
app.use('/api/badges', badgeRoutes);

app.use(errorHandler);

app.listen(port, () => {
  if (nodeEnv === 'development') {
    console.log(`Serveur démarré sur le port ${port}`);
  }
});
