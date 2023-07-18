import clientPromise from '@/lib/mongodb';

import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    const mongoClient = await clientPromise;
    const { printerId } = req.query;

    if (req.method === 'PUT') {
        const body = req.body;

        delete body._id;

        console.log(body)

        const data = await mongoClient
            .db('printing')
            .collection('printers')
            .updateOne(
                {
                    _id: new ObjectId(printerId)
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
