import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    if (req.method === 'POST') {
        const body = req.body;
        const type = body.type;
        const data = body.data;

        let result;

        if (type === 'single') {
            result = await mongoClient.db('global-config').collection('peer-instructors').insertOne(data);
        } else if (type === 'batch') {
            result = await mongoClient.db('global-config').collection('peer-instructors').insertMany(data);
        }

        res.status(200).json({ message: 'success' });
    }
}
