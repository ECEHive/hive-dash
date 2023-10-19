import { validateRequest } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

import { PITypes } from '@/util/roles';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    if (req.method === 'POST') {
        let uid,
            allowed = await validateRequest(req, PITypes.PI);
        if (!allowed) return res.status(401).json({ message: 'Unauthorized' });

        const body = req.body;

        const data = await mongoClient
            .db('printing')
            .collection('print-log')
            .insertOne({
                ...body
            });

        const printId = data.insertedId.toString();

        const printer = await mongoClient
            .db('printing')
            .collection('printers')
            .findOneAndUpdate(
                {
                    id: body.printer
                },
                {
                    $push: {
                        queue: printId
                    }
                }
            );

        const queueLength = printer.value.queue.length;

        res.status(200).json({ queueLength: queueLength });
    } else if (req.method === 'GET') {
        const data = await mongoClient.db('printing').collection('print-log').find().sort({ queuedAt: 1 }).toArray();

        //.find({ completed: false })

        res.status(200).json(data);
    }
}
