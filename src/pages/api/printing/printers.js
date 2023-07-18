import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    if (req.method === 'GET') {
        const data = await mongoClient
            .db('printing')
            .collection('printers')
            .find()
            .toArray();

        res.status(200).json(data);
    }
}
