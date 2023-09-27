import { validatePerms } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

import { PITypes } from '@/util/roles';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    const hasPerms = await validatePerms(req, PITypes.MPI);

    if (!hasPerms) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    if (req.method === 'POST') {
        const data = req.body;

        const result = await mongoClient.db('printing').collection('printers').insertOne(data);

        res.status(200).json({ message: 'success' });
    }
}
