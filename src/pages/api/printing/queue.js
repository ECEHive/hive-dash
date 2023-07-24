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
        const data = await mongoClient.db('printing').collection('print-log').find().sort({ queuedAt: 1 }).toArray();

        //.find({ completed: false })

        res.status(200).json(data);
    }
}
