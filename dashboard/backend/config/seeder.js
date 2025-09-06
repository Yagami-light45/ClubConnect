const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Club = require('../models/Club');
const { users, clubs } = require('../data/seedUsers');
const connectDB = require('./db');

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('Clearing existing data...');
        await mongoose.model('User').deleteMany({});
        await mongoose.model('Club').deleteMany({});

        console.log('Creating users...');
        // Create users
        const createdUsers = await Promise.all(
            users.map(async (user) => {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(user.password, salt);
                
                return await User.create({
                    ...user,
                    password: hashedPassword
                });
            })
        );

        // Find clubhead user
        const clubHead = createdUsers.find(user => user.role === 'clubhead');

        console.log('Creating clubs...');
        // Create clubs with clubhead reference
        await Promise.all(
            clubs.map(async (club) => {
                return await Club.create({
                    ...club,
                    head: clubHead._id
                });
            })
        );

        console.log('Database seeded successfully! 🌱');
        console.log('\nTest Credentials:');
        console.log('------------------');
        console.log('Admin User:     admin@test.com / admin123');
        console.log('Club Head:      clubhead@test.com / club123');
        console.log('Student:        student@test.com / student123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
