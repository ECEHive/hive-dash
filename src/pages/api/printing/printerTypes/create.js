import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    if (req.method === 'POST') {
        const data = req.body;

        const result = await mongoClient.db('printing').collection('printer-types').insertOne(data);

        res.status(200).json({ message: 'success' });
    }
}
