// Quick test script to verify badge API
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Badge = require('./models/Badge');
const badgeService = require('./services/badgeService');
const { mongoUri } = require('./config/env');

async function testBadges() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get all users
    const users = await User.find().select('username email');
    console.log('\n📋 Users in database:');
    users.forEach(u => console.log(`   - ${u.username} (${u._id})`));

    // Get all badges
    const allBadges = await Badge.find().populate('user', 'username');
    console.log('\n🏅 Badges in database:');
    allBadges.forEach(b => console.log(`   - ${b.user?.username || 'Unknown'}: ${b.type}`));

    // Test badge service for each user
    console.log('\n🔍 Testing badge service for each user:');
    for (const user of users) {
      const badges = await badgeService.getUserBadges(user._id);
      console.log(`   - ${user.username}:`, badges.map(b => b.type).join(', ') || 'No badges');
    }

    console.log('\n✨ Test completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testBadges();
