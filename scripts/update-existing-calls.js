const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb+srv://admin:Dentalai25@zenfru.3cejkij.mongodb.net/?retryWrites=true&w=majority&appName=Zenfru";

async function updateExistingCalls() {
  try {
    const client = await MongoClient.connect(uri);
    console.log('Connected to MongoDB');

    const db = client.db("demo_dashboard");
    
    // Get the first user
    const user = await db.collection('users').findOne({});
    
    if (!user) {
      console.error('No user found in database.');
      await client.close();
      return;
    }

    console.log('Updating existing calls to link with user:', user.email);

    // Update all calls that don't have a proper userId
    const result = await db.collection('calls').updateMany(
      {
        $or: [
          { userId: { $exists: false } },
          { userId: null },
          { userId: { $not: { $type: "string" } } }
        ]
      },
      {
        $set: {
          userId: user._id.toString()
        }
      }
    );

    console.log('Updated', result.modifiedCount, 'calls');

    await client.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

updateExistingCalls();
