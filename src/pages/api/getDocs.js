import client from '../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { collectionName, data } = req.body;
        try {
            const database = client.db();
            const collection = database.collection(collectionName);
            console.log(data, collectionName, 'the query')
            if (data) {
                const result = await collection.find(data).toArray();
                res.status(200).json(result)
            } else {
                const result = await collection.find({}).toArray(); // Fetch all documents if no query provided
                res.status(200).json(result)
            }
        } catch (err) {
            console.error('Error getting documents:', err);
            throw err;
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
