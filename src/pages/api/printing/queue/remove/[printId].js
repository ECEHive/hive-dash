import { validateRequest } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

import { PITypes } from '@/util/roles';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;
    const { printId } = req.query;

    if (req.method === 'DELETE') {
        let uid,
            allowed = await validateRequest(req, PITypes.MPI);
        if (!allowed) return res.status(401).json({ message: 'Unauthorized' });

        const data = await mongoClient
            .db('printing')
            .collection('printers')
            .findOneAndUpdate(
                {
                    queue: printId
                },
                {
                    $pull: {
                        queue: printId
                    }
                }
            );

        res.status(200).json(data);
    }
}
