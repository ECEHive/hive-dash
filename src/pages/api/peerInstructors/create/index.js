import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    if (req.method === 'POST') {
        const data = await mongoClient.db('global-config').collection('peer-instructors').insertOne(req.body);

        res.status(200).json({ peerInstructors: data });
    }
}
