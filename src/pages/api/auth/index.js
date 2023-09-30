import { deleteUser } from '@/pages/api/firebase';
import { ObjectId } from 'mongodb';

import { validateRequest } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

import { PITypes } from '@/util/roles';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    if (req.method === 'POST') {
        let _,
            allowed = await validateRequest(req, PITypes.MPI);
        if (!allowed) return res.status(401).json({ message: 'Unauthorized' });

        const body = req.body;
        const { uid, mongoId } = body;

        const deleted = await deleteUser(uid);

        console.log(deleted);

        if (deleted) {
            const data = await mongoClient
                .db('global-config')
                .collection('peer-instructors')
                .updateOne(
                    {
                        _id: new ObjectId(mongoId)
                    },
                    {
                        $set: {
                            uid: null
                        }
                    }
                );
            console.log(data);
            res.status(200).json({ success: true });
        } else {
            res.status(500).json({ message: 'Error deleting user' });
        }
    }
}
