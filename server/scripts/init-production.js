require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const User = require('../models/User');
const Category = require('../models/Category');
const Badge = require('../models/Badge'); // For counting existing badges only

const { mongoUri } = require('../config/env');

const initializeProduction = async () => {
  try {
    console.log('🚀 Initializing TurboReferral for production...\n');

    // 1. Check environment
    console.log('🔍 Checking environment configuration...');
    
    const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'NODE_ENV'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.log(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
      console.log('Please ensure all required environment variables are set before running in production.');
      return;
    }
    
    console.log('✅ Environment configuration validated');

    // 2. Create necessary directories
    console.log('📁 Creating necessary directories...');
    const directories = [
      path.join(__dirname, '../uploads'),
      path.join(__dirname, '../uploads/logos'),
      path.join(__dirname, '../uploads/profiles'),
      path.join(__dirname, '../uploads/services'),
    ];

    for (const dir of directories) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`  Created: ${dir}`);
      } else {
        console.log(`  Exists: ${dir}`);
      }
    }

    // 3. Connect to database
    console.log('\n📦 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // 4. Create admin user
    console.log('\n👤 Setting up admin user...');
    const existingAdmin = await User.findOne({ email: 'admin@turboreferral.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`🆔 ID: ${existingAdmin._id}`);
    } else {
      const admin = await User.create({
        username: 'admin',
        email: 'admin@turboreferral.com',
        password: 'Admin2024!TurboRef',
        role: 'admin',
      });

      console.log('✅ Admin user created successfully');
      console.log(`📧 Email: ${admin.email}`);
      console.log(`🆔 ID: ${admin._id}`);
      console.log('🔑 Default password: Admin2024!TurboRef');
    }

    // 5. Create essential categories
    console.log('\n📁 Setting up categories...');
    const categoryData = [
      { name: 'Shopping', description: 'E-commerce et achats en ligne' },
      { name: 'Mobilité', description: 'Transport et déplacements' },
      { name: 'Finance', description: 'Banque, investissement, crypto' },
      { name: 'Streaming', description: 'Musique, vidéo, podcasts' },
      { name: 'Voyage', description: 'Hôtels, vols, locations' },
      { name: 'Food', description: 'Livraison de repas et courses' },
      { name: 'Jeux', description: 'Jeux vidéo et divertissement' },
      { name: 'Éducation', description: 'Formation et apprentissage' },
      { name: 'Santé', description: 'Bien-être et santé' },
    ];

    const existingCategories = await Category.find({});
    const existingNames = new Set(existingCategories.map(cat => cat.name));
    const newCategories = categoryData.filter(cat => !existingNames.has(cat.name));

    if (newCategories.length > 0) {
      const created = await Category.create(newCategories);
      console.log(`✅ Created ${created.length} new categories`);
      created.forEach(cat => console.log(`  - ${cat.name}`));
    } else {
      console.log('✅ All categories already exist');
    }

    // 6. Badge system info
    console.log('\n🏆 Badge system ready...');
    console.log('Badges are automatically generated based on user activity:');
    console.log('  - referral_10: 10+ referrals created');
    console.log('  - referral_50: 50+ referrals created'); 
    console.log('  - referral_100: 100+ referrals created');
    console.log('  - trusted: High-quality referrals with good votes');
    console.log('  - risky: Low-quality referrals with bad votes');

    // 7. Database statistics
    console.log('\n📊 Current database statistics:');
    const userCount = await User.countDocuments();
    const categoryCount = await Category.countDocuments();
    const badgeCount = await Badge.countDocuments();
    
    console.log(`  Users: ${userCount}`);
    console.log(`  Categories: ${categoryCount}`);
    console.log(`  User badges earned: ${badgeCount}`);

    console.log('\n🎉 Production initialization completed successfully!');
    
    console.log('\n📋 POST-SETUP CHECKLIST:');
    console.log('1. ✅ Admin user created');
    console.log('2. ✅ Categories configured');
    console.log('3. ✅ Badge system ready');
    console.log('4. ✅ Upload directories created');
    console.log('5. ⚠️  Change admin password on first login');
    console.log('6. ⚠️  Configure proper backup strategy');
    console.log('7. ⚠️  Set up monitoring and logging');
    console.log('8. ⚠️  Configure rate limiting');
    console.log('9. ⚠️  Enable SSL/HTTPS');
    console.log('10. ⚠️ Review security headers');

  } catch (error) {
    console.error('❌ Error during production initialization:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('\n📦 Disconnected from MongoDB');
  }
};

if (require.main === module) {
  initializeProduction()
    .then(() => {
      console.log('\n✨ Ready to launch TurboReferral!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Production initialization failed:', error);
      process.exit(1);
    });
}

module.exports = initializeProduction;