import { createUser } from '@/pages/api/firebase';
import { ObjectId } from 'mongodb';

import { validateRequest } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

import { PITypes } from '@/util/roles';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;

    if (req.method === 'POST') {
        let uid,
            allowed = await validateRequest(req, PITypes.MPI);
        if (!allowed) return res.status(401).json({ message: 'Unauthorized' });

        const body = req.body;
        const { email, password, mongoId } = body;

        console.log(email, password);

        const newUser = await createUser(email, password);

        console.log(newUser);

        if (newUser.uid) {
            const data = await mongoClient
                .db('global-config')
                .collection('peer-instructors')
                .updateOne(
                    {
                        _id: new ObjectId(mongoId)
                    },
                    {
                        $set: {
                            uid: newUser.uid
                        }
                    }
                );
            console.log(data);
            res.status(200).json(newUser);
        } else {
            res.status(500).json({ message: 'Error creating user' });
        }
    }
}
