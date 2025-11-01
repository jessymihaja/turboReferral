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
        name: {
          fr: 'Uber',
          en: 'Uber'
        },
        description: {
          fr: 'Service de VTC',
          en: 'Ride-hailing service'
        },
        category: categories.find(c => c.name === 'Mobilité')._id,
        isValidated: true,
        website: 'https://uber.com',
        requestedBy: users[0]._id,
      },
      {
        name: {
          fr: 'Amazon',
          en: 'Amazon'
        },
        description: {
          fr: 'Marketplace en ligne',
          en: 'Online marketplace'
        },
        category: categories.find(c => c.name === 'Shopping')._id,
        isValidated: true,
        website: 'https://amazon.fr',
        requestedBy: users[0]._id,
      },
      {
        name: {
          fr: 'Spotify',
          en: 'Spotify'
        },
        description: {
          fr: 'Streaming musical',
          en: 'Music streaming'
        },
        category: categories.find(c => c.name === 'Streaming')._id,
        isValidated: true,
        website: 'https://spotify.com',
        requestedBy: users[1]._id,
      },
      {
        name: {
          fr: 'Airbnb',
          en: 'Airbnb'
        },
        description: {
          fr: 'Location de logements',
          en: 'Accommodation rental'
        },
        category: categories.find(c => c.name === 'Voyage')._id,
        isValidated: true,
        website: 'https://airbnb.fr',
        requestedBy: users[1]._id,
      },
      {
        name: {
          fr: 'Revolut',
          en: 'Revolut'
        },
        description: {
          fr: 'Banque en ligne',
          en: 'Online banking'
        },
        category: categories.find(c => c.name === 'Finance')._id,
        isValidated: true,
        website: 'https://revolut.com',
        requestedBy: users[2]._id,
      },
      {
        name: {
          fr: 'Steam',
          en: 'Steam'
        },
        description: {
          fr: 'Plateforme de jeux PC',
          en: 'PC gaming platform'
        },
        category: categories.find(c => c.name === 'Jeux')._id,
        isValidated: true,
        website: 'https://store.steampowered.com',
        requestedBy: users[2]._id,
      },
      {
        name: {
          fr: 'Uber Eats',
          en: 'Uber Eats'
        },
        description: {
          fr: 'Livraison de repas',
          en: 'Food delivery'
        },
        category: categories.find(c => c.name === 'Food')._id,
        isValidated: true,
        website: 'https://ubereats.com',
        requestedBy: users[0]._id,
      },
      {
        name: {
          fr: 'Netflix',
          en: 'Netflix'
        },
        description: {
          fr: 'Streaming vidéo',
          en: 'Video streaming'
        },
        category: categories.find(c => c.name === 'Streaming')._id,
        isValidated: false,
        website: 'https://netflix.com',
        requestedBy: users[1]._id,
      },
      {
        name: {
          fr: 'Disney+',
          en: 'Disney+'
        },
        description: {
          fr: 'Streaming vidéo et films',
          en: 'Video and movies streaming'
        },
        category: categories.find(c => c.name === 'Streaming')._id,
        isValidated: false,
        website: 'https://disneyplus.com',
        requestedBy: users[2]._id,
        validationReason: 'Service déjà présent sous un autre nom',
      },
    ]);

    console.log(`✅ Created ${services.length} services`);

    // Create Referrals with specific dates for scoring tests
    console.log('🔗 Creating referrals...');
    const referralsData = [];

    const now = new Date();
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const threeMonthsAgo = new Date(now - 90 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now - 180 * 24 * 60 * 60 * 1000);

    // User 0 (john_doe) - 5 referrals with varied dates (will get risky badge)
    referralsData.push(
      {
        service: services.find(s => s.name.fr === 'Uber')._id,
        user: users[0]._id,
        link: 'https://uber.com/invite/johndoe123',
        description: {
          fr: 'Recevez 10€ de réduction sur votre première course',
          en: 'Get €10 off your first ride'
        },
        type: 'permanent',
        dateDebut: oneWeekAgo,
        dateFin: new Date(oneWeekAgo.getTime() + 90 * 24 * 60 * 60 * 1000), // 90 days from creation
        isActive: true,
        createdAt: oneWeekAgo, // Very recent
      },
      {
        service: services.find(s => s.name.fr === 'Amazon')._id,
        user: users[0]._id,
        link: 'https://amazon.fr/ref/john123',
        description: {
          fr: '15€ de réduction sur votre première commande',
          en: '€15 off your first order'
        },
        type: 'temporary',
        dateDebut: twoWeeksAgo,
        dateFin: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
        isActive: true,
        createdAt: twoWeeksAgo, // Recent
      },
      {
        service: services.find(s => s.name.fr === 'Revolut')._id,
        user: users[0]._id,
        link: 'https://revolut.com/referral/john1234',
        description: {
          fr: 'Carte gratuite et 10€ offerts',
          en: 'Free card and €10 offered'
        },
        type: 'permanent',
        dateDebut: oneMonthAgo,
        dateFin: new Date(oneMonthAgo.getTime() + 90 * 24 * 60 * 60 * 1000),
        isActive: false, // Inactive
        createdAt: oneMonthAgo, // Moderately recent
      },
      {
        service: services.find(s => s.name.fr === 'Uber Eats')._id,
        user: users[0]._id,
        link: 'https://ubereats.com/invite/john789',
        description: {
          fr: 'Livraison gratuite sur votre première commande',
          en: 'Free delivery on your first order'
        },
        type: 'temporary',
        dateDebut: threeMonthsAgo,
        dateFin: new Date(threeMonthsAgo.getTime() + 30 * 24 * 60 * 60 * 1000), // Already expired
        isActive: true,
        createdAt: threeMonthsAgo, // Older
      },
      {
        service: services.find(s => s.name.fr === 'Steam')._id,
        user: users[0]._id,
        code: 'JOHNGAMES',
        description: {
          fr: 'Rejoignez ma communauté Steam',
          en: 'Join my Steam community'
        },
        type: 'permanent',
        dateDebut: sixMonthsAgo,
        dateFin: new Date(sixMonthsAgo.getTime() + 90 * 24 * 60 * 60 * 1000),
        isActive: true,
        createdAt: sixMonthsAgo, // Very old
      }
    );

    // User 1 (jane_smith) - 15 referrals (should get 10+ badge)
    // Mix of dates to test recency scoring
    for (let i = 0; i < 15; i++) {
      const serviceNames = ['Uber', 'Amazon', 'Spotify', 'Airbnb', 'Revolut', 'Steam', 'Uber Eats'];
      const serviceName = serviceNames[i % serviceNames.length];
      const service = services.find(s => s.name.fr === serviceName);

      // Vary creation dates
      let createdDate;
      if (i < 5) createdDate = oneWeekAgo;
      else if (i < 10) createdDate = oneMonthAgo;
      else createdDate = threeMonthsAgo;

      if (service) {
        const isPermanent = i % 3 !== 0; // 2/3 permanent, 1/3 temporary
        referralsData.push({
          service: service._id,
          user: users[1]._id,
          link: `https://${serviceName.toLowerCase().replace(' ', '')}.com/invite/jane${i}`,
          description: `Code parrainage #${i + 1} pour ${serviceName}`,
          type: isPermanent ? 'permanent' : 'temporary',
          dateDebut: createdDate,
          dateFin: isPermanent
            ? new Date(createdDate.getTime() + 90 * 24 * 60 * 60 * 1000)
            : new Date(now.getTime() + (15 + i) * 24 * 60 * 60 * 1000), // Temporary: expires in 15+ days
          isActive: i % 5 !== 4, // 80% active
          createdAt: createdDate,
        });
      }
    }

    // User 2 (bob_wilson) - 52 referrals (should get 50+ badge)
    for (let i = 0; i < 52; i++) {
      const serviceNames = ['Uber', 'Amazon', 'Spotify', 'Airbnb', 'Revolut', 'Steam', 'Uber Eats'];
      const serviceName = serviceNames[i % serviceNames.length];
      const service = services.find(s => s.name.fr === serviceName);

      // Most are older, some recent
      let createdDate;
      if (i < 5) createdDate = twoWeeksAgo;
      else if (i < 20) createdDate = oneMonthAgo;
      else createdDate = threeMonthsAgo;

      if (service) {
        const isPermanent = i % 4 !== 0; // 3/4 permanent, 1/4 temporary
        referralsData.push({
          service: service._id,
          user: users[2]._id,
          code: `BOB${serviceName.toUpperCase().slice(0, 4)}${i}`,
          description: `Code parrainage Bob #${i + 1}`,
          type: isPermanent ? 'permanent' : 'temporary',
          dateDebut: createdDate,
          dateFin: isPermanent
            ? new Date(createdDate.getTime() + 90 * 24 * 60 * 60 * 1000)
            : new Date(now.getTime() + (10 + i % 20) * 24 * 60 * 60 * 1000), // Temporary: varied expiry
          isActive: i % 4 !== 3, // 75% active
          createdAt: createdDate,
        });
      }
    }

    // User 3 (alice_pro) - 105 referrals (should get 100+ badge)
    for (let i = 0; i < 105; i++) {
      const serviceNames = ['Uber', 'Amazon', 'Spotify', 'Airbnb', 'Revolut', 'Steam', 'Uber Eats'];
      const serviceName = serviceNames[i % serviceNames.length];
      const service = services.find(s => s.name.fr === serviceName);

      // Wide distribution of dates
      let createdDate;
      if (i < 10) createdDate = oneWeekAgo;
      else if (i < 30) createdDate = oneMonthAgo;
      else if (i < 60) createdDate = threeMonthsAgo;
      else createdDate = sixMonthsAgo;

      if (service) {
        const isPermanent = i % 2 === 0; // 50/50 split
        referralsData.push({
          service: service._id,
          user: users[3]._id,
          link: `https://${serviceName.toLowerCase().replace(' ', '')}.com/ref/alice${i}`,
          description: `Offre exclusive Alice #${i + 1}`,
          type: isPermanent ? 'permanent' : 'temporary',
          dateDebut: createdDate,
          dateFin: isPermanent
            ? new Date(createdDate.getTime() + 90 * 24 * 60 * 60 * 1000)
            : new Date(now.getTime() + (5 + i % 30) * 24 * 60 * 60 * 1000), // Temporary: varied expiry
          isActive: i % 10 !== 9, // 90% active
          createdAt: createdDate,
        });
      }
    }

    // User 4 (charlie_expert) - 12 referrals (will get trusted badge + 10+ badge)
    // Mix of recent and older
    for (let i = 0; i < 12; i++) {
      const serviceNames = ['Uber', 'Amazon', 'Spotify', 'Airbnb', 'Revolut', 'Steam'];
      const serviceName = serviceNames[i % serviceNames.length];
      const service = services.find(s => s.name.fr === serviceName);

      let createdDate;
      if (i < 4) createdDate = oneWeekAgo; // Very recent
      else if (i < 8) createdDate = twoWeeksAgo; // Recent
      else createdDate = oneMonthAgo; // Moderately recent

      if (service) {
        const isPermanent = i % 3 === 0; // 1/3 permanent, 2/3 temporary
        referralsData.push({
          service: service._id,
          user: users[4]._id,
          code: `CHARLIE${i}`,
          description: `Code expert Charlie #${i + 1}`,
          type: isPermanent ? 'permanent' : 'temporary',
          dateDebut: createdDate,
          dateFin: isPermanent
            ? new Date(createdDate.getTime() + 90 * 24 * 60 * 60 * 1000)
            : new Date(now.getTime() + (20 + i * 2) * 24 * 60 * 60 * 1000), // Temporary: long expiry
          isActive: true, // All active (trusted user)
          createdAt: createdDate,
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
        link: `/services/${services.find(s => s.name.fr === 'Uber')._id}`,
        isRead: true,
      },
      {
        userId: users[1]._id,
        title: 'Service "Netflix" en attente',
        content: 'Votre demande de service "Netflix" est en cours de validation par un administrateur.',
        link: `/services/${services.find(s => s.name.fr === 'Netflix')._id}`,
        isRead: false,
      },
      {
        userId: users[2]._id,
        title: 'Service "Disney+" rejeté',
        content: 'Votre demande de service "Disney+" a été rejetée: Service déjà présent sous un autre nom.',
        link: `/services/${services.find(s => s.name.fr === 'Disney+')._id}`,
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
        link: `/services/${services.find(s => s.name.fr === 'Spotify')._id}`,
        isRead: true,
      },
    ]);

    console.log(`✅ Created ${notifications.length} notifications`);

    // Create Promoted Referrals
    console.log('👑 Creating promotions...');
    const promotedReferrals = await PromReferral.create([
      {
        referral: referrals.find(r => r.user.toString() === users[4]._id.toString() && r.description.includes('#1'))._id,
        dateDebut: new Date(now - 2 * 24 * 60 * 60 * 1000), // Started 2 days ago
        dateFin: new Date(now + 5 * 24 * 60 * 60 * 1000), // Ends in 5 days
      },
      {
        referral: referrals.find(r => r.user.toString() === users[3]._id.toString() && r.description.includes('#5'))._id,
        dateDebut: new Date(now - 1 * 24 * 60 * 60 * 1000), // Started yesterday
        dateFin: new Date(now + 10 * 24 * 60 * 60 * 1000), // Ends in 10 days
      },
    ]);
    console.log(`✅ Created ${promotedReferrals.length} promotions`);

    const totalBadges = await Badge.countDocuments();

    console.log('\n✨ Seed data created successfully!\n');
    console.log('📋 Summary:');
    console.log(`   - Users: ${users.length + 1} (admin: admin@turboreferral.com, password: password123)`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Services: ${services.length} (${services.filter(s => s.isValidated).length} validated)`);
    console.log(`   - Referrals: ${referrals.length}`);
    console.log(`   - Votes: ${votes.length}`);
    console.log(`   - Badges: ${totalBadges}`);
    console.log(`   - Promotions: ${promotedReferrals.length}`);
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
