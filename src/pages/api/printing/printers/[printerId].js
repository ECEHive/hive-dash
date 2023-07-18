import clientPromise from '@/lib/mongodb';

import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;
    const { printId } = req.query;

    if (req.method === 'PUT') {
        const body = req.body;

        delete body._id;

        const data = await mongoClient
            .db('printing')
            .collection('printers')
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
    }
}
