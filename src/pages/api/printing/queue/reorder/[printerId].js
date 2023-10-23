import { validateRequest } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

import { PITypes } from '@/util/roles';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;
    const { printerId } = req.query;

    if (req.method === 'PUT') {
        let uid,
            allowed = await validateRequest(req, PITypes.MPI);
        if (!allowed) return res.status(401).json({ message: 'Unauthorized' });

        const body = req.body;

        const data = await mongoClient
            .db('printing')
            .collection('printers')
            .findOneAndUpdate(
                {
                    id: printerId
                },
                {
                    $set: {
                        queue: body.reorderedQueue
                    }
                }
            );

        res.status(200).json(data);
    }
}
