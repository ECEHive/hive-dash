import { authToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    if (req.method === 'GET') {
        const uid = await authToken(req);
        if (!uid) return res.status(401).json({ message: 'Unauthorized' });

        const data = await mongoClient.db('global-config').collection('peer-instructors').findOne({
            uid: uid
        });

        res.status(200).json(data);
    }
}
