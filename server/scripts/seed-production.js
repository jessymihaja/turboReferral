require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../models/User');
const Category = require('../models/Category');
const Service = require('../models/Service');
const Referral = require('../models/Referral');
const ReferralVote = require('../models/ReferralVote');
const PromReferral = require('../models/PromReferral');
const Notification = require('../models/Notification');
const Badge = require('../models/Badge');

const { mongoUri } = require('../config/env');

const seedProduction = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('📦 Connected to MongoDB');

    // Clear all existing data
    console.log('🗑️  Clearing all existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Service.deleteMany({});
    await Referral.deleteMany({});
    await ReferralVote.deleteMany({});
    await PromReferral.deleteMany({});
    await Notification.deleteMany({});
    await Badge.deleteMany({});
    console.log('✅ All data cleared');

    // Create admin user
    console.log('👤 Creating admin user...');
    await User.create({
      username: 'admin',
      email: 'admin@refpush.com',
      password: 'admin123', // Change this in production!
      role: 'admin',
    });
    console.log('✅ Admin user created');
    console.log('');
    console.log('🎉 Production environment ready!');
    console.log('👋 Login with: admin@refpush.com / admin123');
    console.log('⚠️  Please change the admin password after first login!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding production:', error);
    process.exit(1);
  }
};

seedProduction();