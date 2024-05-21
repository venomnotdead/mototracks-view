// lib/db.js
import { MongoClient } from 'mongodb';

// Connection URI
const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
const client = new MongoClient(uri);

// Function to connect to the MongoDB database
 async function connectToDatabase() {
    console.log(uri,'the url')
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

// Function to close the MongoDB connection
async function closeDatabaseConnection() {
    try {
        await client.close();
        console.log('Closed MongoDB connection');
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
    }
}

// Export functions to connect and close the database
export { connectToDatabase, closeDatabaseConnection };

// Export the MongoDB client for use in API routes or server-side code
export default client;
