import client from "@/lib/db";
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { collectionName, id } = req.query;
        try {
            const database = client.db();
            const collection = database.collection(collectionName);
            const newId = new ObjectId(id)
            const result = await collection.findOne({ _id: newId });
            res.status(200).json(result)
        } catch (err) {
            console.error('Error getting document:', err);
            throw err;
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
