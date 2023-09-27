import { validatePerms } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

import { PITypes } from '@/util/roles';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    const { configId } = req.query;

    if (req.method === 'GET') {
        const data = await mongoClient.db('global-config').collection('general').find({ id: configId }).toArray();

        //.find({ completed: false })

        res.status(200).json({ config: data[0] });
    } else if (req.method === 'PUT') {
        const hasPerms = await validatePerms(req, PITypes.MPI);

        if (!hasPerms) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const body = req.body;

        delete body._id;

        const data = await mongoClient
            .db('global-config')
            .collection('general')
            .updateOne({ id: configId }, { $set: { ...body } });

        res.status(200).json({ data });
    }
}
