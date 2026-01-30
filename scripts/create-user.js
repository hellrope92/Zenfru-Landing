const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://admin:Dentalai25@zenfru.3cejkij.mongodb.net/?retryWrites=true&w=majority&appName=Zenfru";
const email = "dev@zenfru.com";
const password = "zenfru1234";
const name = "Developer";

async function createUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Connect to MongoDB
    const client = await MongoClient.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = client.db("demo_dashboard");
    
    // Insert user
    const result = await db.collection('users').insertOne({
      email: email.toLowerCase(),
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
