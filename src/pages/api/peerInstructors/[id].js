import { ObjectId } from 'mongodb';

import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;
    const { id } = req.query;

    if (req.method === 'PUT') {
        const body = req.body;

        delete body._id;

        const data = await mongoClient
            .db('global-config')
            .collection('peer-instructors')
            .updateOne(
                {
                    _id: new ObjectId(id)
                },
                {
                    $set: {
                        ...body
                    }
                }
            );

        res.status(200).json(data);
    } else if (req.method === 'DELETE') {
        const data = await mongoClient
            .db('global-config')
            .collection('peer-instructors')
            .deleteOne({
                _id: new ObjectId(id)
            });

        res.status(200).json(data);
    }
}
