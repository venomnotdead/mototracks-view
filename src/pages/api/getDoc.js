import client from "@/lib/db";
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { collectionName, id } = req.query;
        try {
            const database = client.db();
            const collection = database.collection(collectionName);
            const newId = new ObjectId(id);
            const result = await collection.findOne({ _id: newId });

            if (result) {
                // Stream the JSON response
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Transfer-Encoding': 'chunked'
                });

                // Convert the result to a JSON string and split into chunks
                const resultString = JSON.stringify(result);
                const chunkSize = 1024; // Adjust chunk size as needed

                for (let i = 0; i < resultString.length; i += chunkSize) {
                    const chunk = resultString.slice(i, i + chunkSize);
                    res.write(chunk);
                }

                res.end();
            } else {
                res.status(404).json({ error: 'Document not found' });
            }
        } catch (err) {
            console.error('Error getting document:', err);
            res.status(500).json({ error: 'Error getting document' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
