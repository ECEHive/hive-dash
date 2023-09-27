import { validatePerms } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

import { PITypes } from '@/util/roles';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    if (req.method === 'POST') {
        const hasPerms = await validatePerms(req, PITypes.PI);

        if (!hasPerms) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const body = req.body;

        const data = await mongoClient
            .db('printing')
            .collection('print-log')
            .insertOne({
                ...body
            });

        const queue = await mongoClient
            .db('printing')
            .collection('print-log')
            .find({ printer: body.printer, state: 0 })
            .toArray();

        res.status(200).json({ queueLength: queue.length });
    } else if (req.method === 'GET') {
        const data = await mongoClient.db('printing').collection('print-log').find().sort({ queuedAt: 1 }).toArray();

        //.find({ completed: false })

        res.status(200).json(data);
    }
}
