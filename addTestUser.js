require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const addTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const testUser = new User({
      username: 'testuser',
      password: await bcrypt.hash('testpassword', 10)
    });

    await testUser.save();
    console.log('Test user added successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding test user:', error);
  }
};

addTestUser();