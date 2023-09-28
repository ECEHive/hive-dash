import { validatePerms } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

import { PITypes } from '@/util/roles';
import { PrintStates } from '@/util/states';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    if (req.method === 'POST') {
        const hasPerms = await validatePerms(req, PITypes.PI);

        if (!hasPerms) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const body = req.body;

        const queue = await mongoClient
            .db('printing')
            .collection('print-log')
            .find({ printer: body.printer, state: PrintStates.QUEUED })
            .toArray();

        const maxOrder = Math.max(...queue.map((print) => print.order));

        body.order = maxOrder + 1;

        const data = await mongoClient
            .db('printing')
            .collection('print-log')
            .insertOne({
                ...body
            });

        res.status(200).json({ queueLength: queue.length + 1 });
    } else if (req.method === 'GET') {
        const data = await mongoClient.db('printing').collection('print-log').find().sort({ order: 1 }).toArray();

        //.find({ completed: false })

        res.status(200).json(data);
    }
}
