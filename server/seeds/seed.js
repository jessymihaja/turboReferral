require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../models/User');
const Category = require('../models/Category');
const Service = require('../models/Service');
const Referral = require('../models/Referral');
const ReferralVote = require('../models/ReferralVote');
const PromReferral = require('../models/PromReferral');
const Notification = require('../models/Notification');

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
    const referrals = await Referral.create([
      {
        service: services.find(s => s.name === 'Uber')._id,
        user: users[0]._id,
        link: 'https://uber.com/invite/johndoe123',
        description: 'Recevez 10€ de réduction sur votre première course',
      },
      {
        service: services.find(s => s.name === 'Uber')._id,
        user: users[1]._id,
        code: 'JANE2024',
        description: '5€ offerts pour vous et votre filleul',
      },
      {
        service: services.find(s => s.name === 'Amazon')._id,
        user: users[0]._id,
        link: 'https://amazon.fr/ref/john123',
        description: '15€ de réduction sur votre première commande',
      },
      {
        service: services.find(s => s.name === 'Spotify')._id,
        user: users[2]._id,
        code: 'BOBMUSIC',
        description: '1 mois gratuit de Spotify Premium',
      },
      {
        service: services.find(s => s.name === 'Airbnb')._id,
        user: users[1]._id,
        link: 'https://airbnb.fr/c/janesmith',
        description: '25€ de réduction sur votre premier séjour',
      },
      {
        service: services.find(s => s.name === 'Revolut')._id,
        user: users[0]._id,
        link: 'https://revolut.com/referral/john1234',
        description: 'Carte gratuite et 10€ offerts',
      },
      {
        service: services.find(s => s.name === 'Steam')._id,
        user: users[2]._id,
        code: 'BOBGAMES2024',
        description: '5€ de crédit Steam offerts',
      },
      {
        service: services.find(s => s.name === 'Uber Eats')._id,
        user: users[1]._id,
        link: 'https://ubereats.com/invite/jane456',
        description: '20€ de réduction sur vos 3 premières commandes',
      },
    ]);

    console.log(`✅ Created ${referrals.length} referrals`);

    // Create Votes
    console.log('👍 Creating votes...');
    const votes = [];

    // Add votes for first 4 referrals
    for (let i = 0; i < 4; i++) {
      const referral = referrals[i];

      // Each referral gets votes from 2 users
      const votersCount = Math.min(2, users.length);
      for (let j = 0; j < votersCount; j++) {
        const voter = users[j];

        // Skip if user is voting on their own referral
        if (voter._id.toString() === referral.user.toString()) continue;

        votes.push({
          referral: referral._id,
          user: voter._id,
          vote: Math.random() > 0.3 ? 'good' : 'bad', // 70% good votes
          comment: Math.random() > 0.5 ? 'Fonctionne parfaitement !' : '',
        });
      }
    }

    await ReferralVote.create(votes);
    console.log(`✅ Created ${votes.length} votes`);

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

    console.log('\n✨ Seed data created successfully!\n');
    console.log('📋 Summary:');
    console.log(`   - Users: ${users.length + 1} (admin: admin@turboreferral.com, password: password123)`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Services: ${services.length} (${services.filter(s => s.isValidated).length} validated)`);
    console.log(`   - Referrals: ${referrals.length}`);
    console.log(`   - Votes: ${votes.length}`);
    console.log(`   - Notifications: ${notifications.length}`);
    console.log('\n🔑 Login credentials:');
    console.log('   Admin: admin@turboreferral.com / password123');
    console.log('   User 1: john@example.com / password123');
    console.log('   User 2: jane@example.com / password123');
    console.log('   User 3: bob@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
