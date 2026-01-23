const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://krittika_bisht_019:OtX8gpqGoY01AwHu@cluster0.8rpxjum.mongodb.net/";
const email = "krittikabisht019@gmail.com";
const password = "krittika019";
const name = "Krittika";

async function createUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Connect to MongoDB
    const client = await MongoClient.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = client.db();
    
    // Insert user
    const result = await db.collection('users').insertOne({
      email: email,
      password: hashedPassword,
      name: name,
      createdAt: new Date()
    });

    console.log('User created successfully!');
    console.log('User ID:', result.insertedId);
    console.log('\nYou can now sign in with:');
    console.log('Email:', email);
    console.log('Password:', password);

    await client.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

createUser();
