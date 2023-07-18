import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    if (req.method === 'POST') {
        const body = req.body;

        const data = await mongoClient
            .db('printing')
            .collection('print-log')
            .insertOne({
                ...body
            });

        res.status(200).json(data);
    } else if (req.method === 'GET') {
        const data = await mongoClient
            .db('printing')
            .collection('print-log')
            .find({ complete: false })
            .sort({ queuedAt: 1 })
            .toArray();

        res.status(200).json(data);
    }
}
