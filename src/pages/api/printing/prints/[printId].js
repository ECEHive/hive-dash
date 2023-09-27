import { ObjectId } from 'mongodb';

import { validatePerms } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

import { PITypes } from '@/util/roles';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;
    const { printId } = req.query;

    if (req.method === 'PUT') {
        const hasPerms = await validatePerms(req, PITypes.PI);

        if (!hasPerms) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const body = req.body;

        delete body._id;

        const data = await mongoClient
            .db('printing')
            .collection('print-log')
            .updateOne(
                {
                    _id: new ObjectId(printId)
                },
                {
                    $set: {
                        ...body
                    }
                }
            );

        res.status(200).json(data);
    } else if (req.method === 'DELETE') {
        const hasPerms = await validatePerms(req, PITypes.MPI);

        if (!hasPerms) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const data = await mongoClient
            .db('printing')
            .collection('print-log')
            .deleteOne({
                _id: new ObjectId(printId)
            });

        res.status(200).json(data);
    }
}
