import client from "@/lib/db";
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { collectionName, document } = req.body;

        try {
            const database = client.db();
            const collection = database.collection(collectionName);
            const result = await collection.insertOne(document);
            res.status(200).json({ ...result, _id: result.insertedId })
        } catch (err) {
            console.error('Error adding document:', err);
            throw err;
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}