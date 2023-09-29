import { validateRequest } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

import { PITypes } from '@/util/roles';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    let uid,
        allowed = await validateRequest(req, PITypes.MPI);
    if (!allowed) return res.status(401).json({ message: 'Unauthorized' });

    if (req.method === 'POST') {
        const data = req.body;

        const result = await mongoClient.db('printing').collection('printer-types').insertOne(data);

        res.status(200).json({ message: 'success' });
    }
}
