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

const seedData = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Service.deleteMany({});
    await Referral.deleteMany({});
    await ReferralVote.deleteMany({});
    await PromReferral.deleteMany({});
    await Notification.deleteMany({});
    await Badge.deleteMany({});

    // Create Users
    console.log('👤 Creating users...');

    // Don't hash password here - the User model's pre-save hook will do it
    await User.create({
      username: 'admin',
      email: 'admin@turboreferral.com',
      password: 'password123',
      role: 'admin',
    });

    const users = await User.create([
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user',
      },
      {
        username: 'bob_wilson',
        email: 'bob@example.com',
        password: 'password123',
        role: 'user',
      },
      {
        username: 'alice_pro',
        email: 'alice@example.com',
        password: 'password123',
        role: 'user',
      },
      {
        username: 'charlie_expert',
        email: 'charlie@example.com',
        password: 'password123',
        role: 'user',
      },
    ]);

    console.log(`✅ Created ${users.length + 1} users (1 admin, ${users.length} regular)`);

    // Create Categories
    console.log('📁 Creating categories...');
    const categories = await Category.create([
      {
        name: 'Shopping',
        description: 'E-commerce et achats en ligne',
      },
      {
        name: 'Mobilité',
        description: 'Transport et déplacements',
      },
      {
        name: 'Jeux',
        description: 'Jeux vidéo et divertissement',
      },
      {
        name: 'Finance',
        description: 'Banque, investissement, crypto',
      },
      {
        name: 'Streaming',
        description: 'Musique, vidéo, podcasts',
      },
      {
        name: 'Voyage',
        description: 'Hôtels, vols, locations',
      },
      {
        name: 'Food',
        description: 'Livraison de repas et courses',
      },
    ]);

    console.log(`✅ Created ${categories.length} categories`);

    // Create Services
    console.log('🏪 Creating services...');
    const services = await Service.create([
      {
        name: 'Uber',
        description: 'Service de VTC',
        category: categories.find(c => c.name === 'Mobilité')._id,
        isValidated: true,
        website: 'https://uber.com',
        requestedBy: users[0]._id,
      },
      {
        name: 'Amazon',
        description: 'Marketplace en ligne',
        category: categories.find(c => c.name === 'Shopping')._id,
        isValidated: true,
        website: 'https://amazon.fr',
        requestedBy: users[0]._id,
      },
      {
        name: 'Spotify',
        description: 'Streaming musical',
        category: categories.find(c => c.name === 'Streaming')._id,
        isValidated: true,
        website: 'https://spotify.com',
        requestedBy: users[1]._id,
      },
      {
        name: 'Airbnb',
        description: 'Location de logements',
        category: categories.find(c => c.name === 'Voyage')._id,
        isValidated: true,
        website: 'https://airbnb.fr',
        requestedBy: users[1]._id,
      },
      {
        name: 'Revolut',
        description: 'Banque en ligne',
        category: categories.find(c => c.name === 'Finance')._id,
        isValidated: true,
        website: 'https://revolut.com',
        requestedBy: users[2]._id,
      },
      {
        name: 'Steam',
        description: 'Plateforme de jeux PC',
        category: categories.find(c => c.name === 'Jeux')._id,
        isValidated: true,
        website: 'https://store.steampowered.com',
        requestedBy: users[2]._id,
      },
      {
        name: 'Uber Eats',
        description: 'Livraison de repas',
        category: categories.find(c => c.name === 'Food')._id,
        isValidated: true,
        website: 'https://ubereats.com',
        requestedBy: users[0]._id,
      },
      {
        name: 'Netflix',
        description: 'Streaming vidéo',
        category: categories.find(c => c.name === 'Streaming')._id,
        isValidated: false,
        website: 'https://netflix.com',
        requestedBy: users[1]._id,
      },
      {
        name: 'Disney+',
        description: 'Streaming vidéo et films',
        category: categories.find(c => c.name === 'Streaming')._id,
        isValidated: false,
        website: 'https://disneyplus.com',
        requestedBy: users[2]._id,
        validationReason: 'Service déjà présent sous un autre nom',
      },
    ]);

    console.log(`✅ Created ${services.length} services`);

    // Create Referrals
    console.log('🔗 Creating referrals...');
    const referralsData = [];

    // User 0 (john_doe) - 5 referrals (no badge yet)
    referralsData.push(
      {
        service: services.find(s => s.name === 'Uber')._id,
        user: users[0]._id,
        link: 'https://uber.com/invite/johndoe123',
        description: 'Recevez 10€ de réduction sur votre première course',
      },
      {
        service: services.find(s => s.name === 'Amazon')._id,
        user: users[0]._id,
        link: 'https://amazon.fr/ref/john123',
        description: '15€ de réduction sur votre première commande',
      },
      {
        service: services.find(s => s.name === 'Revolut')._id,
        user: users[0]._id,
        link: 'https://revolut.com/referral/john1234',
        description: 'Carte gratuite et 10€ offerts',
      },
      {
        service: services.find(s => s.name === 'Uber Eats')._id,
        user: users[0]._id,
        link: 'https://ubereats.com/invite/john789',
        description: 'Livraison gratuite sur votre première commande',
      },
      {
        service: services.find(s => s.name === 'Steam')._id,
        user: users[0]._id,
        code: 'JOHNGAMES',
        description: 'Rejoignez ma communauté Steam',
      }
    );

    // User 1 (jane_smith) - 15 referrals (should get 10+ badge)
    for (let i = 0; i < 15; i++) {
      const serviceNames = ['Uber', 'Amazon', 'Spotify', 'Airbnb', 'Revolut', 'Steam', 'Uber Eats'];
      const serviceName = serviceNames[i % serviceNames.length];
      const service = services.find(s => s.name === serviceName);

      if (service) {
        referralsData.push({
          service: service._id,
          user: users[1]._id,
          link: `https://${serviceName.toLowerCase().replace(' ', '')}.com/invite/jane${i}`,
          description: `Code parrainage #${i + 1} pour ${serviceName}`,
        });
      }
    }

    // User 2 (bob_wilson) - 52 referrals (should get 50+ badge)
    for (let i = 0; i < 52; i++) {
      const serviceNames = ['Uber', 'Amazon', 'Spotify', 'Airbnb', 'Revolut', 'Steam', 'Uber Eats'];
      const serviceName = serviceNames[i % serviceNames.length];
      const service = services.find(s => s.name === serviceName);

      if (service) {
        referralsData.push({
          service: service._id,
          user: users[2]._id,
          code: `BOB${serviceName.toUpperCase().slice(0, 4)}${i}`,
          description: `Code parrainage Bob #${i + 1}`,
        });
      }
    }

    // User 3 (alice_pro) - 105 referrals (should get 100+ badge)
    for (let i = 0; i < 105; i++) {
      const serviceNames = ['Uber', 'Amazon', 'Spotify', 'Airbnb', 'Revolut', 'Steam', 'Uber Eats'];
      const serviceName = serviceNames[i % serviceNames.length];
      const service = services.find(s => s.name === serviceName);

      if (service) {
        referralsData.push({
          service: service._id,
          user: users[3]._id,
          link: `https://${serviceName.toLowerCase().replace(' ', '')}.com/ref/alice${i}`,
          description: `Offre exclusive Alice #${i + 1}`,
        });
      }
    }

    // User 4 (charlie_expert) - 12 referrals for vote testing
    for (let i = 0; i < 12; i++) {
      const serviceNames = ['Uber', 'Amazon', 'Spotify', 'Airbnb', 'Revolut', 'Steam'];
      const serviceName = serviceNames[i % serviceNames.length];
      const service = services.find(s => s.name === serviceName);

      if (service) {
        referralsData.push({
          service: service._id,
          user: users[4]._id,
          code: `CHARLIE${i}`,
          description: `Code expert Charlie #${i + 1}`,
        });
      }
    }

    const referrals = await Referral.create(referralsData);

    console.log(`✅ Created ${referrals.length} referrals`);

    // Create Votes
    console.log('👍 Creating votes...');
    const votes = [];

    // Get charlie's referrals (user 4) - will receive mostly good votes (trusted badge)
    const charlieReferrals = referrals.filter(r => r.user.toString() === users[4]._id.toString());
    charlieReferrals.forEach((referral, idx) => {
      // Each referral gets 3-5 votes
      const voteCount = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < voteCount; i++) {
        const voter = users[i % users.length];
        if (voter._id.toString() !== referral.user.toString()) {
          votes.push({
            referral: referral._id,
            user: voter._id,
            vote: Math.random() > 0.2 ? 'good' : 'bad', // 80% good votes (will get trusted badge)
            comment: Math.random() > 0.6 ? 'Code valide, merci !' : '',
          });
        }
      }
    });

    // Get john's referrals (user 0) - will receive mostly bad votes (risky badge)
    const johnReferrals = referrals.filter(r => r.user.toString() === users[0]._id.toString());
    johnReferrals.forEach((referral) => {
      // Each referral gets 3-5 votes
      const voteCount = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < voteCount; i++) {
        const voter = users[(i + 1) % users.length];
        if (voter._id.toString() !== referral.user.toString()) {
          votes.push({
            referral: referral._id,
            user: voter._id,
            vote: Math.random() > 0.7 ? 'good' : 'bad', // 30% good votes (will get risky badge)
            comment: Math.random() > 0.7 ? 'Code expiré' : '',
          });
        }
      }
    });

    // Add some random votes to other users' referrals
    const otherReferrals = referrals.filter(r =>
      r.user.toString() !== users[4]._id.toString() &&
      r.user.toString() !== users[0]._id.toString()
    ).slice(0, 20);

    otherReferrals.forEach((referral) => {
      const voteCount = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < voteCount; i++) {
        const voter = users[i % users.length];
        if (voter._id.toString() !== referral.user.toString()) {
          votes.push({
            referral: referral._id,
            user: voter._id,
            vote: Math.random() > 0.5 ? 'good' : 'bad',
            comment: Math.random() > 0.8 ? 'Bon code' : '',
          });
        }
      }
    });

    await ReferralVote.create(votes);
    console.log(`✅ Created ${votes.length} votes`);

    // Generate Badges based on referrals and votes
    console.log('🏅 Generating badges...');
    const badgeService = require('../services/badgeService');

    const badgeStats = [];
    for (const user of users) {
      const badges = await badgeService.updateUserBadges(user._id);
      badgeStats.push({
        username: user.username,
        badges: badges.map(b => b.type)
      });
    }

    console.log('✅ Badges generated:');
    badgeStats.forEach(stat => {
      if (stat.badges.length > 0) {
        console.log(`   - ${stat.username}: ${stat.badges.join(', ')}`);
      } else {
        console.log(`   - ${stat.username}: no badges yet`);
      }
    });

    // Create Notifications
    console.log('🔔 Creating notifications...');
    const notifications = await Notification.create([
      {
        userId: users[0]._id,
        title: 'Service "Uber" approuvé',
        content: 'Votre demande de service "Uber" a été approuvée et est maintenant disponible.',
        link: `/services/${services.find(s => s.name === 'Uber')._id}`,
        isRead: true,
      },
      {
        userId: users[1]._id,
        title: 'Service "Netflix" en attente',
        content: 'Votre demande de service "Netflix" est en cours de validation par un administrateur.',
        link: `/services/${services.find(s => s.name === 'Netflix')._id}`,
        isRead: false,
      },
      {
        userId: users[2]._id,
        title: 'Service "Disney+" rejeté',
        content: 'Votre demande de service "Disney+" a été rejetée: Service déjà présent sous un autre nom.',
        link: `/services/${services.find(s => s.name === 'Disney+')._id}`,
        isRead: false,
      },
      {
        userId: users[0]._id,
        title: 'Nouveau vote sur votre parrainage',
        content: 'Quelqu\'un a voté sur votre lien de parrainage Uber.',
        isRead: false,
      },
      {
        userId: users[1]._id,
        title: 'Service "Spotify" approuvé',
        content: 'Votre demande de service "Spotify" a été approuvée et est maintenant disponible.',
        link: `/services/${services.find(s => s.name === 'Spotify')._id}`,
        isRead: true,
      },
    ]);

    console.log(`✅ Created ${notifications.length} notifications`);

    const totalBadges = await Badge.countDocuments();

    console.log('\n✨ Seed data created successfully!\n');
    console.log('📋 Summary:');
    console.log(`   - Users: ${users.length + 1} (admin: admin@turboreferral.com, password: password123)`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Services: ${services.length} (${services.filter(s => s.isValidated).length} validated)`);
    console.log(`   - Referrals: ${referrals.length}`);
    console.log(`   - Votes: ${votes.length}`);
    console.log(`   - Badges: ${totalBadges}`);
    console.log(`   - Notifications: ${notifications.length}`);
    console.log('\n🔑 Login credentials:');
    console.log('   Admin: admin@turboreferral.com / password123');
    console.log('   User 1 (5 referrals, risky): john@example.com / password123');
    console.log('   User 2 (15 referrals, badge 10+): jane@example.com / password123');
    console.log('   User 3 (52 referrals, badge 50+): bob@example.com / password123');
    console.log('   User 4 (105 referrals, badge 100+): alice@example.com / password123');
    console.log('   User 5 (12 referrals, trusted): charlie@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
